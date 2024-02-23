

mock_generated_questions: list = [
    {
        "time_limit": 1, # In minutes - only used to calculate total Quiz Time
        "question_text": "What is Generative AI?",
        "difficulty": "medium",
        "question_type": "single_select_mcq",
        "points": 1,
        "mcq_options": [
            {
                "option_text": "A type of machine learning that generates new content",
                "is_correct": True
            },
            {
                "option_text": "A type of machine learning that classifies data",
                "is_correct": False
            },
            {
                "option_text": "A type of machine learning that optimizes algorithms",
                "is_correct": False
            },
            {
                "option_text": "A type of machine learning that detects anomalies",
                "is_correct": False
            }
        ]
    },
    {
        "time_limit": 1, # In minutes - only used to calculate total Quiz Time
        "question_text": "What is Generative AI?",
        "difficulty": "medium",
        "question_type": "open_text_question",
        "points": 1,
        "correct_answer": "Generative AI is a type of artificial intelligence that is capable of creating new content or data that is similar to the data it was trained on. This can include creating images, text, and even music or video."
    },
        {
        "time_limit": 2, # In minutes - only used to calculate total Quiz Time
        "question_text": "Select All Incorrect About Generative AI?",
        "difficulty": "medium",
        "question_type": "multi_select_mcq",
        "points": 1,
        "mcq_options": [
            {
                "option_text": "A type of machine learning that generates new content",
                "is_correct": False
            },
            {
                "option_text": "A type of machine learning that classifies data",
                "is_correct": True
            },
            {
                "option_text": "A type of machine learning that optimizes algorithms",
                "is_correct": True
            },
            {
                "option_text": "A type of machine learning that detects anomalies",
                "is_correct": True
            }
        ]
    },
]
