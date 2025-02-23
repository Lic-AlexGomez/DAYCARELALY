import React, { useState, useEffect, useContext } from "react";
import { Save, Loader2 } from "lucide-react";
import { Context } from "../../store/appContext";
import { set } from "date-fns/set";

const Card = ({ className, children, ...props }) => (
  <div className={`tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const baseStyles =
    "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-pointer-events-none tw-ring-offset-background";
  const variants = {
    default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
    outline: "tw-border tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground",
  };
  const sizes = {
    default: "tw-h-10 tw-py-2 tw-px-4",
    sm: "tw-h-9 tw-px-3",
    lg: "tw-h-11 tw-px-8",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className, ...props }) => (
  <input
    className={`tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${className}`}
    {...props}
  />
);

const SettingsView = () => {
  const { actions, store } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado inicial combinando valores por defecto con datos del backend
  const [settings, setSettings] = useState(() => {
    const initialSettings = store?.settings || {};
    return {
      id: store.user?.id || "",
      name_daycare: initialSettings?.name_daycare || "",
      admin_email: initialSettings?.admin_email || "",
      max_capacity: initialSettings?.max_capacity ? Number(initialSettings?.max_capacity) : 0,
      phone: initialSettings?.phone || "",
      schedule_attention: initialSettings?.schedule_attention || "",
      facebook: initialSettings?.facebook || "",
      twitter: initialSettings?.twitter || "",
      instagram: initialSettings?.instagram || "",
      linkedin: initialSettings?.linkedin || "",
      image: initialSettings?.image || "",
      address: initialSettings?.address || "",
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await actions.fetchSettings();
        await setSettings((prev) => ({
          ...prev,
          id: store.settings?.id || "",
          name_daycare: store.settings?.name_daycare || "",
          admin_email: store.settings?.admin_email || "",
          max_capacity: store.settings?.max_capacity ? Number(store.settings?.max_capacity) : 0,
          phone: store.settings?.phone || "",
          schedule_attention: store.settings?.schedule_attention || "",
          facebook: store.settings?.facebook || "",
          twitter: store.settings?.twitter || "",
          instagram: store.settings?.instagram || "",
          linkedin: store.settings?.linkedin || "",
          image: store.settings?.image || "",
          address: store.settings?.address || "",
        }));
      } catch (error) {
        setError("Configuration could not be loaded. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  
  }, []);



  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await actions.uploadToCloudinary(file);
        if (result.success) {
          setSettings((prev) => ({
            ...prev,
            image: result.url,
          }));
        } else {
          throw new Error(result.error || "Error uploading image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Could not upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!settings.id) {
      
      setIsLoading(false);
      return;
    }

    try {
      let result = null;
      if(store.settings === undefined){
        result= await actions.addSettings(settings);
      }
      else{
        console.log("settings", settings)
        result = await actions.updateSettings(settings);
      }
      if (result) {
        await actions.fetchSettings(); // Recargar datos actualizados
        alert("Settings updated successfully!");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
      </div>
    );
  }


  return (
    <div className="tw-container tw-mx-auto tw-p-4">
      <h1 className="tw-text-3xl tw-font-bold tw-mb-6">System Configuration</h1>
      {error && (
        <div
          className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative tw-mb-4"
          role="alert"
        >
          <strong className="tw-font-bold">Error: </strong>
          <span className="tw-block tw-sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="tw-space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
            <div>
              <label htmlFor="name_daycare" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Daycere Name
              </label>
              <Input
                type="text"
                id="name_daycare"
                name="name_daycare"
                value={settings.name_daycare || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="admin_email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Administrator Email
              </label>
              <Input
                type="email"
                id="admin_email"
                name="admin_email"
                value={settings.admin_email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="max_capacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Maximum daycare capacity
              </label>
              <Input
                type="number"
                id="max_capacity"
                name="max_capacity"
                value={settings.max_capacity || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Phone
              </label>
              <Input type="tel" id="phone" name="phone" value={settings.phone || ""} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Address
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={settings.address || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="schedule_attention"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
              >
                Daycare Schedule
              </label>
              <Input
                type="text"
                id="schedule_attention"
                name="schedule_attention"
                value={settings.schedule_attention || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social networks</CardTitle>
          </CardHeader>
          <CardContent className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
            <div>
              <label htmlFor="facebook" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Facebook
              </label>
              <Input
                type="text"
                id="facebook"
                name="facebook"
                value={settings.facebook || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="twitter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Twitter
              </label>
              <Input
                type="text"
                id="twitter"
                name="twitter"
                value={settings.twitter || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="instagram" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Instagram
              </label>
              <Input
                type="text"
                id="instagram"
                name="instagram"
                value={settings.instagram || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                LinkedIn
              </label>
              <Input
                type="text"
                id="linkedin"
                name="linkedin"
                value={settings.linkedin || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent>
            {settings.image && (
              <div className="tw-mb-4">
                <img
                  src={settings.image || " "}
                  alt="Logo del Centro"
                  className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md"
                />
              </div>
            )}
            <div>
              <label htmlFor="image" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Upload new logo
              </label>
              <Input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="tw-mr-2 tw-h-4 tw-w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsView

