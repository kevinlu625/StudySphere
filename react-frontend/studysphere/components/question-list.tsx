'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Question {
  id: number
  text: string
  score: number
}

export function QuestionList({ className }: { className: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Function to fetch questions and their scores
  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://127.0.0.1:8000/function/get-questions?class_name=${encodeURIComponent(
          className
        )}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }
      const data = await response.json()

      const questionsWithScores = await Promise.all(
        data.map(async (q: { id: number; question: string }) => {
          const scoreResponse = await fetch(
            `http://127.0.0.1:8000/function/get-question-score?question_id=${q.id}`
          )
          const scoreData = await scoreResponse.json()
          return {
            id: q.id,
            text: q.question,
            score: scoreData.vote_count,
          }
        })
      )

      setQuestions(questionsWithScores)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch when component mounts
  useEffect(() => {
    fetchQuestions()
  }, [className])

  // Add a new question and refetch the list
  const addQuestion = async () => {
    if (newQuestion.trim()) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/function/post-question/?class_name=${encodeURIComponent(
            className
          )}&question=${encodeURIComponent(newQuestion.trim())}`,
          {
            method: "POST",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to add question")
        }
        setNewQuestion("")
        // Refetch the updated questions list
        fetchQuestions()
      } catch (error) {
        console.error("Error adding question:", error)
      }
    }
  }

  // Vote on a question and update its score
  const vote = async (questionId: number, upvote: boolean) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/function/vote-question?question_id=${questionId}&upvote=${upvote}`,
        {
          method: "POST",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to vote on question")
      }

      // Update score after voting
      const scoreResponse = await fetch(
        `http://127.0.0.1:8000/function/get-question-score?question_id=${questionId}`
      )
      const scoreData = await scoreResponse.json()

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, score: scoreData.vote_count} : q
        )
      )
    } catch (error) {
      console.error("Error voting on question:", error)
    }
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask a New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter new question"
              className="mr-2"
            />
            <Button onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
        </CardContent>
      </Card>
      {isLoading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/class/${encodeURIComponent(
                      className
                    )}/question/${question.id}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {question.text}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vote(question.id, true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold">{question.score}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vote(question.id, false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
