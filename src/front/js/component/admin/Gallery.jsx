import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const GalleryView = () => {
  const { actions, store } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [newImage, setNewImage] = useState({
    name:'',
    image:0,

  });

 useEffect(() => {
     actions.fetchGallery();
   }, []);

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingGallery) {
      setEditingGallery({ ...editingGallery, [name]: value });
    } else {
      setNewImage({ ...newImage, [name]: value });
    }
  };
   
  const handleImageChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setNewImage({ ...newImage, image: result.url });
    }
  };
  const handleImageEditChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setEditingGallery((prevState) => {
        const updatedService = {
          ...prevState,
          image: result.url,
        };
        return updatedService;
      });
    }
  };
  const handleEditGallery = (gallery) => {
    setEditingGallery(gallery);
    setIsModalOpen(true);
  };

  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    await actions.updateGallery(editingGallery.id, editingGallery);
    setIsModalOpen(false);
    setEditingGallery(null);
  };

  const handleAddGallery = async (e) => {
      e.preventDefault();
  
      const confirmSubmit = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to add this image?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, add!",
        cancelButtonText: "No, cancel",
      });
  
      if (!confirmSubmit.isConfirmed) {
        return;
      }
  
      try {
        const result = await actions.addGallery(
         
          newImage.name,
          newImage.image
        );
  
        if (result) {
          Swal.fire({
            icon: "success",
            title: "Image Added",
            text: "A new Image has been added!",
          });
          actions.fetchGallery();
          setNewImage({
            name: '',
            image: ''
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `There was an error: ${result.error}`,
          });
        }
      } catch (error) {
        console.error("Error in handleAddGallery:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: "There was an error submitting the form. Please try again.",
        });
      }
    };
    const handleDeleteGallery = async (id) => {
        const confirmDelete = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción no se puede deshacer.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        });
    
        if (confirmDelete.isConfirmed) {
          try {
            const result = await actions.deleteGallery(id);
    
            if (result) {
              Swal.fire({
                icon: 'success',
                title: 'Imagen eliminada',
                text: 'La imagen ha sido eliminada con éxito.',
              });
              actions.fetchGallery();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar la imagen.',
              });
            }
          } catch (error) {
            console.error("Error en handleDeleteGallery:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al intentar eliminar la imagen. Intenta nuevamente.',
            });
          }
        }
      };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Imagenes</h2>
      <div className="tw-mb-6">
        <form  className="tw-flex tw-space-x-4" onSubmit={handleAddGallery} >
         
          <div className='tw-flex-1'>
            <label htmlFor="name" className='tw-block tw-mb-2'>Nombre de la imagen</label>
            <input
              type="text"
              name="name"
              value={newImage.name}
              onChange={handleInputChange}
              placeholder="nombreDelServicio"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <div className='tw-flex-1'>
            <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Imagen
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Imagen</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.gallery.map((gallery) => (
            <tr key={gallery.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{gallery.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                {gallery.image ? <img src={gallery.image} alt="Class" className="tw-w-16 tw-h-16 tw-object-cover" /> : "No image"}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3" onClick={() => handleEditGallery(gallery)}>
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900"  onClick={() => handleDeleteGallery(gallery.id)} >
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-p-8 tw-rounded-md tw-shadow-lg tw-w-1/2">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
              <h3 className="tw-text-xl tw-font-semibold">Editar Imagen</h3>
              <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-6 tw-h-6" />
              </button>
            </div>
            <form  className="tw-space-y-4" onSubmit={handleUpdateGallery}>
              
              <div className='tw-flex-1'>
                <label htmlFor="name" className='tw-block tw-mb-2'>Nombre de la imagen</label>
                <input
                  type="text"
                  name="name"
                  value={editingGallery.name}
                  onChange={handleInputChange}
                  placeholder="Nombre de la clase"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>

              {editingGallery.image && ( 
                <div className="tw-mb-4">
                  <h4 className="tw-text-sm">Imagen Actual:</h4>
                  <img src={editingGallery.image} alt="Imagen del Servicio" className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md" />
                </div>
            )}

              <div className='tw-flex-1'>
                <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageEditChange}
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>

              <div className="tw-flex tw-justify-end tw-space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="tw-bg-gray-200 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-blue-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

export default GalleryView;

