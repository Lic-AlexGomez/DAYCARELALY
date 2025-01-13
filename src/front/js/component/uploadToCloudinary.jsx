import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const FileUploader = () => {
    const { actions, store } = useContext(Context);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const result = await actions.uploadToCloudinary(file);
        if (result.success) {
            alert("File uploaded successfully! URL: " + result.url);
        } else {
            alert("Error uploading file: " + result.error);
        }
    };

    return (
        <div>
            <h1>Upload a File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {store.uploadedFileUrl && (
                <div>
                    <h3>Uploaded File URL:</h3>
                    <a href={store.uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                        {store.uploadedFileUrl}
                    </a>
                </div>
            )}
            {store.error && <p style={{ color: "red" }}>Error: {store.error}</p>}
        </div>
    );
};
