import React, { useState } from 'react';
import { PenToolIcon as Tool, Plus, Check, X } from 'lucide-react';

const MaintenanceView = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState([
    { id: 1, task: 'Revisar sistema de aire acondicionado', dueDate: '2023-06-15', status: 'pending' },
    { id: 2, task: 'Pintar paredes del aula principal', dueDate: '2023-07-01', status: 'in-progress' },
    { id: 3, task: 'Reparar juegos del patio', dueDate: '2023-06-20', status: 'completed' },
  ]);

  const [newTask, setNewTask] = useState({ task: '', dueDate: '' });

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setMaintenanceTasks([...maintenanceTasks, { id: maintenanceTasks.length + 1, ...newTask, status: 'pending' }]);
    setNewTask({ task: '', dueDate: '' });
  };

  const handleUpdateStatus = (id, newStatus) => {
    setMaintenanceTasks(maintenanceTasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'tw-bg-yellow-100 tw-text-yellow-800';
      case 'in-progress':
        return 'tw-bg-blue-100 tw-text-blue-800';
      case 'completed':
        return 'tw-bg-green-100 tw-text-green-800';
      default:
        return 'tw-bg-gray-100 tw-text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Mantenimiento</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddTask} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="task"
            value={newTask.task}
            onChange={handleInputChange}
            placeholder="Nueva tarea de mantenimiento"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Tarea
          </button>
        </form>
      </div>
      <div className="tw-space-y-4">
        {maintenanceTasks.map((task) => (
          <div key={task.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-start">
              <div>
                <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{task.task}</h3>
                <p className="tw-text-gray-600 tw-mb-2">Fecha límite: {task.dueDate}</p>
                <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${getStatusColor(task.status)}`}>
                  {task.status === 'pending' && 'Pendiente'}
                  {task.status === 'in-progress' && 'En progreso'}
                  {task.status === 'completed' && 'Completado'}
                </span>
              </div>
              <div className="tw-flex tw-space-x-2">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(task.id, 'completed')}
                    className="tw-bg-green-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md"
                  >
                    <Check className="tw-w-5 tw-h-5" />
                  </button>
                )}
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                    className="tw-bg-blue-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md"
                  >
                    <Tool className="tw-w-5 tw-h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceView;

