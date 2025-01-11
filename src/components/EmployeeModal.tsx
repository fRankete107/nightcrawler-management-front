import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Empleado } from '../services/empleados';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: EmployeeFormData) => Promise<void>;
  employee?: Empleado;
}

export interface EmployeeFormData {
  nombre: string;
  username: string;
  password?: string;
  nacionalidad: string;
  telefono: string;
  residencia: string;
  cargoActual: string;
  rol: 'MECANICO' | 'SUPERVISOR' | 'GERENTE';
  imagen?: string;
  foroId?: number;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSubmit, employee }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    nombre: '',
    username: '',
    password: '',
    nacionalidad: '',
    telefono: '',
    residencia: '',
    cargoActual: '',
    rol: 'MECANICO'
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        nombre: employee.nombre,
        username: employee.username,
        nacionalidad: employee.nacionalidad,
        telefono: employee.telefono,
        residencia: employee.residencia,
        cargoActual: employee.cargoActual,
        rol: employee.rol as 'MECANICO' | 'SUPERVISOR' | 'GERENTE',
        imagen: employee.imagen,
        foroId: employee.foroId
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {!employee && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required={!employee}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Residencia</label>
            <input
              type="text"
              value={formData.residencia}
              onChange={(e) => setFormData({ ...formData, residencia: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo</label>
            <input
              type="text"
              value={formData.cargoActual}
              onChange={(e) => setFormData({ ...formData, cargoActual: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'MECANICO' | 'SUPERVISOR' | 'GERENTE' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="MECANICO">Mecánico</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="GERENTE">Gerente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
            <input
              type="text"
              value={formData.imagen || ''}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Foro</label>
            <input
              type="number"
              value={formData.foroId || ''}
              onChange={(e) => setFormData({ ...formData, foroId: Number(e.target.value) || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {employee ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal; 