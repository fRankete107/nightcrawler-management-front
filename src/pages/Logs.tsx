import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { logService, TimerLog } from '../services/logs';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<TimerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logService.getAll()
      .then(response => {
        setLogs(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Registro de Horas</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.empleadoNombre}
                </td>
                <td className="px-6 py-4">
                  {log.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(log.fechaInicio), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.fechaFin ? format(new Date(log.fechaFin), 'dd/MM/yyyy HH:mm') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.duracionHoras.toFixed(1)}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;