import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const InventoryView = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Lápices de colores', quantity: 100, category: 'Útiles escolares', lastupdated: '2025-10-01' },
    { id: 2, name: 'Pelotas de juego', quantity: 20, category: 'Juguetes', lastupdated: '2025-09-15' },
    { id: 3, name: 'Libros infantiles', quantity: 50, category: 'Material educativo', lastupdated: '2025-10-05' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: '', lastupdated: '' });

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems([...items, { id: items.length + 1, ...newItem, quantity: parseInt(newItem.quantity) }]);
    setNewItem({ name: '', quantity: '', category: '' , lastupdated: '' });
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Inventario</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddItem} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Nombre del artículo"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
            placeholder="Cantidad"
            className="tw-w-24 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            placeholder="Categoría"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input 
            type="date"
            name="lastupdated"
            value={newItem.lastupdated}
            onChange={handleInputChange}
            className="tw-w-40 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Artículo
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Cantidad</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Última Actualización</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Categoría</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.quantity}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.lastupdated}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.category}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteItem(item.id)}>
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryView;

