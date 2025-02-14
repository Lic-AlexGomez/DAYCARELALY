import { se } from "date-fns/locale/se"
import { set } from "date-fns/set"

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      admin: null,
      paren: null,
      teache: null,
      token: localStorage.getItem("token") || null,
      user: JSON.parse(localStorage.getItem("user")) || null,
      message: null,
      uploadedFileUrl: null,
      error: null,
      classes: [],
      programs: [],
      clients: [],
      schedules: [],
      emails: [],
      scheduledEmails: [],
      videos: [],
      inactiveAccounts: [],
      approvals: [],
      activities: [],
      events: [],
      teachers: [],
      services: [],
      gallery: [],
      subscriptions: [],
      adminProfile: [],
      newsletter: [],

      // Parent dashboard store
      parentData: null,
      parentChildren: [],
      parentSchedule: [],
      parentPayments: [],
      parentActivities: [],
      parentSettings: null,
      parentVirtualClasses: [],
      notifications: [],
      enrolledClasses: [],
      enrolledClasses: [], 
      filteredClasses: [],
      myClasses: [],

      // Teacher dashboard store
      teacherData: null,
      teacherClasses: [],
      teacherStudents: [],
      getintouchMessages: [],
    },
    actions: {

      getAuthHeaders: () => {
        const token = localStorage.getItem("token")
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      },

      signUp: async (signupData) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Sign Up Failed")
          }

          const data = await response.json()
          setStore({ user: data.user, token: data.token })
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          return { success: true, data }
        } catch (error) {
          console.error("Sign Up Error:", error.message)
          return { success: false, error: error.message }
        }
      },


      uploadToCloudinary: async (file) => {
        const BACKEND_URL = process.env.BACKEND_URL
        const store = getStore()

        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch(`${BACKEND_URL}api/upload`, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to upload file")
          }

          const data = await response.json()
          setStore({ uploadedFileUrl: data.url, error: null })

          return { success: true, url: data.url }
        } catch (error) {
          console.error("Upload Error:", error.message)
          setStore({ error: error.message })
          return { success: false, error: error.message }
        }
      },
      uploadToCloudinaryImg: async (file) => {
        const BACKEND_URL = process.env.BACKEND_URL
        const store = getStore()

        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch(`${BACKEND_URL}api/upload/img`, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to upload file")
          }

          const data = await response.json()
          setStore({ uploadedFileUrl: data.url, error: null })

          return { success: true, url: data.url }
        } catch (error) {
          console.error("Upload Error:", error.message)
          setStore({ error: error.message })
          return { success: false, error: error.message }
        }
      },

      fetchClasses: async () => {
        try {
        
          const response = await fetch(process.env.BACKEND_URL + "api/classes", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ classes: data })
          } else {
            console.error("Error fetching classes:", response.status)
          }
        } catch (error) {
          console.error("Error fetching classes:", error)
          return null
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()
          console.log("DATOS RECIBIDOS EN LOGIN:", data)

          if (response.ok) {
            localStorage.setItem("token", "")
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            setStore({
              token: data.token,
              user: data.user,
              parent_id: data.user.parent_id,
            })

            console.log("TOKEN GUARDADO EN STORE:", getStore().token)

            return data
          } else {
            console.log("Error en login:", response.status, response.statusText)
          }
        } catch (error) {
          console.log("Error en login:", error)
        }
      },
      fetchnewsletter: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/newsletter", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ newsletter: data })
          } else {
            console.error("Error fetching newsletter:", response.status)
          }
        } catch (error) {
          console.error("Error fetching newsletter:", error)
        }
      },
      newsletter: async (email) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          })

          if (response.status === 400 || response.status === 422) {
            alert("The email is not in a valid format. ")
          } else if (response.status === 409) {
            alert("This email is already subscribed.")
          }

          const data = await response.json()

          setStore({ user: data.user })
          return data
        } catch (error) {
          console.log("Error loading message from backend", error)
        }
      },
      deleteNewsletterSubscriber: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/newsletter/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ newsletter: data })
          }
        } catch (error) {
          console.error("Error deleting newsletter subscriber:", error)
        }
      },

      getinTouch: async (name, email, subject, phone_number, message) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/getintouch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, subject, phone_number, message }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to send message")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Get in touch Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      contactUs: async (first_name, last_name, email, subject, phone_number, message) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/contacts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ first_name, last_name, email, subject, phone_number, message }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to send message")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Contact Us Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      getPrograms: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/programs", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ programs: data })
          } else {
            console.error("Error fetching programs:", response.status)
          }
        } catch (error) {
          console.error("Error fetching programs:", error)
        }
      },

      // Admin Dashboard actions

      // Clients
      GetClients: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/clients", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ clients: data })

            // If the database is empty, load initial data
            if (data.length === 0) {
              getActions().loadInitialClientsData()
            }
          } else {
            console.error("Error fetching clients:", response.status)
          }
        } catch (error) {
          console.error("Error fetching clients:", error)
        }
      },

      loadInitialClientsData: async () => {
        const initialClients = [
          { name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", status: "Activo" },
          { name: "María García", email: "maria@example.com", phone: "098-765-4321", status: "Inactivo" },
          { name: "Carlos Rodríguez", email: "carlos@example.com", phone: "555-555-5555", status: "Activo" },
        ]

        try {
          for (const client of initialClients) {
            await getActions().addClient(client)
          }
        } catch (error) {
          console.error("Error loading initial clients data:", error)
        }
      },

      addClient: async (clientData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/clients", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(clientData),
          })

          if (response.ok) {
            const newClient = await response.json()
            const store = getStore()
            setStore({ clients: [...store.clients, newClient] })
            return newClient
          } else {
            console.error("Error adding client:", response.status)
          }
        } catch (error) {
          console.error("Error adding client:", error)
        }
      },

      updateClient: async (id, clientData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/clients/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(clientData),
          })

          if (response.ok) {
            const updatedClient = await response.json()
            const store = getStore()
            const updatedClients = store.clients.map((client) => (client.id === id ? updatedClient : client))
            setStore({ clients: updatedClients })
            return updatedClient
          } else {
            console.error("Error updating client:", response.status)
          }
        } catch (error) {
          console.error("Error updating client:", error)
        }
      },

      deleteClient: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/clients/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            const store = getStore()
            const updatedClients = store.clients.filter((client) => client.id !== id)
            setStore({ clients: updatedClients })
          } else {
            console.error("Error deleting client:", response.status)
          }
        } catch (error) {
          console.error("Error deleting client:", error)
        }
      },

      // Schedules
      GetSchedules: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/schedules", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ schedules: data })

            // If the database is empty, load initial data
            if (data.length === 0) {
              getActions().loadInitialSchedulesData()
            }
          } else {
            console.error("Error fetching schedules:", response.status)
          }
        } catch (error) {
          console.error("Error fetching schedules:", error)
        }
      },

      loadInitialSchedulesData: async () => {
        const initialSchedules = [
          {
            class: "Arte y Creatividad",
            teacher: "María García",
            dayOfWeek: "Lunes",
            startTime: "09:00",
            endTime: "10:30",
            capacity: 15,
            enrolled: 12,
          },
          {
            class: "Música y Movimiento",
            teacher: "Juan Pérez",
            dayOfWeek: "Martes",
            startTime: "11:00",
            endTime: "12:30",
            capacity: 20,
            enrolled: 18,
          },
          {
            class: "Juegos Educativos",
            teacher: "Ana Rodríguez",
            dayOfWeek: "Miércoles",
            startTime: "14:00",
            endTime: "15:30",
            capacity: 12,
            enrolled: 10,
          },
        ]

        try {
          for (const schedule of initialSchedules) {
            await getActions().addSchedule(schedule)
          }
        } catch (error) {
          console.error("Error loading initial schedules data:", error)
        }
      },

      addSchedule: async (scheduleData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/schedules", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(scheduleData),
          })

          if (response.ok) {
            const newSchedule = await response.json()
            const store = getStore()
            setStore({ schedules: [...store.schedules, newSchedule] })
            return newSchedule
          } else {
            console.error("Error adding schedule:", response.status)
          }
        } catch (error) {
          console.error("Error adding schedule:", error)
        }
      },

      updateSchedule: async (id, scheduleData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/schedules/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(scheduleData),
          })

          if (response.ok) {
            const updatedSchedule = await response.json()
            const store = getStore()
            const updatedSchedules = store.schedules.map((schedule) =>
              schedule.id === id ? updatedSchedule : schedule,
            )
            setStore({ schedules: updatedSchedules })
            return updatedSchedule
          } else {
            console.error("Error updating schedule:", response.status)
          }
        } catch (error) {
          console.error("Error updating schedule:", error)
        }
      },

      deleteSchedule: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/schedules/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            const store = getStore()
            const updatedSchedules = store.schedules.filter((schedule) => schedule.id !== id)
            setStore({ schedules: updatedSchedules })
          } else {
            console.error("Error deleting schedule:", response.status)
          }
        } catch (error) {
          console.error("Error deleting schedule:", error)
        }
      },

      //Email
      GetEmails: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/emails", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            const emails = data.filter((email) => !email.scheduledDate)
            const scheduledEmails = data.filter((email) => email.scheduledDate)
            setStore({ emails, scheduledEmails })
          } else {
            console.error("Error fetching emails:", response.status)
          }
        } catch (error) {
          console.error("Error fetching emails:", error)
        }
      },

      sendEmail: async (emailData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/emails", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(emailData),
          })

          if (response.ok) {
            const newEmail = await response.json()
            const store = getStore()
            if (newEmail.scheduledDate) {
              setStore({ scheduledEmails: [...store.scheduledEmails, newEmail] })
            } else {
              setStore({ emails: [...store.emails, newEmail] })
            }
            return newEmail
          } else {
            console.error("Error sending email:", response.status)
          }
        } catch (error) {
          console.error("Error sending email:", error)
        }
      },

      deleteEmail: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/emails/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            const store = getStore()
            const updatedEmails = store.emails.filter((email) => email.id !== id)
            const updatedScheduledEmails = store.scheduledEmails.filter((email) => email.id !== id)
            setStore({ emails: updatedEmails, scheduledEmails: updatedScheduledEmails })
          } else {
            console.error("Error deleting email:", response.status)
          }
        } catch (error) {
          console.error("Error deleting email:", error)
        }
      },

      fetchVideos: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/videos", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ videos: data })
          } else {
            console.error("Error fetching videos:", response.status)
          }
        } catch (error) {
          console.error("Error fetching videos:", error)
        }
      },

      uploadVideo: async (formData) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/videos", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            return { success: true, data }
          } else {
            const errorData = await response.json()
            return { success: false, error: errorData.error || "Failed to upload video" }
          }
        } catch (error) {
          console.error("Error uploading video:", error)
          return { success: false, error: error.message }
        }
      },

      deleteVideo: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/videos/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            const errorData = await response.json()
            return { success: false, error: errorData.error || "Failed to delete video" }
          }
        } catch (error) {
          console.error("Error deleting video:", error)
          return { success: false, error: error.message }
        }
      },

      formEvent: async (full_name, events_selection, parent_name, special_request) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/eventsuscription", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ full_name, events_selection, parent_name, special_request }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to send message")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("form event Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      fetchInactiveAccounts: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/inactive-accounts", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ inactiveAccounts: data })
          } else {
            console.error("Error fetching inactive accounts:", response.status)
          }
        } catch (error) {
          console.error("Error fetching inactive accounts:", error)
        }
      },

      reactivateAccount: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/inactive-accounts/${id}/reactivate`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const updatedAccount = await response.json()
            const store = getStore()
            const updatedAccounts = store.inactiveAccounts.map((account) =>
              account.id === id ? updatedAccount : account,
            )
            setStore({ inactiveAccounts: updatedAccounts })
            return { success: true, data: updatedAccount }
          } else {
            console.error("Error reactivating account:", response.status)
            return { success: false, error: "Failed to reactivate account" }
          }
        } catch (error) {
          console.error("Error reactivating account:", error)
          return { success: false, error: error.message }
        }
      },

      sendReminder: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/inactive-accounts/${id}/send-reminder`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error sending reminder:", response.status)
            return { success: false, error: "Failed to send reminder" }
          }
        } catch (error) {
          console.error("Error sending reminder:", error)
          return { success: false, error: error.message }
        }
      },

      deleteInactiveAccount: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/inactive-accounts/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const store = getStore()
            const updatedAccounts = store.inactiveAccounts.filter((account) => account.id !== id)
            setStore({ inactiveAccounts: updatedAccounts })
            return { success: true }
          } else {
            console.error("Error deleting inactive account:", response.status)
            return { success: false, error: "Failed to delete inactive account" }
          }
        } catch (error) {
          console.error("Error deleting inactive account:", error)
          return { success: false, error: error.message }
        }
      },

      // Approvals actions
      fetchApprovals: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/approvals", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ approvals: data })
          } else {
            console.error("Error fetching approvals:", response.status)
          }
        } catch (error) {
          console.error("Error fetching approvals:", error)
        }
      },

      updateApprovalStatus: async (id, status) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/approvals/${id}`, {
            method: "PATCH",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ status }),
          })
          if (!response.ok) throw new Error("Error actualizando el estado")
          const updatedApproval = await response.json()

          // Actualiza el estado global
          setStore({
            approvals: getStore().approvals.map((item) => (item.id === updatedApproval.id ? updatedApproval : item)),
          })

          return { success: true }
        } catch (error) {
          console.error(error)
          return { success: false, error: error.message }
        }
      },

      fetchActivities: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/activities", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ activities: data })
            return { success: true, data }
          } else {
            console.error("Error fetching activities:", response.status)
            return { success: false, error: "Failed to fetch activities" }
          }
        } catch (error) {
          console.error("Error fetching activities:", error)
          return { success: false, error: error.message }
        }
      },

      createActivity: async (formData) => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");
      
          if (!token) {
            console.error("No token found");
            return;
          }
      
          const form = new FormData();
      
          for (const key in formData) {
            if (key === "image" && typeof formData[key] === "string") {
              form.append("image", formData[key]);
            } else if (key === "image" && formData[key] instanceof File) {
              form.append("image", formData[key]);
            } else {
              form.append(key, formData[key]);
            }
          }
      
          const response = await fetch(process.env.BACKEND_URL + "api/activities", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`, // Add token here
            },
            body: form,
          });
      
          if (response.ok) {
            const newActivity = await response.json();
            const store = getStore();
            setStore({ activities: [...store.activities, newActivity] });
            return { success: true, data: newActivity };
          } else {
            const error = await response.json();
            console.error("Error response:", error); // Log error response
            return { success: false, error: error.error || "Failed to create activity" };
          }
        } catch (error) {
          console.error("Error creating activity:", error);
          return { success: false, error: error.message };
        }
      },
      


      updateActivity: async (id, activityData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/activities/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(activityData),
          })

          if (response.ok) {
            const updatedActivity = await response.json()
            const store = getStore()
            const updatedActivities = store.activities.map((activity) =>
              activity.id === id ? updatedActivity : activity,
            )
            setStore({ activities: updatedActivities })
            return { success: true, data: updatedActivity }
          } else {
            const error = await response.json()
            return { success: false, error: error.error || "Failed to update activity" }
          }
        } catch (error) {
          console.error("Error updating activity:", error)
          return { success: false, error: error.message }
        }
      },

      deleteActivity: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/activities/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            const store = getStore()
            const updatedActivities = store.activities.filter((activity) => activity.id !== id)
            setStore({ activities: updatedActivities })
            return { success: true }
          } else {
            const error = await response.json()
            return { success: false, error: error.error || "Failed to delete activity" }
          }
        } catch (error) {
          console.error("Error deleting activity:", error)
          return { success: false, error: error.message }
        }
      },

      addClass: async (teacher_id, name, description, capacity, price, age, time, image) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/classes", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ teacher_id, name, description, capacity, price, age, time, image }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create class")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Class Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      getVirtualClasses: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/virtual-classes", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ parentvirtualClasses: data })
          }
        } catch (error) {
          console.error("Error fetching parent virtual classes:", error)
        }
      },

      deleteClass: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/classes/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error deleting class:", response.status)
            return { success: false, error: `Status: ${response.status}` }
          }
        } catch (error) {
          console.error("Error deleting class:", error)
          return { success: false, error: error.message }
        }
      },

      updateClass: async (id, classData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/classes/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(classData),
          })

          if (response.ok) {
            const updatedClass = await response.json()
            const store = getStore()
            const updatedClasses = store.classes.map((classes) => (classes.id === id ? updatedClass : classes))
            setStore({ classes: updatedClasses })
            return updatedClass
          } else {
            console.error("Error updating class:", response.status)
          }
        } catch (error) {
          console.error("Error updating class:", error)
        }
      },

      fetchEvents: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/events", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ events: data })
          } else {
            console.error("Error fetching events:", response.status)
          }
        } catch (error) {
          console.error("Error fetching events:", error)
          return null
        }
      },

      deleteEvent: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/events/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error deleting event:", response.status)
            return { success: false, error: `Status: ${response.status}` }
          }
        } catch (error) {
          console.error("Error deleting events:", error)
          return { success: false, error: error.message }
        }
      },

      addEvent: async (name, description, start_time, end_time, image) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/events", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ name, description, start_time, end_time, image }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create event")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Event Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      updateEvent: async (id, eventData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/events/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(eventData),
          })

          if (response.ok) {
            const updatedEvent = await response.json()
            const store = getStore()
            const updatedEvents = store.events.map((events) => (events.id === id ? updatedEvent : events))
            setStore({ events: updatedEvents })
            return updatedEvent
          } else {
            console.error("Error updating event:", response.status)
          }
        } catch (error) {
          console.error("Error updating event:", error)
        }
      },

      fetchTeachers: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/teachers", {
            headers: getActions().getAuthHeaders(),
          })
          console.log("RESPONSE FETCH TEACHERS:", response)
          if (response.ok) {
            const data = await response.json()
            setStore({ teachers: data })
            return { success: true, data }
          } else {
            console.error("Error fetching teachers:", response.status)
            return { success: false, error: "Failed to fetch teachers" }
          }
        } catch (error) {
          console.error("Error fetching teachers:", error)
          return { success: false, error: error.message }
        }
      },

      fetchTeachersClasses: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/teachers/classes", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ teachersClasses: data })
          } else {
            console.error("Error fetching teachers/classes:", response.status)
          }
        } catch (error) {
          console.error("Error fetching teachers/classes:", error)
        }
      },
      fetchServices: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/services", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ services: data })
            return { success: true, data }
          } else {
            console.error("Error fetching services:", response.status)
            return { success: false, error: "Failed to fetch services" }
          }
        } catch (error) {
          console.error("Error fetching services:", error)
          return { success: false, error: error.message }
        }
      },

      addService: async (name, description, image) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/services", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ name, description, image }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create service")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Service Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      updateService: async (id, serviceData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/services/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(serviceData),
          })

          if (response.ok) {
            const updatedService = await response.json()
            const store = getStore()
            const updatedServices = store.services.map((services) => (services.id === id ? updatedService : services))
            setStore({ services: updatedServices })
            return updatedService
          } else {
            console.error("Error updating service:", response.status)
          }
        } catch (error) {
          console.error("Error updating service:", error)
        }
      },

      deleteService: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/services/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error deleting service:", response.status)
            return { success: false, error: `Status: ${response.status}` }
          }
        } catch (error) {
          console.error("Error deleting service:", error)
          return { success: false, error: error.message }
        }
      },

      fetchGallery: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/gallery", {
            headers: getActions().getAuthHeaders(),
          })
          if (response.ok) {
            const data = await response.json()
            setStore({ gallery: data })
            return { success: true, data }
          } else {
            console.error("Error fetching gallery:", response.status)
            return { success: false, error: "Failed to fetch gallery" }
          }
        } catch (error) {
          console.error("Error fetching gallery:", error)
          return { success: false, error: error.message }
        }
      },

      updateGallery: async (id, galleryData) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/gallery/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(galleryData),
          })

          if (response.ok) {
            const updatedGallery = await response.json()
            const store = getStore()
            const updatedGalleries = store.gallery.map((gallery) => (gallery.id === id ? updatedGallery : gallery))
            setStore({ gallery: updatedGalleries })
            return updatedGallery
          } else {
            console.error("Error updating gallery:", response.status)
          }
        } catch (error) {
          console.error("Error updating gallery:", error)
        }
      },

      addGallery: async (name, image) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(process.env.BACKEND_URL + "api/gallery", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ name, image }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create image")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Gallery Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      deleteGallery: async (id) => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/gallery/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error deleting image:", response.status)
            return { success: false, error: `Status: ${response.status}` }
          }
        } catch (error) {
          console.error("Error deleting image:", error)
          return { success: false, error: error.message }
        }
      },

      // Datos del usuario
      fetchUserData: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/user`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch user data")
          const data = await resp.json()
          setStore({ user: data })
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      },

      // Datos del padre
      fetchParentData: async () => {

        const store = getStore()

        try {
          const resp = await fetch(process.env.BACKEND_URL + "api/parents/" + store.user.id, {
            headers: getActions().getAuthHeaders(),
          })
          const data = await resp.json()

          localStorage.setItem("parent_id", JSON.stringify(data.id))
          setStore({ parentData: data })
          
        } catch (error) {
          console.error("Error fetching parent data:", error)
        }
      },

      // Hijos
      fetchParentChildren: async () => {
        const id = localStorage.getItem("parent_id")
        const store = getStore()
        const token = store.token || localStorage.getItem("token")

        if (!token) {
          console.error("No token found")
          return
        }
        try {
          const resp = await fetch(process.env.BACKEND_URL + "api/children/" + id, {
            headers: getActions().getAuthHeaders(),
          })
          const data = await resp.json()

          setStore({ parentChildren: data })
        } catch (error) {
          console.error("Error fetching parent children:", error)
        }
      },

      addChild: async (childData) => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/children/${id}`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(childData),
          })
          if (!resp.ok) throw new Error("Failed to add child")
          const newChild = await resp.json()
          const store = getStore()
          setStore({ parentChildren: [...store.parentChildren, newChild] })
          return true
        } catch (error) {
          console.error("Error adding child:", error)
          return false
        }
      },

      // Horario
      fetchParentSchedule: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_schedules/${id}`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch parent schedule")
          const data = await resp.json()

          setStore({ parentSchedule: data })
        } catch (error) {
          console.error("Error fetching parent schedule:", error)
        }
      },

      // Pagos
      fetchParentPayments: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_payments/${id}`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch parent payments")
          const data = await resp.json()
          setStore({ parentPayments: data })
        } catch (error) {
          console.error("Error fetching parent payments:", error)
        }
      },

      // Actividades
      fetchParentActivities: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_activities/${id}`, {
            headers: getActions().getAuthHeaders(),
          })

          const data = await resp.json()
          console.log(data)
          setStore({ parentActivities: data })
        } catch (error) {
          console.error("Error fetching parent activities:", error)
        }
      },

      addParentActivity: async (activityData) => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(process.env.BACKEND_URL + "api/add_parent_activity/" + id, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(activityData),
          })
          const data = await resp.json()
          const store = getStore()
          setStore({ parentActivities: [...store.parentActivities, data] })
        } catch (error) {
          console.error("Error adding parent activity:", error)
        }
      },

      // Configuración
      fetchParentSettings: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_settings/${id}`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch parent settings")
          const data = await resp.json()
          console.log(data)
          setStore({ parentSettings: data })
        } catch (error) {
          console.error("Error fetching parent settings:", error)
        }
      },

      updateParentSettings: async (settings) => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_settings/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(settings),
          })
          if (!resp.ok) throw new Error("Failed to update parent settings")
          const data = await resp.json()
          setStore({ parentSettings: data })
        } catch (error) {
          console.error("Error updating parent settings:", error)
        }
      },

      // Clases virtuales
      fetchParentVirtualClasses: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/parent_virtual_classes/${id}`, {
            headers: getActions().getAuthHeaders(),
          })

          if (!resp.ok) throw new Error("Failed to fetch parent virtual classes")
          const data = await resp.json()
          console.log(data)
          setStore({ parentVirtualClasses: data })
        } catch (error) {
          console.error("Error fetching parent virtual classes:", error)
        }
      },

      // Mensajes
      fetchMessages: async () => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/messagesP/${id}`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch messages")
          const data = await resp.json()
          console.log(data)
          setStore({ messages: data })
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      },

      sendMessage: async (message) => {
        const id = localStorage.getItem("parent_id")

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/messages/${id}`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(message),
          })
          if (!resp.ok) throw new Error("Failed to send message")
          const data = await resp.json()
          setStore({ messages: [...getStore().messages, data] })
        } catch (error) {
          console.error("Error sending message:", error)
        }
      },

      // Notificaciones
      fetchNotifications: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/notifications`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch notifications")
          const data = await resp.json()
          setStore({ notifications: data })
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      },

      markNotificationAsRead: async (notificationId) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/notifications/${notificationId}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to mark notification as read")
          const updatedNotifications = getStore().notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif,
          )
          setStore({ notifications: updatedNotifications })
        } catch (error) {
          console.error("Error marking notification as read:", error)
        }
      },

      fetchSettings: async () => {
        try {
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            return
          }
          const resp = await fetch(`${process.env.BACKEND_URL}api/settings`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch settings")
          const data = await resp.json()

          setStore({ settings: data[0] })
        } catch (error) {
          console.error("Error fetching settings:", error)
        }
      },

      updateSettings: async (id, updatedSettings) => {
        try {
          
          const store = getStore()
          const token = store.token || localStorage.getItem("token")

          if (!token) {
            console.error("No token found")
            return
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/settings/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(updatedSettings),
          })

          if (response.ok) {
            const data = await response.json()
            const store = getStore()
            setStore({
              settings: store.settings.map((setting) => (setting.id === id ? data : setting)),
            })
            return true
          } else {
            console.error("Error updating settings:", response.status)
            return { success: false, error: "Failed to update settings" }
          }
        } catch (error) {
          console.error("Error updating settings:", error)
          return { success: false, error: "An unexpected error occurred" }
        }
      },

      addAdmin: async () => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/create_admin`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
          })

          if (!response.ok) {
           return false
          }
          setStore({ admin: true })
          localStorage.setItem("admin", true)
        } catch (error) {
        
        }
      },

      updateSubscription: async (id, subscriptionData) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/subscription/${id}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(subscriptionData),
          })

          if (response.ok) {
            const updatedSubscription = await response.json()
            const store = getStore()
            const updatedSubscriptions = store.subscriptions.map((subscription) =>
              subscription.id === id ? updatedSubscription : subscription,
            )
            setStore({ subscriptions: updatedSubscriptions })
            return updatedSubscription
          } else {
            console.error("Error updating subscription:", response.status)
          }
        } catch (error) {
          console.error("Error updating subscription:", error)
        }
      },

      deleteSubscription: async (id) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/subscriptions/${id}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })

          if (response.ok) {
            return { success: true }
          } else {
            console.error("Error deleting subscription:", response.status)
            return { success: false, error: `Status: ${response.status}` }
          }
        } catch (error) {
          console.error("Error deleting subscription:", error)
          return { success: false, error: error.message }
        }
      },

      fetchSubscriptions: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/subscriptions`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch subscriptions")
          const data = await resp.json()
          console.log(data)
          setStore({ subscriptions: data })
        } catch (error) {
          console.error("Error fetching subscriptions:", error)
        }
      },

      addSubscription: async (student_name, class_name, start_date) => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "api/subscriptions", {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ student_name, class_name, start_date }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create subscription")
          }

          const data = await response.json()
          return { success: true, data }
        } catch (error) {
          console.error("Subscription Error:", error.message)
          return { success: false, error: error.message }
        }
      },

      //TEACHER
      getTeacherClasses: async () => {
        const store = getStore()
        const token = store.token || localStorage.getItem("token")

        if (!token) {
          console.error("No token found")
          return
        }

        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/teacher/classes`, {
            method: "GET",
            headers: getActions().getAuthHeaders(),
          })

          const data = await response.json()
          console.log("Clases recibidas:", data)

          if (response.ok) {
            setStore({ teacherClasses: data.classes || [] })
          } else {
            console.error("Error al obtener las clases:", data.error)
          }
        } catch (error) {
          console.error("Error en la solicitud de clases:", error)
        }
      },

      setStore: (newStore) => {
        setStore(newStore)
      },

      logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setStore({ token: null, user: null })
      },

      fetchEnrolledClasses: async () => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");

          if (!token) {
            console.error("No token found");
            return;
          }

          const response = await fetch(`${process.env.BACKEND_URL}/api/enrolled-classes`, {
            method: "GET",
            headers: getActions().getAuthHeaders(),
          });

          if (response.ok) {
            const data = await response.json();
            setStore({ enrolledClasses: data });

            // Filtrar clases con pago pendiente
            const unpaidClasses = data.filter((classItem) => classItem.status !== "Pagado");
            setStore({ filteredClasses: unpaidClasses });
          } else {
            console.error("Error fetching enrolled classes:", response.status);
          }
        } catch (error) {
          console.error("Error fetching enrolled classes:", error);
        }
      },

      enrollInClass: async (classId, child_name) => {
        console.log("Enrolling in class:", classId, child_name);
    
        try {
            const store = getStore();
            const token = store.token || localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found");
                return { success: false, error: "No authentication token found" };
            }
    
            const response = await fetch(`${process.env.BACKEND_URL}/api/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    classId: classId,
                    child_name: child_name,
                }),
            });
    
            const responseData = await response.json().catch(() => null); // 👈 Evita error si la respuesta no es JSON
    
            if (!response.ok || !responseData) {
                console.error("Error enrolling in class:", response.status, responseData?.error || "No response data");
                return { success: false, error: responseData?.error || "Unknown error" };
            }
    
            console.log("Enrollment successful:", responseData);
    
            setStore({ enrolledClasses: [...store.enrolledClasses, responseData] });
    
            await getActions().fetchEnrolledClasses();
    
            return { success: true };
    
        } catch (error) {
            console.error("Unexpected error enrolling in class:", error);
            return { success: false, error: "Unexpected error occurred" };
        }
    },
    
    deleteEnrollment: async (enrollmentId) => {
      try {
        const token = localStorage.getItem("token"); // Si necesitas autenticación
    
        const response = await fetch(`${process.env.BACKEND_URL}/api/enrollments/${enrollmentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Solo si es necesario
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error deleting enrollment:", errorData);
          return { success: false, error: errorData.message || "Failed to delete enrollment" };
        }
    
       
        setStore({
          enrolledClasses: getStore().enrolledClasses.filter((enrollment) => enrollment.id !== enrollmentId),
        });
    
        return { success: true };
      } catch (error) {
        console.error("Error in deleteEnrollment action:", error);
        return { success: false, error: "An error occurred while deleting the enrollment" };
      }
    }
,    
    
      // my-classes
      fetchMyClassesParent: async () => {
        try {
          const store = getStore();
          const token = store.token || localStorage.getItem("token");
          if (!token) {
            console.error("No token found");
            return;
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/my-classes`, {
            headers: getActions().getAuthHeaders(),
          });
          if (response.ok) {
            const data = await response.json();
            setStore({ myClasses: data });
          } else {
            console.error("Error fetching my classes:", response.status);
          }
        } catch (error) {
          console.error("Error fetching my classes:", error);
        }
      },
     

      unenrollFromClass: async (classId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/unenroll`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({ classId }),
          })
          if (response.ok) {
            const store = getStore()
            setStore({
              enrolledClasses: store.enrolledClasses.filter((c) => c.id !== classId),
              classes: store.classes.map((c) => (c.id === classId ? { ...c, capacity: c.capacity + 1 } : c)),
            })
            return { success: true }
          } else {
            console.error("Error unenrolling from class:", response.status)
            return { success: false, error: "Failed to unenroll from class" }
          }
        } catch (error) {
          console.error("Error unenrolling from class:", error)
          return { success: false, error: "An unexpected error occurred" }
        }
      },
      resetPassword: async (email) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/reset-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })
          if (!resp.ok) throw new Error("Password reset request failed")

          const data = await resp.json()
          return { success: true, message: data.message }
        } catch (error) {
          console.error("Error in reset password:", error)
          return { success: false, error: error.message }
        }
      },

      getStudentsByTeacher: async () => {
        const store = getStore();
        const token = store.token || localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          return;
        }
        try {
          const url = `${process.env.BACKEND_URL}api/teacher/students`;
          console.log("Request URL:", url);
          
          const response = await fetch(url, {
            method: "GET",
            headers: getActions().getAuthHeaders(), 
          });         
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Error fetching students: " + JSON.stringify(errorData));
          }  
          const data = await response.json();
          console.log("Received students data:", data);
          setStore({ teacherStudents: data.students || [] });
        } catch (error) {
          console.error("Error loading students:", error);
        }
      },
      


      //PAYPAL
      setEnrolledClasses: (enrolledClasses) => {
        setStore({ enrolledClasses });
      },
      updatePaidClasses: (newPaidClass) => {
        setStore((prevState) => {
          const updatedPaidClasses = [...prevState.paidClasses, newPaidClass];
          return { ...prevState, paidClasses: updatedPaidClasses };
        });
      },
      processPayment: async (order) => {
        const store = getStore();
        const user = store.user;

        if (!user) {
          console.error("No hay usuario logueado");
          return;
        }

        const paymentData = {
          user_id: user.id, 
          amount: order.purchase_units[0].amount.value,
          concept: "Pago Mensualidad",
          status: "Completado",
          due_date: new Date().toISOString().split("T")[0],
          paypal_order_id: order.id,
          payer_email: order.payer.email_address,
        };

        try {
          const response = await fetch(`${process.env.BACKEND_URL}api/parent_payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          });

          if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

          const data = await response.json();
          console.log("Pago guardado en backend:", data);

          setStore({ parentPayments: [...store.parentPayments, data.payment] });
        } catch (error) {
          console.error("Error al procesar pago:", error);
        }
      },
      // AdminProfileView
      fetchAdminData: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/admin-profile`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch admin data")
          const data = await resp.json()
      
          setStore({ adminData: data })
        } catch (error) {
          console.error("Error fetching admin data:", error)
        }
      },
      fetchAdminSettings: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/admin-profile`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch admin settings")
          const data = await resp.json()
          console.log(data)
          setStore({ adminSettings: data })
        } catch (error) {
          console.error("Error fetching admin settings:", error)
        }
      },

      updateAdminSettings: async (settings) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/admin-profile`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(settings),
          })
          console.log(resp)
          if (!resp.ok) throw new Error("Failed to update admin settings")
          const data = await resp.json()
          setStore({ adminSettings: data })
        } catch (error) {
          console.error("Error updating admin settings:", error)
        }
      },
      fetchAdminProfile: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/admin-profile`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch admin profile")
          const data = await resp.json()
          setStore({ adminProfile: data })
        } catch (error) {
          console.error("Error fetching admin profile:", error)
        }
      },

      updateAdminProfile: async (profileData) => {
       
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/admin-profile`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(profileData),
          })
          if (!resp.ok) throw new Error("Failed to update admin profile")
          const data = await resp.json()
          console.log(data)
          setStore({ adminProfile: data })
        } catch (error) {
          console.error("Error updating admin profile:", error)
        }
      },

      uploadProfilePhoto: async (file) => {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const resp = await fetch(`${process.env.BACKEND_URL}api/upload-profile-photo`, {
            method: "POST",
            headers: getActions().getAuthHeaders(),
            body: formData,
          })

          if (!resp.ok) throw new Error("Failed to upload profile photo")
          const data = await resp.json()
          return data.url
        } catch (error) {
          console.error("Error uploading profile photo:", error)
        }
      },
      fetchGetintouchMessages: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/getintouch`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch getintouch messages")
          const data = await resp.json()
          setStore({ getintouchMessages: data })
        } catch (error) {
          console.error("Error fetching getintouch messages:", error)
        }
      },

      createGetintouchMessage: async (messageData) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/getintouch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messageData),
          })
          if (!resp.ok) throw new Error("Failed to create getintouch message")
          const newMessage = await resp.json()
          setStore({ getintouchMessages: [...getStore().getintouchMessages, newMessage] })
          return newMessage
        } catch (error) {
          console.error("Error creating getintouch message:", error)
        }
      },

      updateGetintouchMessage: async (messageId, messageData) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/getintouch/${messageId}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify(messageData),
          })
          if (!resp.ok) throw new Error("Failed to update getintouch message")
          const updatedMessage = await resp.json()
          const updatedMessages = getStore().getintouchMessages.map((msg) =>
            msg.id === messageId ? updatedMessage : msg,
          )
          setStore({ getintouchMessages: updatedMessages })
          return updatedMessage
        } catch (error) {
          console.error("Error updating getintouch message:", error)
        }
      },

      deleteGetintouchMessage: async (messageId) => {
      
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/getintouch/${messageId}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })
         
          if (!resp.ok) throw new Error("Failed to delete getintouch message")
          const updatedMessages = getStore().getintouchMessages.filter((msg) => msg.id !== messageId)
          console.log(updatedMessages)
          setStore({ getintouchMessages: updatedMessages })
        } catch (error) {
          console.error("Error deleting getintouch message:", error)
        }
      },
      fetchContacts: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/contacts`, {
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to fetch contacts")
          const data = await resp.json()
          setStore({ contacts: data })
        } catch (error) {
          console.error("Error fetching contacts:", error)
        }
      },

      createContact: async (contactData) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/contacts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contactData),
          })
          if (!resp.ok) throw new Error("Failed to create contact")
          const newContact = await resp.json()
          setStore({ contacts: [...getStore().contacts, newContact] })
          return newContact
        } catch (error) {
          console.error("Error creating contact:", error)
        }
      },

      deleteContact: async (contactId) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/contacts/${contactId}`, {
            method: "DELETE",
            headers: getActions().getAuthHeaders(),
          })
          if (!resp.ok) throw new Error("Failed to delete contact")
          const updatedContacts = getStore().contacts.filter((contact) => contact.id !== contactId)
          setStore({ contacts: updatedContacts })
        } catch (error) {
          console.error("Error deleting contact:", error)
        }
      },
      getAuthHeaders: () => {
        const token = localStorage.getItem("token");
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      },
      updateUser: async (updatedUserData) => {
        try {
          const store = getStore();
          const userId = store.user.id;
  
          if (!store.token) {
            console.error("No token found");
            return { success: false, error: "No token found" };
          }
          const response = await fetch(`${process.env.BACKEND_URL}api/users/${userId}`, {
            method: "PUT",
            headers: getActions().getAuthHeaders(),
            body: JSON.stringify({
              username: updatedUserData.username,
              email: updatedUserData.email,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Update Failed");
          }
          const data = await response.json();
          setStore({
            ...store,
            user: data,  
          });
          localStorage.setItem("user", JSON.stringify(data));
          return { success: true, data };
        } catch (error) {
          console.error("Update Error:", error.message);
          return { success: false, error: error.message };
        }
      },
      getPrivate: async (param) => {
        try {console.log(param)

          const resp = await fetch(`${process.env.BACKEND_URL}/api/${param}`, {
            method: "GET",
            headers: getActions().getAuthHeaders(),
          })

          console.log(resp.status)
					if (resp.status == 422) {
            if(param == 'admini'){
						setStore({ admin: false })
            }
            if(param == 'paren'){
              setStore({ paren: false })
            }
            if(param == 'teache'){
              setStore({ teach: false })
            }
					} else {
						
					}
				} catch (error) {
					console.error('Error fetching private data:', error);
				}
      }

      }
  }
}

export default getState

