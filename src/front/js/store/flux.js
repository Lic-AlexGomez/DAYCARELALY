const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		message: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		user: null,
		message: null,
		uploadedFileUrl: null,
		error: null,
		classes: [],
		programs: [],
		// admin dashboard store
		clients: [],
		schedules: [],
		emails: [],
		scheduledEmails: [],
		videos: [],
		inactiveAccounts: [],
	  },
	  actions: {
		signUp: async (userData) => {
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify(userData),
			})
  
			if (!response.ok) {
			  const errorData = await response.json()
			  throw new Error(errorData.error || "Sign Up Failed")
			}
  
			const data = await response.json()
			setStore({ user: data })
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
  
			const response = await fetch(`${BACKEND_URL}/api/upload`, {
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
			const response = await fetch(process.env.BACKEND_URL + "/api/classes")
			if (response.ok) {
			  const data = await response.json()
			  setStore({ classes: data })
			} else {
			  console.error("Error fetching classes:", response.status)
			}
		  } catch (error) {
			console.error("Error fetching classes:", error)
		  }
		},
		login: async (email, password) => {
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/login", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				email: email,
				password: password,
			  }),
			})
  
			if (!response.ok) {
			  const errorData = await response.json()
			  if (response.status === 401) {
				alert("Bad email or password")
			  } else if (response.status === 400) {
				alert("Email and password are required.")
			  } else {
				alert("Unknown error. Please try again.")
			  }
			  throw new Error(errorData.message || "Failed to login")
			}
			const data = await response.json()
  
			localStorage.setItem("token", data.token)
			localStorage.setItem("user", JSON.stringify(data.user))
			setStore({ user: data.user })
  
			return data
		  } catch (error) {
			console.log("Error loading message from backend", error)
		  }
		},
		newsletter: async (email) => {
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/newsletter", {
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
  
		getinTouch: async (name, email, subject, phone_number, message) => {
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/getintouch", {
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
			const response = await fetch(process.env.BACKEND_URL + "/api/contacts", {
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
			const response = await fetch(process.env.BACKEND_URL + "/api/programs")
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
			const response = await fetch(process.env.BACKEND_URL + "/api/clients")
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
			const response = await fetch(process.env.BACKEND_URL + "/api/clients", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/clients/${id}`, {
			  method: "PUT",
			  headers: {
				"Content-Type": "application/json",
			  },
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/clients/${id}`, {
			  method: "DELETE",
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
			const response = await fetch(process.env.BACKEND_URL + "/api/schedules")
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
			const response = await fetch(process.env.BACKEND_URL + "/api/schedules", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/schedules/${id}`, {
			  method: "PUT",
			  headers: {
				"Content-Type": "application/json",
			  },
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/schedules/${id}`, {
			  method: "DELETE",
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
			const response = await fetch(process.env.BACKEND_URL + "/api/emails")
			if (response.ok) {
			  const data = await response.json()
			  console.log(data)
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
		  console.log(emailData)
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/emails", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/emails/${id}`, {
			  method: "DELETE",
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
			const response = await fetch(process.env.BACKEND_URL + "/api/videos")
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
			const response = await fetch(process.env.BACKEND_URL + "/api/videos", {
			  method: "POST",
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
			const response = await fetch(`${process.env.BACKEND_URL}/api/videos/${id}`, {
			  method: "DELETE",
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
			formEvent: async (full_name, events_selection, parent_name,special_request) => {
			try {
			  const response = await fetch(process.env.BACKEND_URL + "/api/eventsuscription", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({ full_name,events_selection, parent_name, special_request }),
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
			  const response = await fetch(process.env.BACKEND_URL + "/api/inactive-accounts")
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
			  const response = await fetch(`${process.env.BACKEND_URL}/api/inactive-accounts/${id}/reactivate`, {
				method: "POST",
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
			  const response = await fetch(`${process.env.BACKEND_URL}/api/inactive-accounts/${id}/send-reminder`, {
				method: "POST",
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
			  const response = await fetch(`${process.env.BACKEND_URL}/api/inactive-accounts/${id}`, {
				method: "DELETE",
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
	  },
	}
  }
  
  export default getState
  
  