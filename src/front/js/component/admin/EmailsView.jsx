import React, { useState, useEffect, useContext, useRef } from "react";
import emailjs from '@emailjs/browser';
import { Context } from "../../store/appContext";
import { Send, Trash, Edit, Calendar, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Swal from "sweetalert2";

const EmailManagementPage = () => {
  const form = useRef();
  const { store, actions } = useContext(Context);
  const [newEmail, setNewEmail] = useState({ to_name: "", user_email: "", message: "", scheduledDate: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    actions.GetEmails();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    try {
      const emailToSend = { ...newEmail };
      if (!emailToSend.scheduledDate) {
        delete emailToSend.scheduledDate;
      }

      await emailjs.sendForm('service_9mrx7p7', 'template_vrpdmwj', form.current, {
        publicKey: 'DXp2MF0wEeq9kKBK2',
      });

      const response = await actions.sendEmail(emailToSend);
      // console.log("Respuesta de la API:", response);

      setNewEmail({ to_name: "", user_email: "", message: "", scheduledDate: "" });

      Swal.fire({
        icon: 'success',
        title: 'Email sent!',
        text: 'The email has been sent correctly.',
        confirmButtonText: 'Accept'
      });

    } catch (error) {
      console.error('Error sending email or adding to database:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error sending the email or adding it to the database. Please try again.',
        confirmButtonText: 'close'
      });
    }
  };

  const handleInputChange = (e) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };

  const handleDeleteEmail = async (id) => {
    if (window.confirm("¿Are you sure you want to delete this email?")) {
      await actions.deleteEmail(id);
    }
  };

  const filteredEmails = store.emails.filter((email) =>
    email.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredEmails.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Mail Management</h1>
        </header>
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Create New Email</h2>

            <form ref={form} onSubmit={handleSendEmail} className="tw-space-y-4">
              <div>
                <label className="tw-block tw-mb-2">Name</label>
                <input
                  type="text"
                  name="to_name"
                  value={newEmail.to_name}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div>
                <label className="tw-block tw-mb-2">Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={newEmail.user_email}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div>
                <label className="tw-block tw-mb-2">Message</label>
                <textarea
                  name="message"
                  value={newEmail.message}
                  onChange={handleInputChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center"
              >
                <Send className="tw-w-5 tw-h-5 tw-mr-2" />
                {newEmail.scheduledDate ? "Schedule Email" : "Send Email"}
              </button>
            </form>
          </div>

          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Emails Sent</h2>
            <div className="tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-4">
              <div className="tw-relative tw-w-full md:tw-w-auto">
                <input
                  type="text"
                  placeholder="Search email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw-pl-10 tw-pr-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-w-full"
                />
                <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" size={20} />
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="tw-p-2 tw-rounded-md tw-bg-gray-100 tw-text-gray-600 disabled:tw-opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="tw-text-sm tw-text-gray-600">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="tw-p-2 tw-rounded-md tw-bg-gray-100 tw-text-gray-600 disabled:tw-opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="tw-space-y-4">
              {currentEmails.map((email) => (
                <div key={email.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
                  <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-mb-2 tw-gap-4">
                    <div className="tw-text-center md:tw-text-left">
                      <span className="tw-font-bold">Email</span>
                      <p className="tw-text-sm tw-text-gray-500">{email.user_email}</p>
                    </div>
                    <div className="tw-text-center md:tw-text-left">
                      <span className="tw-font-bold">Name</span>
                      <p className="tw-text-sm tw-text-gray-500">{email.to_name}</p>
                    </div>
                    <div className="tw-text-center md:tw-text-left">
                      <span className="tw-font-bold">Message</span>
                      <p className="tw-text-sm tw-text-gray-500">{email.message}</p>
                    </div>
                    <div className="tw-text-center md:tw-text-left">
                      <span className="tw-font-bold">Date</span>
                      <p className="tw-text-sm tw-text-gray-500">{new Date(email.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                    <button
                      className="tw-text-blue-600 hover:tw-text-blue-800 tw-flex tw-items-center"
                      onClick={() => setSelectedEmail(email)}
                    >
                      <Eye className="tw-w-5 tw-h-5 tw-mr-1" />
                      See complete
                    </button>
                    <button
                      className="tw-text-red-600 hover:tw-text-red-800"
                      onClick={() => handleDeleteEmail(email.id)}
                    >
                      <Trash className="tw-w-5 tw-h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {selectedEmail && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full"
          id="my-modal"
        >
          <div className="tw-relative tw-top-20 tw-mx-auto tw-p-5 tw-border tw-w-full md:tw-w-96 tw-shadow-lg tw-rounded-md tw-bg-white">
            <div className="tw-mt-3 tw-text-center">
              <h3 className="tw-text-lg tw-leading-6 tw-font-medium tw-text-gray-900">{selectedEmail.subject}</h3>
              <div className="tw-mt-2 tw-px-7 tw-py-3">
                <p className="tw-text-sm tw-text-gray-500">
                  <strong>For:</strong> {selectedEmail.to}
                </p>
                <p className="tw-text-sm tw-text-gray-500">
                  <strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}
                </p>
                <p className="tw-text-sm tw-text-gray-700 tw-mt-4">{selectedEmail.content}</p>
              </div>
              <div className="tw-items-center tw-px-4 tw-py-3">
                <button
                  id="ok-btn"
                  className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-text-base tw-font-medium tw-rounded-md tw-w-full tw-shadow-sm hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-300"
                  onClick={() => setSelectedEmail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailManagementPage;