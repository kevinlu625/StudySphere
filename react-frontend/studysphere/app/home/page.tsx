import { ClassList } from "@/components/class-list";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <NavBar />
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome to StudySphere</h1>
          <p className="text-center mb-8 text-neutral-500 dark:text-neutral-400">
            Create and join classes, ask questions, and learn together.
          </p>
          <ClassList />
        </div>
      </div>
    )
}