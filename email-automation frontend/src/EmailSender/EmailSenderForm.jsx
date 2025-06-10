// EmailSenderForm.jsx
import React, { useState } from "react";

import axios from "axios";
import EmailTypeSelector from "./EmailTypeSelector";
import RecipientInput from "./RecipientInput";
import BodyInput from "./BodyInput";
import VariableInputs from "./VariableInputs";
import SubjectInput from "./SubjectInput";
import AttachmentInput from "./AttachmentInput";
import TemplateSelector from "./TemplateSelector";

const EmailSenderForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    templateName: "template1",
  });
  const [variables, setVariables] = useState([{ key: "", value: "" }]);
  const [attachments, setAttachments] = useState([]);
  const [emailType, setEmailType] = useState("simple");
  const [sendToAll, setSendToAll] = useState(false);
  const [status, setStatus] = useState("");

  const backendUrl = "http://localhost:8080/api/emails";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async () => {
    setStatus("Sending...");
    try {
      const endpointSuffix = sendToAll ? "-to-all" : "";
      if (emailType === "simple") {
        await axios.post(`${backendUrl}/send-simple${endpointSuffix}`, null, {
          params: sendToAll
            ? {
              subject: formData.subject,
              body: formData.body,
            }
            : {
              to: formData.to,
              subject: formData.subject,
              body: formData.body,
            },
        });
      } else if (emailType === "attachment") {
        const form = new FormData();
        form.append("subject", formData.subject);
        form.append("body", formData.body);
        attachments.forEach((file) => form.append("attachments", file));
        if (!sendToAll) form.append("to", formData.to);

        await axios.post(`${backendUrl}/send-attachment${endpointSuffix}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (emailType === "template") {
        const varsObj = {};
        variables.forEach(({ key, value }) => {
          if (key) varsObj[key] = value;
        });

        await axios.post(`${backendUrl}/send-template${endpointSuffix}`, varsObj, {
          params: sendToAll
            ? {
              subject: formData.subject,
              templateName: formData.templateName,
            }
            : {
              to: formData.to,
              subject: formData.subject,
              templateName: formData.templateName,
            },
        });
      }

      setStatus("Email sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error sending email.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Send Email</h1>

      <EmailTypeSelector
        emailType={emailType}
        setEmailType={setEmailType}
        sendToAll={sendToAll}
        setSendToAll={setSendToAll}
      />
      {!sendToAll && (
        <RecipientInput value={formData.to} onChange={handleInputChange} />
      )}
      <SubjectInput value={formData.subject} onChange={handleInputChange} />
      {(emailType === "simple" || emailType === "attachment") && (
        <BodyInput value={formData.body} onChange={handleInputChange} />
      )}

      {emailType === "attachment" && (
        <AttachmentInput onChange={(e) => setAttachments(Array.from(e.target.files))} />
      )}
      {emailType === "template" && (
        <>
          <TemplateSelector value={formData.templateName} onChange={handleInputChange} />
          <VariableInputs
            variables={variables}
            setVariables={setVariables}
          />
        </>
      )}
      <button
        onClick={sendEmail}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Send Email
      </button>
      {status && <p className="mt-4 font-semibold text-green-700">{status}</p>}
    </div>
  );
};

export default EmailSenderForm;
