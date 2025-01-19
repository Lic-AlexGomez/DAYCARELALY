import React, { useState } from 'react';
import { Send, Trash } from 'lucide-react';

const EmailsView = () => {
  const [emails, setEmails] = useState([
    { id: 1, to: 'padres@example.com', subject: 'Recordatorio: Evento de fin de curso', content: 'Estimados padres...', date: '2023-05-25' },
    { id: 2, to: 'profesores@example.com', subject: 'Reunión de personal', content: 'Querido equipo...', date: '2023-05-26' },
  ]);

  const [newEmail, setNewEmail] = useState({ to: '', subject: '', content: '' });

  const handleInputChange = (e) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmails([...emails, { id: emails.length + 1, ...newEmail, date: new Date().toISOString().split('T')[0] }]);
    setNewEmail({ to: '', subject: '', content: '' });
  };

  const handleDeleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Correos</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleSendEmail} className="tw-space-y-4">
          <input
            type="email"
            name="to"
            value={newEmail.to}
            onChange={handleInputChange}
            placeholder="Para"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="subject"
            value={newEmail.subject}
            onChange={handleInputChange}
            placeholder="Asunto"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <textarea
            name="content"
            value={newEmail.content}
            onChange={handleInputChange}
            placeholder="Contenido del correo"
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-h-32"
            required
          ></textarea>
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Send className="tw-w-5 tw-h-5 tw-mr-2" />
            Enviar Correo
          </button>
        </form>
      </div>
      <div className="tw-space-y-4">
        {emails.map((email) => (
          <div key={email.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <span className="tw-font-semibold">{email.to}</span>
              <span className="tw-text-sm tw-text-gray-500">{email.date}</span>
            </div>
            <h3 className="tw-text-lg tw-font-medium tw-mb-2">{email.subject}</h3>
            <p className="tw-text-gray-600 tw-mb-4">{email.content}</p>
            <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteEmail(email.id)}>
              <Trash className="tw-w-5 tw-h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailsView;

