export type Response = Data[];

export interface Data {
  employee: Employee;
  manager: Manager;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: Department;
  projects: Project[];
}

export interface Department {
  id: string;
  name: string;
  manager: Manager;
}

export interface Manager {
  id: string;
  name: string;
  contact: Contact;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  startDate: string;
  tasks: Task[];
}

export interface Task {
  taskId: string;
  title: string;
  status: string;
  details: Details;
}

export interface Details {
  hoursSpent: number;
  technologiesUsed: string[];
  completionDate?: string;
  expectedCompletion?: string;
}
