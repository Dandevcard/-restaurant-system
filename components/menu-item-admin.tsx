import { MenuItem } from '@/types'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface MenuItemAdminProps {
    item: MenuItem
}
export default function MenuItemAdmin({item}: MenuItemAdminProps) {

  return (
    <Card>
    <CardContent className="p-4">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-medium">{item.name}</h3>
            <span className="font-bold">R$ {item.price.toFixed(2)}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" className="h-8">
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-destructive">
              <Trash2 className="h-3 w-3 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}
