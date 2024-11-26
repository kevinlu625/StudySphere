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

interface Question {
  id: number
  text: string
  voteCount: number
}

export function AnswerList({
  className,
  questionId,
}: {
  className: string
  questionId: string
}) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch the question details
  const fetchQuestion = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/function/get-question/?question_id=${encodeURIComponent(
          questionId
        )}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch question")
      }
      const data = await response.json()

      setQuestion({
        id: data.id,
        text: data.question,
        voteCount: data.vote_count,
      })
    } catch (error) {
      console.error("Error fetching question:", error)
    }
  }

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

      // Sort answers by score in descending order
      setAnswers(
        answersWithScores.sort((a, b) => b.score - a.score)
      )
    } catch (error) {
      console.error("Error fetching answers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion()
    fetchAnswers()
  }, [questionId])

  // Add a new answer and update the answers list immediately
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

        const data = await response.json() 

        // Add the new answer to the answers state and sort the list
        setAnswers((prevAnswers) =>
          [{ id: data.id, text: newAnswer.trim(), score: 0 }, ...prevAnswers].sort(
            (a, b) => b.score - a.score
          )
        )

        setNewAnswer("") 
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

      const { new_vote_count } = await response.json() 

      // Update the specific answer's score and sort the list
      setAnswers((prevAnswers) =>
        prevAnswers
          .map((a) =>
            a.id === answerId ? { ...a, score: new_vote_count } : a
          )
          .sort((a, b) => b.score - a.score)
      )
    } catch (error) {
      console.error("Error voting on answer:", error)
    }
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {question
              ? `${question.text} (Votes: ${question.voteCount})`
              : `Question #${questionId}`}
          </CardTitle>
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
