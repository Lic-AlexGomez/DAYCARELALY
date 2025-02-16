import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

const ParentMessages = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.GetEmails();
    }, []);

    
    const user = JSON.parse(localStorage.getItem("user"));  
    const userEmail = user?.email; 
    // console.log(store.emails)
    const filteredMessages = store.emails?.filter((message) => message.user_email === userEmail) || [];

    return (
        <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md tw-max-w-4xl tw-mx-auto">
            <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-4">Parent Messages</h2>
            <ul className="tw-space-y-4">
                {filteredMessages.map((message, index) => (
                    <li key={index} className="tw-bg-gray-100 tw-p-4 tw-rounded-lg tw-shadow-sm">
                        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700">{message.message}</h3>
                        <p className="tw-text-gray-600">{message.content}</p>
                        <span className="tw-text-gray-500 tw-text-sm">{message.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParentMessages;
