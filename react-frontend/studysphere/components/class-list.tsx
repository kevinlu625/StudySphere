"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ClassList() {
  const [classes, setClasses] = useState<{ class_name: string }[]>([])
  const [newClass, setNewClass] = useState("")

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/function/get-classes')
      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const addClass = async () => {
    if (newClass.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/function/create-class/?class_name=${encodeURIComponent(newClass.trim())}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to add class');
        }
  
        console.log('Class added successfully');
        setNewClass("");
        fetchClasses();
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add a New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Enter new class name"
              className="mr-2"
            />
            <Button onClick={addClass}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Class
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                <Link href={`/class/${encodeURIComponent(classItem.class_name)}`} className="hover:underline">
                  {classItem.class_name}
                </Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}