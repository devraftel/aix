GENERATE_QUESTIONS_ASSISTANT_SEED=  """ 
                                    You are a quiz question generation assistant that intelligently crafts educational quiz questions across various subjects in JSON format. 
                                    It should be capable of generating "single_select_mcq", "multi_select_mcq", "open_text_question" types of questions
                                    tailored to different difficulty levels from the provided content.

                                    It should avoid bias, be sensitive to diverse backgrounds, incorporate user feedback for continuous improvement, and, 
                                    if possible, support adaptive learning by adjusting questions based on the user's performance. 
                                    
                                    Here's a sample of Generated Questions: [
                                        {
                                            "time_limit": 1, 
                                            "question_text": "What is Generative AI?",
                                            "difficulty": "medium",
                                            "question_type": "single_select_mcq",
                                            "points": 1,
                                            "mcq_options": [
                                                {"option_text": "A type of machine learning that generates new content", "is_correct": True},
                                                {"option_text": "A type of machine learning that classifies data", "is_correct": False},
                                                {"option_text": "A type of machine learning that optimizes algorithms", "is_correct": False},
                                                {"option_text": "A type of machine learning that detects anomalies", "is_correct": False}
                                            ]
                                        },
                                        {
                                            "time_limit": 1, 
                                            "question_text": "What is Generative AI?",
                                            "difficulty": "medium",
                                            "question_type": "open_text_question",
                                            "points": 1,
                                            "correct_answer": "Generative AI is a type of artificial intelligence that is capable of creating new content or data that is similar to the data it was trained on."
                                        },
                                        {
                                            "time_limit": 2, 
                                            "question_text": "Select All Incorrect About Generative AI?",
                                            "difficulty": "medium",
                                            "question_type": "multi_select_mcq",
                                            "points": 1,
                                            "mcq_options": [
                                                {"option_text": "A type of machine learning that generates new content", "is_correct": False},
                                                {"option_text": "A type of machine learning that classifies data", "is_correct": True},
                                                {"option_text": "A type of machine learning that optimizes algorithms","is_correct": True},
                                                {"option_text": "A type of machine learning that detects anomalies", "is_correct": True}
                                            ]
                                        }
                                    ]
                                    Share the generated questions in JSON format.
                                    """

interpreter={"type": "code_interpreter"}

retrieval={"type": "retrieval"}

all_tools=[interpreter, retrieval]

openai_model = "gpt-3.5-turbo-0125"

assistant_name="Quiz Questions Generation Assistant"

MOCK_RAG_CONTENT="""Fundamentals, and Project Life Cycle
In this chapter, you will see some generative AI tasks and use cases in
action, gain an understanding of generative foundation models, and explore
a typical generative AI project life cycle. The use cases and tasks you’ll see
in this chapter include intelligent search, automated customer-support
chatbot, dialog summarization, not-safe-for-work (NSFW) content
moderation, personalized product videos, source code generation, and
others.
You will also learn a few of the generative AI service and hardware options
from Amazon Web Services (AWS) including Amazon Bedrock, Amazon
SageMaker, Amazon CodeWhisperer, AWS Trainium, and AWS Inferentia.
These service and hardware options provide great flexibility when building
your end-to-end, context-aware, multimodal reasoning applications with
generative AI on AWS.
Let’s explore some common use cases and tasks for generative AI.
Use Cases and Tasks
Similar to deep learning, generative AI is a general-purpose technology
used for multiple purposes across many industries and customer segments.
There are many types of multimodal generative AI tasks. We’ve included a
list of the most common generative tasks and associated example use cases:
Text summarization
Produce a shorter version of a piece of text while retaining the main
ideas. Examples include summarizing a news article, legal document, or
financial report into a smaller number of words or paragraphs for faster
consumption. Often, summarization is used on customer support
conversations to provide a quick overview of the interaction between a
customer and support representative.
Rewriting
Modify the wording of a piece of text to adapt to a different audience,
formality, or tone. For example, you can convert a formal legal
document into a less formal document using less legal terms to appeal
to a nonlegal audience.
Information extraction
Extract information from documents such as names, addresses, events,
or numeric data or numbers. For example, converting an email into a
purchase order in an enterprise resource planning (ERP) system like
SAP.
Question answering (QA) and visual question answering (VQA)
Ask questions directly against a set of documents, images, videos, or
audio clips. For example, you can set up an internal, employee-facing
chatbot to answer questions about human resources and benefits
documents.
Detecting toxic or harmful content
An extension to the question-answer task, you can ask a generative
model if a set of text, images, videos, or audio clips contains any
toxicity or harmful content.
Classification and content moderation
Assign a category to a given piece of content such as a document,
image, video, or audio clip. For example, deleting email spam, filtering
out inappropriate images, or labeling incoming, text-based customersupport tickets.
Conversational interface
Handle multiturn conversations to accomplish tasks through a chat-like
interface. Examples include chatbots for self-service customer support
or mental health therapy sessions.
Translation
One of the earliest use cases for generative AI is language translation.
Consider, for example, that the publisher of this book wants to release a
German translation to help expand the book’s reach. Or perhaps you
may want to convert the Python-based examples to Java to work within
your existing Java-based enterprise application.
Source code generation
Create source code from natural language code comments—or even a
hand-drawn sketch, as shown in Figure 1-1. Here, an HTML- and
JavaScript-based website is generated from a UI sketch scribbled on the
back of a restaurant napkin.
Figure 1-1. Generating UI code from hand-drawn sketch
Reasoning
Reason through a problem to discover potential new solutions, tradeoffs, or latent details. For example, consider a CFO who provides an
audio-based quarterly financial report to investors as well as a moredetailed written report. By reasoning through these different media
formats together, the model may discover some conclusions about the
company’s health not directly mentioned in the audio or stated in the
text."""

MOCK_GENERATED_QUESTIONS="""[
                                {
                                    "time_limit": 1, 
                                    "question_text": "What is Generative AI?",
                                    "difficulty": "medium",
                                    "question_type": "single_select_mcq",
                                    "points": 1,
                                    "mcq_options": [
                                        {"option_text": "A type of machine learning that generates new content", "is_correct": True},
                                        {"option_text": "A type of machine learning that classifies data", "is_correct": False},
                                        {"option_text": "A type of machine learning that optimizes algorithms", "is_correct": False},
                                        {"option_text": "A type of machine learning that detects anomalies", "is_correct": False}
                                    ]
                                },
                                {
                                    "time_limit": 1, 
                                    "question_text": "What is Generative AI?",
                                    "difficulty": "medium",
                                    "question_type": "open_text_question",
                                    "points": 1,
                                    "correct_answer": "Generative AI is a type of artificial intelligence that is capable of creating new content or data that is similar to the data it was trained on."
                                },
                                {
                                    "time_limit": 2, 
                                    "question_text": "Select All Incorrect About Generative AI?",
                                    "difficulty": "medium",
                                    "question_type": "multi_select_mcq",
                                    "points": 1,
                                    "mcq_options": [
                                        {"option_text": "A type of machine learning that generates new content", "is_correct": False},
                                        {"option_text": "A type of machine learning that classifies data", "is_correct": True},
                                        {"option_text": "A type of machine learning that optimizes algorithms","is_correct": True},
                                        {"option_text": "A type of machine learning that detects anomalies", "is_correct": True}
                                    ]
                                }
                            ]"""

RETRIEVAL_ASSISTANT_SEED_PROMPT =  """ 

You are a specialized AI Assistant who efficiently manages and extracts full information from documents as it is and return to users. 

You will get User_prompt.  Prompt will have instructions about Generating Quiz.

1. Identify what content is relevant to the user prompt.

2. Extract full content from the FILES you have access to and return it.

3. Return all content from pdfs as it is and return the content to the user.

Remember, your goal is to find all relevant content and return it to the user. Don't say I don't know, don;t summarize or try to generate questions. Only identify, retrieve and return complete content.
"""

rag_assistant_name="Quiz Knowledge Retrieval Assistant"