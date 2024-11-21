import datetime
from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os

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

        insert_response = supabase.table("questions").insert({
            "class": class_name,
            "question": question,
        }).execute()

        if insert_response.status_code != 200 or not insert_response.data:
            raise HTTPException(status_code=500, detail="Failed to insert question.")

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

        insert_response = supabase.table("answers").insert({
            "class": class_name,
            "answer": answer,
            "question_id": question_id,
        }).execute()

        if insert_response.error:
            raise HTTPException(status_code=500, detail="Failed to insert question.")

        return {"message": "Question successfully added to the class."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@function_router.post("/vote-answer/")
async def vote_answer(answer_id, upvote):
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
async def vote_question(question_id, upvote):
    try:
        if question_id is None or upvote is None:
            raise HTTPException(status_code=400, detail="Question ID and vote type (upvote) are required.")

        response = supabase.table("questions").select("vote_count").eq("id", question_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Question not found.")

        current_vote_count = response.data[0]['vote_count']

        new_vote_count = current_vote_count + 1 if upvote == 1 else current_vote_count - 1

        supabase.table("questions").update({"vote_count": new_vote_count}).eq("id", question_id).execute()

        return {"message": "Vote successfully recorded.", "new_vote_count": new_vote_count}

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
    if question_id is None:
        raise HTTPException(status_code=400, detail="Question ID is required.")

    question = supabase.table("questions").select("vote_count").eq("id", question_id).execute()

    if not question.data:
        raise HTTPException(status_code=404, detail="Question not found.")

    return question.data[0]