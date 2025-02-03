import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Save } from "lucide-react";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const { actions, store } = useContext(Context);

  
  
  // Inicializa el estado con un objeto vacío o con valores predeterminados vacíos
  const [settings, setSettings] = useState({
    name_daycare: "Your Daycare name",
    admin_email: "admin@daycare.com",
    max_capacity: 20,
    phone: "123-456-789",
    schedule_attention: "Lunes a viernes de 9 am a 6 pm ",
    facebook: "www.facebook.com",
    twitter: "www.x.com",
    instagram: "www.instagram.com",
    linkedin: "www.linkedin.com",
    image: "https://s1.piq.land/2015/01/01/Dg2koi0aiyokD1XlAGofwVDZ_400x400.png",
    address: "calle #1300",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!store.settings || store.settings.length === 0) {
        try {
          await actions.fetchSettings();
        } catch (error) {
          console.error('Error al cargar las configuraciones:', error);
          Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
        }
      } else {
        const updatedSettings = store.settings[0]; 
        const newSettings = {
          id: updatedSettings.id,
          name_daycare: updatedSettings.name_daycare,
          admin_email: updatedSettings.admin_email,
          max_capacity: updatedSettings.max_capacity,
          phone: updatedSettings.phone,
          address: updatedSettings.address,
          schedule_attention: updatedSettings.schedule_attention,
          facebook: updatedSettings.facebook,
          twitter: updatedSettings.twitter,
          instagram: updatedSettings.instagram,
          linkedin: updatedSettings.linkedin,
          image: updatedSettings.image,
        };
  
        if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
          setSettings(newSettings);
        }
      }
    };
  
    fetchData();
  }, [store.settings]); 
  
  
  
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setSettings((prevState) => ({
        ...prevState,
        image: result.url, 
      }));
    }
  };

  const handleSubmitt = async (e) => {
    e.preventDefault();
  
  
    if (!settings.id) {
      console.error("ID no está definido");
      return;
    }
  
    try {
      await actions.updateSettings(settings.id, settings);
      await actions.fetchSettings();
      Swal.fire('Éxito', 'Configuración actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
      Swal.fire('Error', 'No se pudo actualizar la configuración', 'error');
    }
  };
  

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Configuración del Sistema</h1>
        </header>
        <main className="tw-p-6">
          <form onSubmit={handleSubmitt} className="tw-space-y-6">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Configuración General</h2>
              <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
                <div>
                  <label htmlFor="name_daycare" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Nombre del Centro
                  </label>
                  <input
                    type="text"
                    id="name_daycare"
                    name="name_daycare"
                    value={settings.name_daycare}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="admin_email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Email del Administrador
                  </label>
                  <input
                    type="email"
                    id="admin_email"
                    name="admin_email"
                    value={settings.admin_email}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="max_capacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    id="max_capacity"
                    name="max_capacity"
                    value={settings.max_capacity}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="openingHours" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    id="openingHours"
                    name="openingHours"
                    value={settings.schedule_attention}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
              </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Redes Sociales</h2>
              <div>
                <label htmlFor="facebook" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={settings.twitter}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div>
                <label htmlFor="linkedin" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                  Linkedin
                </label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  value={settings.linkedin}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Logo</h2>
              {settings.image && (
                <div className="tw-mb-4">
                  <h4 className="tw-text-sm">Imagen Actual:</h4>
                  <img src={settings.image} alt="Imagen del Evento" className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md" />
                </div>
              )}

              <div className="tw-flex-1">
                <label htmlFor="image" className="tw-block tw-mb-2">Imagen</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
              >
                <Save className="tw-w-5 tw-h-5 tw-mr-2" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
