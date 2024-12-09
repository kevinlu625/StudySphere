'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  vote_count: number
  difficulty: number
}

export function QuestionList({ className }: { className: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortedByDifficulty, setSortedByDifficulty] = useState(false)
  const router = useRouter()

  const fetchQuestions = async (byDifficulty: boolean = false) => {
    try {
      setIsLoading(true)
      const endpoint = byDifficulty ? 'get-questions-by-difficulty' : 'get-questions'
      
      const response = await fetch(
        `http://127.0.0.1:8000/function/${endpoint}/?class_name=${encodeURIComponent(
          className
        )}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }
      const questionsData = await response.json()

      // Fetch difficulty ratings only if not already sorted by difficulty
      if (!byDifficulty) {
        const questionsWithDifficulty = await Promise.all(
          questionsData.map(async (q: Question) => {
            try {
              const difficultyResponse = await fetch(
                `http://127.0.0.1:8000/function/get-question-difficulty/?question_id=${q.id}`
              )
              if (difficultyResponse.ok) {
                const difficultyData = await difficultyResponse.json()
                return {
                  ...q,
                  difficulty: difficultyData.difficulty || 0
                }
              }
              return { ...q, difficulty: 0 }
            } catch (error) {
              console.error(`Error fetching difficulty for question ${q.id}:`, error)
              return { ...q, difficulty: 0 }
            }
          })
        )
        setQuestions(questionsWithDifficulty)
      } else {
        setQuestions(questionsData)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
      setIsLoading(false)
    }
  }

  const toggleSort = async () => {
    setSortedByDifficulty(!sortedByDifficulty)
    await fetchQuestions(!sortedByDifficulty)
  }

  useEffect(() => {
    fetchQuestions(sortedByDifficulty)
  }, [className])

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

        const data = await response.json()

        setQuestions((prevQuestions) => [
          {
            id: data.id,
            question: newQuestion.trim(),
            vote_count: 0,
            difficulty: 0
          },
          ...prevQuestions,
        ])

        setNewQuestion("")
      } catch (error) {
        console.error("Error adding question:", error)
      }
    }
  }

  const vote = async (questionId: number, upvote: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/function/vote-question/?question_id=${questionId}&upvote=${upvote}`,
        {
          method: "POST",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to vote on question")
      }

      const { new_vote_count } = await response.json()

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, vote_count: new_vote_count } : q
        )
      )
    } catch (error) {
      console.error("Error voting on question:", error)
    }
  }

  const handleQuestionClick = (questionId: number) => {
    router.push(`/class/${encodeURIComponent(className)}/question/${questionId}`)
  }

  return (
    <div className="space-y-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Questions for {className}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter new question"
              className="flex-grow"
            />
            <Button onClick={addQuestion} disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={toggleSort}
        variant="outline"
        disabled={isLoading}
      >
        {sortedByDifficulty ? 'Show Default Order' : 'Sort by Difficulty'}
      </Button>

      {isLoading ? (
        <p>Loading questions...</p>
      ) : (
        questions.map((question) => (
          <Card key={question.id} className="hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
            <CardHeader className="cursor-pointer" onClick={() => handleQuestionClick(question.id)}>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {question.difficulty > 0 
                      ? `Difficulty: ${question.difficulty}`
                      : 'No rating'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      vote(question.id, 1)
                    }}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-bold">{question.vote_count}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      vote(question.id, 0)
                    }}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  )
}