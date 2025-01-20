import React, { useState } from 'react';
import { Plus, Play, Trash } from 'lucide-react';

const VideosView = () => {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Introducción a la guardería', url: '#', thumbnail: 'https://medlineplus.gov/images/ChildrensHealth_share.jpg', lastUpload : '2025-10-01' },
    { id: 2, title: 'Tour por las instalaciones', url: '#', thumbnail: 'https://medlineplus.gov/images/ChildrensHealth_share.jpg', lastUpload : '2025-10-01'},
    { id: 3, title: 'Actividades diarias', url: '#', thumbnail: 'https://medlineplus.gov/images/ChildrensHealth_share.jpg', lastUpload : '2025-10-01'},
  ]);

  const [newVideo, setNewVideo] = useState({ title: '', url: '' });

  const handleInputChange = (e) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    setVideos([...videos, { id: videos.length + 1, ...newVideo, thumbnail: 'https://medlineplus.gov/images/ChildrensHealth_share.jpg' }]);
    setNewVideo({ title: '', url: '' });
  };

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <div className='tw-max-[100px]:bg-sky-900'>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Videos</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddVideo} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="title"
            value={newVideo.title}
            onChange={handleInputChange}
            placeholder="Título del video"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="url"
            name="url"
            value={newVideo.url}
            onChange={handleInputChange}
            placeholder="URL del video"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Video
          </button>
        </form>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {videos.map((video) => (
          <div key={video.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
            <div className="tw-relative ">
              <img  src={video.thumbnail || "https://medlineplus.gov/images/ChildrensHealth_share.jpg"} alt={video.title} className="tw-aspect-w-4 tw-aspect-h-3 tw-w-25" />
              <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                <Play className="tw-w-12 tw-h-12 tw-text-white tw-opacity-75" />
              </div>
            </div>
            <div className="tw-p-4">
              <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{video.title}</h3>
              <small className="tw-text-gray-500 tw-mb-4">Última actualización: {video.lastUpload}</small>
              <div className="tw-flex tw-justify-between tw-items-center">
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="tw-text-blue-500 hover:tw-underline">Ver video</a>
                <button onClick={() => handleDeleteVideo(video.id)} className="tw-text-red-500">
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosView;

