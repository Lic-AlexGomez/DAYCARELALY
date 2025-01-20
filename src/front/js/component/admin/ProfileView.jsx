import React, { useState } from "react"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X } from "lucide-react"

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+34 123 456 789",
    address: "Calle Mayor 123, Madrid, España",
    position: "Administrador Senior",
    joinDate: "01/01/2020",
    bio: "Administrador experimentado con más de 10 años en el sector educativo.",
  })

  const [editedProfile, setEditedProfile] = useState({ ...profile })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    // Here you would typically send the updated profile to your backend
    console.log("Profile updated:", editedProfile)
  }

  const handleCancel = () => {
    setEditedProfile({ ...profile })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const ProfileField = ({ icon: Icon, label, value, name }) => (
    <div className="tw-flex tw-items-center tw-mb-4">
      <Icon className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-3" />
      <div>
        <p className="tw-text-sm tw-font-medium tw-text-gray-500">{label}</p>
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={editedProfile[name]}
            onChange={handleChange}
            className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-indigo-300 focus:tw-ring focus:tw-ring-indigo-200 focus:tw-ring-opacity-50"
          />
        ) : (
          <p className="tw-text-base tw-text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
      <div className="tw-bg-white tw-shadow tw-overflow-hidden tw-sm:rounded-lg">
        <div className="tw-px-4 tw-py-5 tw-sm:px-6">
          <h3 className="tw-text-lg tw-leading-6 tw-font-medium tw-text-gray-900">Perfil de Usuario</h3>
          <p className="tw-mt-1 tw-max-w-2xl tw-text-sm tw-text-gray-500">Información personal y detalles</p>
        </div>
        <div className="tw-border-t tw-border-gray-200">
          <dl>
            <div className="tw-bg-gray-50 tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6">
              <dt className="tw-text-sm tw-font-medium tw-text-gray-500">Foto de perfil</dt>
              <dd className="tw-mt-1 tw-text-sm tw-text-gray-900 tw-sm:mt-0 tw-sm:col-span-2">
                <div className="tw-flex tw-items-center">
                  <span className="tw-h-24 tw-w-24 tw-rounded-full tw-overflow-hidden tw-bg-gray-100">
                    <User className="tw-h-full tw-w-full tw-text-gray-300" />
                  </span>
                  {isEditing && (
                    <button className="tw-ml-5 tw-bg-white tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-text-sm tw-leading-4 tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500">
                      Cambiar
                    </button>
                  )}
                </div>
              </dd>
            </div>
            <div className="tw-bg-white tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6">
              <ProfileField icon={User} label="Nombre completo" value={profile.name} name="name" />
              <ProfileField icon={Mail} label="Correo electrónico" value={profile.email} name="email" />
              <ProfileField icon={Phone} label="Teléfono" value={profile.phone} name="phone" />
            </div>
            <div className="tw-bg-gray-50 tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6">
              <ProfileField icon={MapPin} label="Dirección" value={profile.address} name="address" />
              <ProfileField icon={Briefcase} label="Cargo" value={profile.position} name="position" />
              <ProfileField icon={Calendar} label="Fecha de incorporación" value={profile.joinDate} name="joinDate" />
            </div>
            <div className="tw-bg-white tw-px-4 tw-py-5 tw-sm:grid tw-sm:grid-cols-3 tw-sm:gap-4 tw-sm:px-6">
              <dt className="tw-text-sm tw-font-medium tw-text-gray-500">Biografía</dt>
              <dd className="tw-mt-1 tw-text-sm tw-text-gray-900 tw-sm:mt-0 tw-sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleChange}
                    rows="3"
                    className="tw-shadow-sm focus:tw-ring-indigo-500 focus:tw-border-indigo-500 tw-mt-1 tw-block tw-w-full tw-sm:text-sm tw-border tw-border-gray-300 tw-rounded-md"
                  />
                ) : (
                  profile.bio
                )}
              </dd>
            </div>
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
  )
}

export default ProfileView

