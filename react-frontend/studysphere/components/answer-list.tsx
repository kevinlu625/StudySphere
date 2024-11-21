'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Answer {
  id: number
  text: string
  score: number
}

export function AnswerList({
  className,
  questionId,
}: {
  className: string
  questionId: string
}) {
  const [question, setQuestion] = useState("") // Optionally, fetch the question text
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch answers and their scores from the backend
  const fetchAnswers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://127.0.0.1:8000/function/get-answers?question_id=${encodeURIComponent(
          questionId
        )}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch answers")
      }
      const data = await response.json()

      const answersWithScores = await Promise.all(
        data.map(async (a: { id: number; answer: string }) => {
          const scoreResponse = await fetch(
            `http://127.0.0.1:8000/function/get-answer-score?answer_id=${a.id}`
          )
          const scoreData = await scoreResponse.json()
          return {
            id: a.id,
            text: a.answer,
            score: scoreData.vote_count || 0,
          }
        })
      )

      setAnswers(answersWithScores)
    } catch (error) {
      console.error("Error fetching answers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch when component mounts
  useEffect(() => {
    fetchAnswers()
  }, [questionId])

  // Add a new answer and refetch the list
  const addAnswer = async () => {
    if (newAnswer.trim()) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/function/add-answer?class_name=${encodeURIComponent(
            className
          )}&answer=${encodeURIComponent(newAnswer.trim())}&question_id=${encodeURIComponent(
            questionId
          )}`,
          {
            method: "POST",
          }
        )
        if (!response.ok) {
          throw new Error("Failed to add answer")
        }
        setNewAnswer("")
        // Refetch the updated answers list
        await fetchAnswers()
      } catch (error) {
        console.error("Error adding answer:", error)
      }
    }
  }

  // Upvote or downvote an answer
  const vote = async (answerId: number, upvote: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/function/vote-answer?answer_id=${encodeURIComponent(
          answerId
        )}&upvote=${upvote}`,
        {
          method: "POST",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to vote on answer")
      }

      // Update the specific answer's score after voting
      const scoreResponse = await fetch(
        `http://127.0.0.1:8000/function/get-answer-score?answer_id=${answerId}`
      )
      const scoreData = await scoreResponse.json()

      setAnswers((prevAnswers) =>
        prevAnswers.map((a) =>
          a.id === answerId ? { ...a, score: scoreData.vote_count || 0 } : a
        )
      )
    } catch (error) {
      console.error("Error voting on answer:", error)
    }
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{question || `Question #${questionId}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter new answer"
              className="mr-2"
            />
            <Button onClick={addAnswer} disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
            </Button>
          </div>
        </CardContent>
      </Card>
      {isLoading ? (
        <p>Loading answers...</p>
      ) : (
        <div className="space-y-4">
          {answers.map((answer) => (
            <Card key={answer.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg">{answer.text}</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vote(answer.id, 1)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold">{answer.score}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vote(answer.id, 0)}
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