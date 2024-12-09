import datetime
from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import bcrypt
import re

function_router = APIRouter(
    prefix="/function",
    tags=["function"],
)

# Supabase client setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

#post routes
@function_router.post("/create-class/")
async def create_class(class_name):
    try:
        class_name = class_name
        class_exists = supabase.table("classes").select("id").eq("class_name", class_name).execute()
        if not class_exists.data:
            supabase.table("classes").insert({"class_name": class_name}).execute()
            return {"message": "Class successfully added."}
        else:
            return {"message": "Class already exists."}
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}

@function_router.post("/post-question/")
async def post_question(class_name: str, question: str):
    try:
        if not class_name or not question:
            raise HTTPException(status_code=400, detail="Class name and question are required.")

        class_exists = supabase.table("classes").select("id").eq("class_name", class_name).execute()
        
        if not class_exists.data:
            raise HTTPException(status_code=404, detail="Class not found.")

        supabase.table("questions").insert({
            "class": class_name,
            "question": question,
        }).execute()

        return {"message": "Question successfully added to the class."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@function_router.post("/add-answer/")
async def add_answer(class_name: str, answer: str, question_id: int):
    try:
        if not class_name or not answer:
            raise HTTPException(status_code=400, detail="Class name and question are required.")

        class_exists = supabase.table("classes").select("id").eq("class_name", class_name).execute()
        
        if not class_exists.data:
            raise HTTPException(status_code=404, detail="Class not found.")

        supabase.table("answers").insert({
            "class": class_name,
            "answer": answer,
            "question_id": question_id,
        }).execute()

        return {"message": "Question successfully added to the class."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@function_router.post("/vote-answer/")
async def vote_answer(answer_id: int, upvote: int):
    try:
        if answer_id is None or upvote is None:
            raise HTTPException(status_code=400, detail="Answer ID and vote type (upvote) are required.")

        response = supabase.table("answers").select("vote_count").eq("id", answer_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Answer not found.")

        current_vote_count = response.data[0]['vote_count']

        new_vote_count = current_vote_count + 1 if upvote == 1 else current_vote_count - 1

        supabase.table("answers").update({"vote_count": new_vote_count}).eq("id", answer_id).execute()

        return {"message": "Vote successfully recorded.", "new_vote_count": new_vote_count}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@function_router.post("/vote-question/")
async def vote_question(question_id: int, upvote: int):
    try:
        response = supabase.table("questions").select("vote_count").eq("id", question_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Question not found.")

        current_vote_count = response.data[0]['vote_count']

        if upvote == 1:
            new_vote_count = current_vote_count + 1
        elif upvote == 0:
            new_vote_count = current_vote_count - 1

        supabase.table("questions").update({"vote_count": new_vote_count}).eq("id", question_id).execute()

        return {"message": "Vote successfully recorded.", "new_vote_count": new_vote_count}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@function_router.post("/rate-question-difficulty/")
async def rate_question_difficulty(question_id: int, difficulty_rating: int):
    try:
        response = supabase.table("questions").select("difficulty").eq("id", question_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Question not found.")

        current_difficulty = response.data[0]['difficulty']

        new_difficulty = current_difficulty + difficulty_rating

        supabase.table("questions").update({"difficulty": new_difficulty}).eq("id", question_id).execute()

        return {"message": "Vote successfully recorded.", "new_difficulty": new_difficulty}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

#get routes
@function_router.get("/get-classes/")
async def get_classes():
    classes = supabase.table("classes").select("*").execute()
    return classes.data

@function_router.get("/get-questions/")
async def get_questions(class_name: str):
    # Validate input
    if not class_name:
        raise HTTPException(status_code=400, detail="Class name is required.")

    # Check if the class exists
    class_exists = supabase.table("classes").select("id").eq("class_name", class_name).execute()
    
    if not class_exists.data:
        raise HTTPException(status_code=404, detail="Class not found.")

    # Fetch questions for the given class
    questions = supabase.table("questions").select("*").eq("class", class_name).execute()

    return questions.data

@function_router.get("/get-answers/")
async def get_answers(question_id: int):
    # Validate input
    if question_id is None:
        raise HTTPException(status_code=400, detail="Question ID is required.")

    # Fetch answers for the given question
    answers = supabase.table("answers").select("*").eq("question_id", question_id).execute()

    return answers.data

@function_router.get("/get-answer-score/")
async def get_answer_score(answer_id: int):
    if answer_id is None:
        raise HTTPException(status_code=400, detail="Answer ID is required.")

    answer = supabase.table("answers").select("vote_count").eq("id", answer_id).execute()

    if not answer.data:
        raise HTTPException(status_code=404, detail="Answer not found.")

    return answer.data[0]

@function_router.get("/get-question-score/")
async def get_question_score(question_id: int):
    question = supabase.table("questions").select("vote_count").eq("id", question_id).execute()

    if not question.data:
        raise HTTPException(status_code=404, detail="Question not found.")

    return question.data[0]

@function_router.get("/get-question-difficulty/")
async def get_question_difficulty(question_id: int):
    question = supabase.table("questions").select("difficulty").eq("id", question_id).execute()

    if not question.data:
        raise HTTPException(status_code=404, detail="Question not found.")

    return question.data[0]

@function_router.get("/get-question/")
async def get_question(question_id: int):
    question = supabase.table("questions").select("*").eq("id", question_id).execute()

    if not question.data:
        raise HTTPException(status_code=404, detail="Question not found.")

    return question.data[0]

@function_router.get("/get-questions-by-difficulty/")
async def get_questions_by_difficulty(class_name: str):
    try:
        # Validate input
        if not class_name:
            raise HTTPException(status_code=400, detail="Class name is required.")

        # Check if the class exists
        class_exists = supabase.table("classes").select("id").eq("class_name", class_name).execute()
        
        if not class_exists.data:
            raise HTTPException(status_code=404, detail="Class not found.")

        # Fetch questions for the given class, ordered by difficulty
        questions = supabase.table("questions")\
            .select("*")\
            .eq("class", class_name)\
            .order("difficulty", desc=True)\
            .execute()

        return questions.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# register route
@function_router.post("/register/")
async def register_user(username: str, password: str, email: str):
    try:
        if not username or not password or not email:
            raise HTTPException(status_code=400, detail="Username, password, and email are required.")

        # Validate email contains "upenn"
        if "upenn" not in email.lower():
            raise HTTPException(status_code=400, detail="Must use penn email.")

        email_regex = r"[^@]+@[^@]+\.[^@]+"
        if not re.match(email_regex, email):
            raise HTTPException(status_code=400, detail="Invalid email format.")

        # Check if the username already exists
        user_exists = supabase.table("users").select("id").eq("username", username).execute()
        if user_exists.data:
            raise HTTPException(status_code=400, detail="Username already exists.")

        # Check if the email already exists (to avoid duplicates)
        email_exists = supabase.table("users").select("id").eq("email", email).execute()
        if email_exists.data:
            raise HTTPException(status_code=400, detail="Email already registered.")

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert the new user into the database
        new_user = supabase.table("users").insert({
            "username": username,
            "password": hashed_password.decode('utf-8'),
            "email": email
        }).execute()

        return {"message": "User registered successfully.", "user_id": new_user.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# @function_router.post("/register/")
# async def register_user(username: str, password: str):
#     try:
#         if not username or not password:
#             raise HTTPException(status_code=400, detail="Username and password are required.")

#         # Check if the username already exists
#         user_exists = supabase.table("users").select("id").eq("username", username).execute()
#         if user_exists.data:
#             raise HTTPException(status_code=400, detail="Username already exists.")

#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

#         new_user = supabase.table("users").insert({
#             "username": username,
#             "password": hashed_password.decode('utf-8') 
#         }).execute()

#         return {"message": "User registered successfully.", "user_id": new_user.data[0]["id"]}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
# login route
@function_router.post("/login/")
async def login_user(username: str, password: str):
    try:
        if not username or not password:
            raise HTTPException(status_code=400, detail="Username and password are required.")

        user = supabase.table("users").select("*").eq("username", username).execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="User not found.")

        stored_password = user.data[0]["password"]
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid password.")
        return {"message": "Login successful.", "user_id": user.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
