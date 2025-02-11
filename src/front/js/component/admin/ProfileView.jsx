import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X } from "lucide-react";

const InputField = React.memo(({ 
  icon: Icon, 
  label, 
  name, 
  value, 
  onChange, 
  isEditing,
  type = "text",
  textarea = false
}) => (
  <div className="tw-flex tw-items-center tw-mb-4">
    <Icon className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-3" />
    <div className="tw-flex-1">
      <p className="tw-text-sm tw-font-medium tw-text-gray-500">{label}</p>
      {isEditing ? (
        textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="3"
            className="tw-shadow-sm focus:tw-ring-indigo-500 focus:tw-border-indigo-500 tw-mt-1 tw-block tw-w-full tw-sm:text-sm tw-border tw-border-gray-300 tw-rounded-md"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-indigo-300 focus:tw-ring focus:tw-ring-indigo-200 focus:tw-ring-opacity-50"
          />
        )
      ) : (
        <p className="tw-text-base tw-text-gray-900 tw-mt-1">{value}</p>
      )}
    </div>
  </div>
));

const ImageUploader = ({ isEditing, imageUrl, onChange }) => (
  <div className="tw-bg-gray-50 tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6">
    <dt className="tw-text-sm tw-font-medium tw-text-gray-500">Foto de perfil</dt>
    <dd className="tw-mt-1 tw-text-sm tw-text-gray-900 tw-sm:mt-0 tw-sm:col-span-2">
      <div className="tw-flex tw-items-center">
        <span className="tw-h-24 tw-w-24 tw-rounded-full tw-overflow-hidden tw-bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="tw-h-full tw-w-full tw-object-cover"
            />
          ) : (
            <User className="tw-h-full tw-w-full tw-text-gray-300" />
          )}
        </span>
        {isEditing && (
          <input
            type="file"
            onChange={onChange}
            className="tw-ml-5"
            accept="image/*"
          />
        )}
      </div>
    </dd>
  </div>
);

const FormSection = ({ children, className = "" }) => (
  <div className={`${className} tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6`}>
    {children}
  </div>
);

const ProfileView = () => {
  const { store, actions } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({ 
    name: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    join_date: "",
    bio: "",
    image: ""
  });

  // Cargar perfil inicial
  useEffect(() => {
    actions.fetchAdminProfile();
  }, []);

  // Sincronizar con el store
  useEffect(() => {
    if (store.adminProfile) {
      setEditedProfile(store.adminProfile);
    }
  }, [store.adminProfile]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updatedProfile = { ...editedProfile };
      
      if (imageFile) {
        const response = await actions.uploadToCloudinary(imageFile);
        if (response?.url) updatedProfile.image = response.url;
      }

      await actions.updateAdminProfile(updatedProfile);
      await actions.fetchAdminProfile(); // Forzar actualización del store
      
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setEditedProfile(store.adminProfile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
      <div className="tw-bg-white tw-shadow tw-overflow-hidden tw-sm:rounded-lg">
        <div className="tw-px-4 tw-py-5 tw-sm:px-6">
          <h3 className="tw-text-lg tw-leading-6 tw-font-medium tw-text-gray-900">Perfil de Usuario</h3>
          <p className="tw-mt-1 tw-max-w-2xl tw-text-sm tw-text-gray-500">Información personal y detalles</p>
        </div>
        
        <div className="tw-border-t tw-border-gray-200">
          <dl>
            <ImageUploader 
              isEditing={isEditing}
              imageUrl={store.adminProfile?.image}
              onChange={handleImageChange}
            />

            <FormSection className="tw-bg-white">
              <InputField
                icon={User}
                label="Nombre completo"
                name="name"
                value={editedProfile.name || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField
                icon={Mail}
                label="Correo electrónico"
                name="email"
                value={editedProfile.email || ""}
                onChange={handleChange}
                isEditing={isEditing}
                type="email"
              />
              <InputField
                icon={Phone}
                label="Teléfono"
                name="phone"
                value={editedProfile.phone || ""}
                onChange={handleChange}
                isEditing={isEditing}
                type="tel"
              />
            </FormSection>

            <FormSection className="tw-bg-gray-50">
              <InputField
                icon={MapPin}
                label="Dirección"
                name="address"
                value={editedProfile.address || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField
                icon={Briefcase}
                label="Cargo"
                name="position"
                value={editedProfile.position || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InputField
                icon={Calendar}
                label="Fecha de incorporación"
                name="join_date"
                value={editedProfile.join_date || ""}
                onChange={handleChange}
                isEditing={isEditing}
                type="date"
              />
            </FormSection>

            <FormSection className="tw-bg-white">
              <InputField
                label="Biografía"
                name="bio"
                value={editedProfile.bio || ""}
                onChange={handleChange}
                isEditing={isEditing}
                textarea={true}
                icon={({ className }) => <div className={className} />}
              />
            </FormSection>
          </dl>
        </div>

        <div className="tw-px-4 tw-py-3 tw-bg-gray-50 tw-text-right tw-sm:px-6">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="tw-mr-2 tw-inline-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-shadow-sm tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-gray-600 hover:tw-bg-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-gray-500"
              >
                <X className="tw-w-5 tw-h-5 tw-mr-2" /> Cancelar
              </button>
              <button
                onClick={handleSave}
                className="tw-inline-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-shadow-sm tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-indigo-600 hover:tw-bg-indigo-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
              >
                <Save className="tw-w-5 tw-h-5 tw-mr-2" /> Guardar Cambios
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="tw-inline-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-shadow-sm tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-indigo-600 hover:tw-bg-indigo-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
            >
              <Edit2 className="tw-w-5 tw-h-5 tw-mr-2" /> Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;