export interface TaskThing {
  id: string
  taskId: string
  thingId: string
  createdAt: Date
}

export interface TaskThingDTO {
  id: string
  taskId: string
  thingId: string
  createdAt: string
}

export interface CreateTaskThingDTO {
  taskId: string
  thingId: string
} 