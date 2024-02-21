import enum

# Enum for QuestionDifficulty
class QuestionDifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionTypeEnum(str, enum.Enum):
    single_select_mcq = "single_select_mcq"
    multi_select_mcq = "multi_select_mcq"
    open_text_question = "open_text_question"
    coding_question = "coding_question"