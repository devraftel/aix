from sqlmodel import select, func, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy.orm import selectinload
from typing import Optional

from app import crud
from app.models.quiz_attempt_model import QuizAttempt, QuizAnswerSlot, QuizAnswerOption

from app.schemas.quiz_attempt_schema import IQuizAttemptCreate, IQuizAnswerSlotCreate, IQuizAnswerSlotRead
from sqlalchemy.engine.result import ScalarResult


class CRUDQuizAttemptEngine:
    # 1. Create Quiz Attempt
    async def create_quiz_attempt(self, db_session: AsyncSession, quiz_attempt: IQuizAttemptCreate):
        """
        Create a Quiz Attempt Entry in the Database whenever a student attempts a quiz
        """
        try:
            db_quiz_attempt = QuizAttempt.model_validate(quiz_attempt)
            db_session.add(db_quiz_attempt)
            await db_session.commit()
            await db_session.refresh(db_quiz_attempt)
            return db_quiz_attempt
        except Exception as e:
            await db_session.rollback()
            raise e

    # 2. Get Quiz Attempt by ID
    async def get_quiz_attempt_by_id(self, db_session: AsyncSession, quiz_attempt_id: UUID):
        """
        Get Quiz Attempt by ID
        """
        return await db_session.get(QuizAttempt, quiz_attempt_id)

    # Check if time_limit + time_start is greater than current time
    async def is_quiz_attempt_active(self, db_session: AsyncSession, quiz_attempt_id: UUID):
        """
        Check if the Quiz Attempt is still active
            If yes, then the quiz is still active and return True
            If not add time_finish to quiz_id and return False
        """

        quiz_attempt = await self.get_quiz_attempt_by_id(db_session=db_session, quiz_attempt_id=quiz_attempt_id)
        if not quiz_attempt:
            raise ValueError("Invalid Quiz Attempt ID")

        # Calculate the end time of the quiz
        end_time = quiz_attempt.time_start + quiz_attempt.time_limit

        # Check if current UTC time is past the end time
        if datetime.utcnow() < end_time:
            print("\n-----Quiz is still active----\n")
            return True
        else:
            print("\n-----Quiz is not active----\n")
            quiz_attempt.time_finish = datetime.utcnow()
            await db_session.commit()
            return False
        
    # Finish the quiz
    async def finish_quiz_attempt(self, db_session: AsyncSession, quiz_attempt_id: UUID):
        """
        Finish the Quiz Attempt
        """
        #1. Load the Quiz Attempt with QuizAnswerSlot
        quiz_active_attempt_exec= await db_session.exec(select(QuizAttempt).options(selectinload(QuizAttempt.quiz_answers)).where(QuizAttempt.id == quiz_attempt_id))      # type: ignore  
        quiz_active_attempt = quiz_active_attempt_exec.one_or_none()

        if not quiz_active_attempt:
            raise ValueError("Invalid Quiz Attempt ID")

        print("\n-----quiz_active_attempt----\n", quiz_active_attempt)
        print("\n-----quiz_answers----\n", quiz_active_attempt.quiz_answers)

        # 2. Add Finish Time to Quiz Attempt if not already added
        if not quiz_active_attempt.time_finish:
            quiz_active_attempt.time_finish = datetime.utcnow()
            await db_session.commit()

        # 3. Grade & Count
        # 3.1 Check if any Quiz Answer Slot is not graded
        # ...

            # 4. Calculate the total score
            # A Query that returns the sum of points_awarded for all quiz_answer_slots
        attempt_score_exec: ScalarResult = await db_session.exec(select(func.sum(QuizAnswerSlot.points_awarded)).where(QuizAnswerSlot.quiz_attempt_id == quiz_attempt_id))
        attempt_score: float | None = attempt_score_exec.one_or_none()
            
        if attempt_score is None:
            print("\n-----attempt_score is None----\n")
            attempt_score = 0

        print("\n-----attempt_score----\n", attempt_score)

            # 5. Update the Quiz Attempt with attempt_score
        quiz_active_attempt.attempt_score = attempt_score
        await db_session.commit()
        await db_session.refresh(quiz_active_attempt)

        return quiz_active_attempt

class CRUDQuizAnswerSlotEngine:
    # 1. Create Quiz Answer Slot
    async def create_quiz_answer_slot(self, db_session: AsyncSession, quiz_answer_slot: IQuizAnswerSlotCreate):
        """
        Create a Quiz Answer Slot Entry in the Database whenever a student answers a question
        """
        try:
            if quiz_answer_slot.selected_options_ids:
                # Prep to add selected_options
                sanitized_selected_options = []
                for option_id in quiz_answer_slot.selected_options_ids:
                    sanitized_selected_options.append(QuizAnswerOption(option_id=option_id))
                quiz_answer_slot.selected_options.extend(sanitized_selected_options)

            db_quiz_answer_slot = QuizAnswerSlot.model_validate(quiz_answer_slot)
            db_session.add(db_quiz_answer_slot)
            await db_session.commit()
            await db_session.refresh(db_quiz_answer_slot)
            return db_quiz_answer_slot
        except Exception as e:
            await db_session.rollback()
            raise e

    # 2. Grade Quiz Answer Slot
    async def grade_quiz_answer_slot(self, db_session: AsyncSession, quiz_answer_slot: IQuizAnswerSlotRead):
        """
        Grade a Quiz Answer Slot
        """
        try:
            # 1. Get Questions using question_id from question_engine
            question = await crud.question_engine.get_question_by_id(db_session=db_session, question_id=quiz_answer_slot.question_id)


            # 2.1 for single_select_mcq match answer_id with question.mcq_options and update points_awarded
            if quiz_answer_slot.question_type == "single_select_mcq":
                # Get the correct answer
                selected_option_id = quiz_answer_slot.selected_options[0].option_id
                correct_option_id = next((option.id for option in question.mcq_options if option.is_correct), None)
                if selected_option_id == correct_option_id:
                    quiz_answer_slot.points_awarded = question.points
                else:
                    quiz_answer_slot.points_awarded = 0

                await db_session.commit()

            # 2.2 for multi_select_mcq match answer_id with question.mcq_options for total correct and matching correct and update points_awarded
            if quiz_answer_slot.question_type == "multi_select_mcq":
                # Get the correct answer
                selected_option_ids = [option.option_id for option in quiz_answer_slot.selected_options]
                correct_option_ids = [option.id for option in question.mcq_options if option.is_correct]

                if selected_option_ids == correct_option_ids:
                    quiz_answer_slot.points_awarded = question.points
                else:
                    quiz_answer_slot.points_awarded = 0

                await db_session.commit()
            
            # 2.3 for single_line_text match answer_text with question.answer_text and update points_awarded
            if quiz_answer_slot.question_type == "open_text_question":
                # TODO: Replace this with AI pipeline to evaluate the answer and grade it
                if quiz_answer_slot.answer_text == question.correct_answer:
                    quiz_answer_slot.points_awarded = question.points
                else:
                    quiz_answer_slot.points_awarded = 0

                await db_session.commit()

            # Refresh the Quiz Answer Slot
            await db_session.refresh(quiz_answer_slot)
            return quiz_answer_slot
                

            # 3. Update Quiz Answer Slot with points_awarded
        except Exception as e:
            await db_session.rollback()
            raise e


quiz_attempt = CRUDQuizAttemptEngine()

quiz_answer_slot = CRUDQuizAnswerSlotEngine()
