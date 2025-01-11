import api from './api';

export interface TimerLog {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  duracionHoras: number;
}

export const logService = {
  getAll: () => 
    api.get<TimerLog[]>('/timers'),
  
  getByEmpleado: (empleadoId: number) => 
    api.get<TimerLog[]>(`/timers/empleado/${empleadoId}`)
}; 