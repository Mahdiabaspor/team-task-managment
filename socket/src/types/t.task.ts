// Task interface
export interface ITask {
  id: string;
  title: string;
  description?: string;
  containerId: string;
  projectId: string;
  order: number;
  status?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Container interface
export interface IContainer {
  id: string;
  name: string;
  projectId: string;
  order: number;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

// Project interface
export interface IProject {
  id: string;
  name: string;
  description?: string;
  containers: IContainer[];
  createdAt: Date;
  updatedAt: Date;
}

// Socket event types
export interface ContainerOrderUpdate {
  id: string;
  order: number;
}

export interface ContainerAction {
  id: string;
  name?: string;
  projectId: string;
  order?: number;
}

export interface TaskUpdate {
  id: string;
  title?: string;
  description?: string;
  containerId?: string;
  order?: number;
  status?: string;
  priority?: string;
  dueDate?: Date;
}
