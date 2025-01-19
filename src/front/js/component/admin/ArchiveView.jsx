import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const ArchiveView = () => {
  const [archive, setArchive] = useState([
    {
      id: 1,
      name: 'Documentos 2023',
      type: 'folder',
      expanded: false,
      children: [
        { id: 2, name: 'Inscripciones.pdf', type: 'file' },
        { id: 3, name: 'Horarios.xlsx', type: 'file' },
      ]
    },
    {
      id: 4,
      name: 'Fotos',
      type: 'folder',
      expanded: false,
      children: [
        { id: 5, name: 'Evento de primavera.jpg', type: 'file' },
        { id: 6, name: 'Graduación.jpg', type: 'file' },
      ]
    },
  ]);

  const toggleFolder = (id) => {
    setArchive(archive.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const renderArchiveItem = (item) => (
    <div key={item.id} className="tw-mb-2">
      {item.type === 'folder' ? (
        <div>
          <button 
            className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-blue-600"
            onClick={() => toggleFolder(item.id)}
          >
            {item.expanded ? <ChevronDown className="tw-w-4 tw-h-4 tw-mr-1" /> : <ChevronRight className="tw-w-4 tw-h-4 tw-mr-1" />}
            <Folder className="tw-w-5 tw-h-5 tw-mr-2" />
            {item.name}
          </button>
          {item.expanded && (
            <div className="tw-ml-6 tw-mt-2">
              {item.children.map(child => renderArchiveItem(child))}
            </div>
          )}
        </div>
      ) : (
        <div className="tw-flex tw-items-center tw-text-gray-600">
          <File className="tw-w-5 tw-h-5 tw-mr-2" />
          {item.name}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Archivo</h2>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
        {archive.map(item => renderArchiveItem(item))}
      </div>
    </div>
  );
};

export default ArchiveView;

