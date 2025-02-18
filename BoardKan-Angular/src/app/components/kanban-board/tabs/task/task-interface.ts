export interface Tasks {
    id: number,
    title: string,
    description: string,
    assigneeIds: number,
    assigneeUsernames: number[],
    priority: string,
    status: string,
    dueDate: string
  }