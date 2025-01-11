export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'mechanic';
  active: boolean;
  joinDate: string;
}

export interface TimeLog {
  id: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
}

export interface Incident {
  id: string;
  employeeId: string;
  type: 'absence' | 'incident';
  date: string;
  description: string;
  imageUrl?: string;
}