import Link from "next/link"
import { AnswerList } from "@/components/answer-list"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function QuestionPage({ params }: { params: { className: string; questionId: string } }) {
  const decodedClassName = decodeURIComponent(params.className)
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link href={`/class/${params.className}`} passHref>
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questions
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            Question for {decodedClassName}
          </h1>
        </div>
        <AnswerList className={decodedClassName} questionId={params.questionId} />
      </div>
    </div>
  )
}



