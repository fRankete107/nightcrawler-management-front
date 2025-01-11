import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Send } from 'lucide-react';
import { format } from 'date-fns';
import { timerService } from '../services/api';

const Timer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTimerId, setCurrentTimerId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Cargar timer activo al montar
    timerService.getActiveTimer()
      .then(response => {
        if (response.data) {
          const { id, descripcion, fechaInicio } = response.data;
          setCurrentTimerId(id);
          setDescription(descripcion);
          setStartTime(new Date(fechaInicio));
          setIsRunning(true);
          
          // Calcular tiempo transcurrido
          const elapsed = Math.floor((Date.now() - new Date(fechaInicio).getTime()) / 1000);
          setTime(elapsed);
        }
      })
      .catch(error => console.error('Error al cargar timer activo:', error));
  }, []);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      // Sincronizar con el tiempo real
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setTime(elapsed);

      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = async () => {
    try {
      const response = await timerService.createTimer({
        empleadoId: 1, // TODO: Obtener el ID del empleado actual
        descripcion: description
      });
      setCurrentTimerId(response.data.id);
      setStartTime(new Date());
      setIsRunning(true);
    } catch (error) {
      console.error('Error al iniciar el timer:', error);
      // TODO: Mostrar mensaje de error al usuario
    }
  };

  const handleStop = async () => {
    if (currentTimerId) {
      try {
        await timerService.updateTimer(currentTimerId, {
          fechaFin: new Date().toISOString()
        });
        setIsRunning(false);
        setTime(0);
        setStartTime(null);
        setCurrentTimerId(null);
        setDescription('');
      } catch (error) {
        console.error('Error al detener el timer:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Control de Tiempo</h2>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la tarea
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            placeholder="Describe la tarea que vas a realizar..."
            disabled={isRunning}
          />
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="text-6xl font-mono">{formatTime(time)}</div>
        </div>

        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!description}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Iniciar
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
            >
              <Send className="w-5 h-5" />
              Finalizar y Enviar
            </button>
          )}
        </div>

        {startTime && (
          <div className="mt-8 text-center text-gray-600">
            <Clock className="w-4 h-4 inline-block mr-2" />
            Inicio: {format(startTime, 'HH:mm:ss')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;