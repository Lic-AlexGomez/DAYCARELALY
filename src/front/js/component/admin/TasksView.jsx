import React, { useState } from 'react';
import { Plus, Edit, Trash, Check } from 'lucide-react';

const TasksView = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Preparar materiales para la clase de arte', completed: false, dueDate: '2023-06-01' },
    { id: 2, title: 'Revisar inscripciones para el próximo mes', completed: true, dueDate: '2023-05-28' },
    { id: 3, title: 'Organizar reunión con padres', completed: false, dueDate: '2023-06-05' },
  ]);

  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { id: tasks.length + 1, ...newTask, completed: false }]);
    setNewTask({ title: '', dueDate: '' });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Tareas</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddTask} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Nueva tarea"
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
        {tasks.map((task) => (
          <div key={task.id} className={`tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-flex tw-items-center tw-justify-between ${task.completed ? 'tw-opacity-50' : ''}`}>
            <div className="tw-flex tw-items-center">
              <button
                onClick={() => handleToggleComplete(task.id)}
                className={`tw-mr-4 tw-p-1 tw-rounded-full ${task.completed ? 'tw-bg-green-500' : 'tw-border tw-border-gray-300'}`}
              >
                {task.completed && <Check className="tw-w-4 tw-h-4 tw-text-white" />}
              </button>
              <div>
                <h3 className={`tw-text-lg tw-font-medium ${task.completed ? 'tw-line-through' : ''}`}>{task.title}</h3>
                <p className="tw-text-sm tw-text-gray-500">Fecha límite: {task.dueDate}</p>
              </div>
            </div>
            <button onClick={() => handleDeleteTask(task.id)} className="tw-text-red-500">
              <Trash className="tw-w-5 tw-h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksView;

