const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
			,
			user: null,
			message: null,
			uploadedFileUrl: null,
			error: null,
			classes: [],
			programs: [],
		},
		actions: {
			signUp: async (username, email, password) => {
				let role = "user";
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ username, email, password, role }),
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Sign Up Failed");
					}

					const data = await response.json();
					setStore({ user: data });
					return { success: true, data };
				} catch (error) {
					console.error("Sign Up Error:", error.message);
					return { success: false, error: error.message };
				}
			},
			uploadToCloudinary: async (file) => {
				const BACKEND_URL = process.env.BACKEND_URL;
				const store = getStore();

				try {
					const formData = new FormData();
					formData.append("file", file);

					const response = await fetch(`${BACKEND_URL}/api/upload`, {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Failed to upload file");
					}

					const data = await response.json();
					setStore({ uploadedFileUrl: data.url, error: null });

					return { success: true, url: data.url };
				} catch (error) {
					console.error("Upload Error:", error.message);
					setStore({ error: error.message });
					return { success: false, error: error.message };
				}
			},
			fetchClasses: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/classes");
					if (response.ok) {
						const data = await response.json();
						setStore({ classes: data });
					} else {
						console.error("Error fetching classes:", response.status);
					}
				} catch (error) {
					console.error("Error fetching classes:", error);
				}
			},
			login: async (email, password) => {
				try {
					// fetching data from the backend
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
							password: password
						})

					});

					if (!response.ok) {
						const errorData = await response.json();
						if (response.status === 401) {
							alert('Bad email or password');
						} else if (response.status === 400) {
							alert('Email and password are required.');
						} else {
							alert('Unknow error. Please, try again.');
						}
						throw new Error(errorData.message || 'Failed to login');
					}
					const data = await response.json()

					localStorage.setItem("token", data.token)
					localStorage.setItem("user", JSON.stringify(data.user))
					setStore({ user: data.user })

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			newsletter: async (email) => {
				try {
					// fetching data from the backend
					const response = await fetch(process.env.BACKEND_URL + "/api/newsletter", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
						})

					});

					if (response.status === 400 || response.status === 422) {
						alert('The email is not in a valid format. ');
					}
					else if (response.status === 409) {
						alert('This email is already subscribed..');
					}

					const data = await response.json()

					setStore({ user: data.user })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			


			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},



			
			getinTouch: async (name, email, subject, phone_number, message) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/getintouch", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ name, email, subject, phone_number, message }),
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Failed to send message");
					}
			
					const data = await response.json();
					return { success: true, data };
				} catch (error) {
					console.error("Get in touch Error:", error.message);
					return { success: false, error: error.message };
				}
			},
			contactUs: async (first_name,last_name, email, subject, phone_number, message) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/contacts", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ first_name,last_name, email, subject, phone_number, message }),
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Failed to send message");
					}
			
					const data = await response.json();
					return { success: true, data };
				} catch (error) {
					console.error("Contact Us touch Error:", error.message);
					return { success: false, error: error.message };
				}
			},
			
		}
	};
};

export default getState;
