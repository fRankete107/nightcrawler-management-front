import api from './api';
import { EmployeeFormData } from '../components/EmployeeModal';

export interface Empleado {
  id: number;
  nombre: string;
  username: string;
  nacionalidad: string;
  telefono: string;
  residencia: string;
  fechaIngreso: string;
  cargoActual: string;
  rol: string;
  activo: boolean;
  imagen?: string;
  foroId?: number;
}

export const empleadoService = {
  getAll: () => 
    api.get<Empleado[]>('/empleados'),
  
  create: (empleado: EmployeeFormData) => 
    api.post<Empleado>('/empleados', {
      ...empleado,
      fechaIngreso: new Date().toISOString(),
      activo: true
    }),
  
  update: (id: number, empleado: Partial<Empleado>) => 
    api.put<Empleado>(`/empleados/${id}`, empleado),
  
  delete: (id: number) => 
    api.delete(`/empleados/${id}`)
}; 