from sqlmodel import select, func, and_
from uuid import UUID
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.question_bank_model import Question, MCQOptions
from app.schemas.question_engine_schema import IQuestionCreate, IBatchQuestionsCreate
from typing import Any

class CRUDQuestionEngine:
    # 1. Create a Question
    async def create_question(self, *, db_session: AsyncSession, question_in: IQuestionCreate):
        """
        - Check Question type (Share we create a Recursive Algo Function for this that will be used here and after words)
           - if single_select_mcq or multi_select_mcq, then create MCQ options
           - if open_text_question create question (answer_text is in same table)
        """
        try:
            # Check if question type is mcq
            if question_in.question_type in ["single_select_mcq", "multi_select_mcq"]:
                if question_in.mcq_options:
                    question_in.mcq_options = [MCQOptions.model_validate(
                        option) for option in question_in.mcq_options]

                # Create the question
                db_question_obj = Question.model_validate(question_in)
                db_session.add(db_question_obj)
                await db_session.commit()
                await db_session.refresh(db_question_obj)
                return db_question_obj
            # if open_text_question create question (answer_text is in same table)
            elif question_in.question_type == "open_text_question":
                db_question_obj = Question.model_validate(question_in)
                db_session.add(db_question_obj)
                await db_session.commit()
                await db_session.refresh(db_question_obj)
                return db_question_obj
            else:
                raise ValueError("Invalid question type")
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    # 1.1 Create a Batch of Questions
    async def create_questions_batch(self, *, db_session: AsyncSession, questions_in: Any):
        """
        1/ prepare all the questions (and their options, if applicable) 
        and commit them to the database in a single transaction. 
        """
        try:
            # # - sanitize and add questions to database
            sanitized_questions_in = IBatchQuestionsCreate(questions=questions_in)
            print("\n---- sanitized_questions_in -----\n", sanitized_questions_in, "\n--------\n")


        # A. Prep Data for Batch Insert
            db_all_questions_obj: list = []
            for question_in in sanitized_questions_in.questions:
                # Step 1: # Check if question type is mcq
                if question_in.question_type in ["single_select_mcq", "multi_select_mcq"]:
                    if question_in.mcq_options:
                        question_in.mcq_options = [MCQOptions.model_validate(option) for option in question_in.mcq_options]

                    # Create the question
                    db_question_obj = Question.model_validate(question_in)
                    db_all_questions_obj.append(db_question_obj)
                # if open_text_question create question (answer_text is in same table)
                elif question_in.question_type == "open_text_question":
                    db_question_obj = Question.model_validate(question_in)
                    db_all_questions_obj.append(db_question_obj)
                else:
                    # Log the Error & Send to True Lens 
                    print("\n---\create_questions_batch:\n")
                    print("Invalid question type for Quiz:", question_in.quiz_id)
                    print("\n---\nquestion_in:", question_in, "\n---\n")
                    # TODO: Setup Feedback to True Lens
                    pass
                    # raise ValueError("Invalid question type")
                
            # B. Commit the Batch to the Database
            db_session.add_all(db_all_questions_obj)
            await db_session.commit()
            return db_all_questions_obj
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    # 2. Get a Question by ID
    async def get_question_by_id(self, *, question_id: UUID, db_session: AsyncSession):
        try:
            query = select(Question).where(Question.id == question_id)
            result = await db_session.exec(query)
            question = result.one_or_none()
            return question
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    # 3. Get all Questions for a quiz
    async def get_all_questions_for_quiz(self, *, quiz_id: UUID, db_session: AsyncSession):
        try:
            query = select(Question).where(Question.quiz_id == quiz_id)
            result = await db_session.exec(query)
            questions = result.all()
            return questions
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    # Get a Single Quiz using the Quiz ID and Question ID
    async def get_single_question_for_quiz(self, *, quiz_id: UUID, question_id: UUID, db_session: AsyncSession):
        try:
            query = select(Question).where(
                and_(Question.quiz_id == quiz_id, Question.id == question_id))
            result = await db_session.exec(query)
            question = result.one_or_none()
            return question
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

    # Count Questions for a Quiz using Quiz ID that's a UUID
    async def get_count_of_questions_for_quiz(self, *, quiz_id: UUID, db_session: AsyncSession):
        try:
            query = select(func.count()).where(Question.quiz_id == quiz_id)
            result = await db_session.exec(query)
            count = result.one()
            return count
        except ValueError as e:
            await db_session.rollback()
            raise e
        except Exception as e:
            await db_session.rollback()
            raise e

question_engine = CRUDQuestionEngine()