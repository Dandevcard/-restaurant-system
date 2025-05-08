import { MenuCategory } from '@/types'
import React from 'react'
import { Button } from './ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface MenuCategoryCardProps {
    category: MenuCategory
    isActive: boolean
    onClick: () => void
}
export default function MenuCategoryCard({category, isActive, onClick}: MenuCategoryCardProps) {
  return (
    <div
    className={`
      flex items-center justify-between p-2 rounded-md cursor-pointer
      ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}
    `}
    onClick={onClick}
  >
    <span>{category.name}</span>
    <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
