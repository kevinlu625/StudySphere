import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Register } from "../app/register"

export function NavBar() {
  return (
    <nav className="bg-neutral-900 text-neutral-50 p-4 mb-4 shadow-md dark:bg-neutral-50 dark:text-neutral-900">
      <div className="container mx-auto flex items-center">
        <Link href="/home" className="text-2xl font-bold hover:text-neutral-50/80 flex items-center dark:hover:text-neutral-900/80">
          <GraduationCap className="mr-2 h-6 w-6" />
          StudySphere
        </Link>
        
      </div>
    </nav>
  )
}



