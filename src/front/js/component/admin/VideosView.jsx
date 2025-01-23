import React, { useState, useEffect, useContext } from "react"
import { Plus, Play, Trash, X } from "lucide-react"
import { Context } from "../../store/appContext"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div className="tw-bg-white tw-rounded-lg tw-p-6 tw-relative tw-w-11/12 tw-max-w-4xl">
        <button onClick={onClose} className="tw-absolute tw-top-2 tw-right-2 tw-text-gray-500 hover:tw-text-gray-700">
          <X className="tw-w-6 tw-h-6" />
        </button>
        {children}
      </div>
    </div>
  )
}

const VideosView = () => {
  const { store, actions } = useContext(Context)
  const [videos, setVideos] = useState([])
  const [newVideo, setNewVideo] = useState({ title: "", file: null })
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    actions.fetchVideos()
  }, [])

  useEffect(() => {
    setVideos(store.videos)
  }, [store.videos])

  const handleInputChange = (e) => {
    if (e.target.name === "file") {
      setNewVideo({ ...newVideo, file: e.target.files[0] })
    } else {
      setNewVideo({ ...newVideo, [e.target.name]: e.target.value })
    }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    if (newVideo.file && newVideo.title) {
      const formData = new FormData()
      formData.append("file", newVideo.file)
      formData.append("title", newVideo.title)

      const uploadResult = await actions.uploadVideo(formData)
      if (uploadResult.success) {
        setNewVideo({ title: "", file: null })
        actions.fetchVideos()
      } else {
        console.error("Error uploading video:", uploadResult.error)
      }
    }
  }

  const handleDeleteVideo = async (id) => {
    const deleteResult = await actions.deleteVideo(id)
    if (deleteResult.success) {
      actions.fetchVideos()
    } else {
      console.error("Error deleting video:", deleteResult.error)
    }
  }

  const openVideoModal = (video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
    setIsModalOpen(false)
  }

  return (
    <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
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
            type="file"
            name="file"
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            accept="video/*"
            required
          />
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
          >
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Video
          </button>
        </form>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {videos.map((video) => (
          <div key={video.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
            <div className="tw-relative">
              <video className="tw-w-full tw-h-48 tw-object-cover" onClick={() => openVideoModal(video)}>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                <Play
                  className="tw-w-12 tw-h-12 tw-text-white tw-opacity-75 tw-cursor-pointer"
                  onClick={() => openVideoModal(video)}
                />
              </div>
            </div>
            <div className="tw-p-4">
              <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{video.title}</h3>
              <small className="tw-text-gray-500 tw-mb-4 tw-block">
                Última actualización: {new Date(video.updatedAt).toLocaleDateString()}
              </small>
              <div className="tw-flex tw-justify-between tw-items-center">
                <button onClick={() => openVideoModal(video)} className="tw-text-blue-500 hover:tw-underline">
                  Ver video
                </button>
                <button onClick={() => handleDeleteVideo(video.id)} className="tw-text-red-500">
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeVideoModal}>
        {selectedVideo && (
          <div>
            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">{selectedVideo.title}</h3>
            <video controls className="tw-w-full">
              <source src={selectedVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default VideosView

