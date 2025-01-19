import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const ActivitiesView = () => {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Pintura con Dedos', description: 'Actividad creativa para desarrollar habilidades motoras finas', ageGroup: '2-3 años', duration: 30 },
    { id: 2, name: 'Cuentacuentos Interactivo', description: 'Lectura de cuentos con participación de los niños', ageGroup: '4-5 años', duration: 45 },
    { id: 3, name: 'Juegos de Construcción', description: 'Construcción con bloques para desarrollar habilidades espaciales', ageGroup: '3-4 años', duration: 60 },
  ]);

  const [newActivity, setNewActivity] = useState({ name: '', description: '', ageGroup: '', duration: '' });

  const handleInputChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    setActivities([...activities, { id: activities.length + 1, ...newActivity, duration: parseInt(newActivity.duration) }]);
    setNewActivity({ name: '', description: '', ageGroup: '', duration: '' });
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Actividades</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddActivity} className="tw-space-y-4">
          <input
            type="text"
            name="name"
            value={newActivity.name}
            onChange={handleInputChange}
            placeholder="Nombre de la actividad"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <textarea
            name="description"
            value={newActivity.description}
            onChange={handleInputChange}
            placeholder="Descripción de la actividad"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          ></textarea>
          <div className="tw-flex tw-space-x-4">
            <input
              type="text"
              name="ageGroup"
              value={newActivity.ageGroup}
              onChange={handleInputChange}
              placeholder="Grupo de edad"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
            <input
              type="number"
              name="duration"
              value={newActivity.duration}
              onChange={handleInputChange}
              placeholder="Duración (minutos)"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Actividad
          </button>
        </form>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-start">
              <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{activity.name}</h3>
              <button onClick={() => handleDeleteActivity(activity.id)} className="tw-text-red-500">
                <Trash className="tw-w-5 tw-h-5" />
              </button>
            </div>
            <p className="tw-text-gray-600 tw-mb-4">{activity.description}</p>
            <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-500">
              <span>Edad: {activity.ageGroup}</span>
              <span>Duración: {activity.duration} minutos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesView;

