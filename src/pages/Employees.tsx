import React, { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { empleadoService, Empleado } from '../services/empleados';
import { format } from 'date-fns';
import EmployeeModal from '../components/EmployeeModal';
import { EmployeeFormData } from '../components/EmployeeModal';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Empleado | undefined>(undefined);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await empleadoService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await empleadoService.delete(id);
        await loadEmployees();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  const handleSubmit = async (employeeData: EmployeeFormData) => {
    try {
      if (selectedEmployee) {
        await empleadoService.update(selectedEmployee.id, employeeData);
      } else {
        await empleadoService.create(employeeData);
      }
      await loadEmployees();
      setShowAddModal(false);
      setSelectedEmployee(undefined);
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const handleEdit = (employee: Empleado) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Empleados</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Empleado
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Ingreso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {employee.cargoActual}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(employee.fechaIngreso), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEdit(employee)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeeModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedEmployee(undefined);
        }}
        onSubmit={handleSubmit}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default Employees;