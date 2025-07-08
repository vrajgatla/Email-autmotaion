// EmailSenderForm.jsx
import React, { useState } from "react";

import api from '../api';
import EmailTypeSelector from "./EmailTypeSelector";
import RecipientInput from "./RecipientInput";
import BodyInput from "./BodyInput";
import VariableInputs from "./VariableInputs";
import SubjectInput from "./SubjectInput";
import AttachmentInput from "./AttachmentInput";
import TemplateSelector from "./TemplateSelector";
import TemplatePreview from "./TemplatePreview";
import { getToken } from "../App";

const EmailSenderForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    templateName: "",
  });
  const [variables, setVariables] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [emailType, setEmailType] = useState("simple");
  const [sendToAll, setSendToAll] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bulkSummary, setBulkSummary] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (e) => {
    handleInputChange(e);
    // The TemplateSelector will handle setting selectedTemplate
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const sendEmail = async () => {
    setStatus("Sending...");
    setBulkSummary(null);
    try {
      const token = getToken();
      // console.log("Token from localStorage:", token);
      // console.log("Auth headers:", getAuthHeaders());
      
      const endpointSuffix = sendToAll ? "-to-all" : "";
      const headers = getAuthHeaders();
      
      if (sendToAll) {
        let response;
        if (emailType === "simple") {
          response = await api.post('/api/emails/send-simple-to-all', null, {
            params: { subject: formData.subject, body: formData.body },
            headers,
          });
        } else if (emailType === "attachment") {
          const form = new FormData();
          form.append("subject", formData.subject);
          form.append("body", formData.body);
          attachments.forEach((file) => form.append("attachments", file));
          response = await api.post('/api/emails/send-attachment-to-all', form, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        } else if (emailType === "template") {
          let responseConfig;
          let form;
          if (attachments.length > 0) {
            form = new FormData();
            form.append("subject", formData.subject);
            form.append("templateName", formData.templateName);
            attachments.forEach((file) => form.append("attachments", file));
            // Add variables as JSON string
            form.append("variables", JSON.stringify(Object.fromEntries(variables.filter(v => v.key).map(v => [v.key, v.value]))));
            responseConfig = { headers: { ...headers, "Content-Type": "multipart/form-data" } };
            response = await api.post('/api/emails/send-template-to-all', form, responseConfig);
          } else {
            // No attachments, send as JSON
            const varsObj = {};
            variables.forEach(({ key, value }) => { if (key) varsObj[key] = value; });
            response = await api.post('/api/emails/send-template-to-all', varsObj, {
              params: { subject: formData.subject, templateName: formData.templateName },
              headers,
            });
          }
        }
        if (response && response.data && typeof response.data === 'object') {
          setBulkSummary(response.data);
          setStatus("Bulk email send complete.");
        } else {
          setStatus("Bulk email send complete, but no summary returned.");
        }
        return;
      }

      if (emailType === "simple") {
        await api.post(`/api/emails/send-simple${endpointSuffix}`, null, {
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
          headers,
        });
      } else if (emailType === "attachment") {
        const form = new FormData();
        form.append("subject", formData.subject);
        form.append("body", formData.body);
        attachments.forEach((file) => form.append("attachments", file));
        if (!sendToAll) form.append("to", formData.to);

        await api.post(`/api/emails/send-attachment${endpointSuffix}`, form, {
          headers: { 
            ...headers,
            "Content-Type": "multipart/form-data" 
          },
        });
      } else if (emailType === "template") {
        {emailType === "template" && (
          <>
            <TemplateSelector 
              value={formData.templateName} 
              onChange={handleTemplateChange}
              onTemplateSelect={setSelectedTemplate}
            />
            <VariableInputs
              variables={variables}
              setVariables={setVariables}
              selectedTemplate={selectedTemplate}
            />
            <TemplatePreview
              template={selectedTemplate}
              variables={variables}
            />
          </>
        )}
  
        const varsObj = {};
        variables.forEach(({ key, value }) => {
          if (key) varsObj[key] = value;
        });

        await api.post(`/api/emails/send-template${endpointSuffix}`, varsObj, {
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
          headers,
        });
      }

      setStatus("Email sent successfully!");
    } catch (error) {
      // console.error("Error sending email:", error);
      // console.error("Error response:", error.response);
      // console.error("Error status:", error.response?.status);
      // console.error("Error data:", error.response?.data);
      setStatus("Error sending email: " + (error.response?.data || error.message));
      setBulkSummary(null);
    }
  };

  return (
    <form onSubmit={sendEmail} className="space-y-3 sm:space-y-4 max-w-2xl mx-auto p-3 sm:p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Send Email</h1>

      <EmailTypeSelector
        emailType={emailType}
        setEmailType={setEmailType}
        sendToAll={sendToAll}
        setSendToAll={setSendToAll}z
      />
      {!sendToAll && (
        <RecipientInput value={formData.to} onChange={handleInputChange} />
      )}
      <SubjectInput value={formData.subject} onChange={handleInputChange} />
      {(emailType === "simple" || emailType === "attachment") && (
        <BodyInput value={formData.body} onChange={handleInputChange} />
      )}

      {(emailType === "attachment" || emailType === "template") && (
        <AttachmentInput onChange={(e) => setAttachments(Array.from(e.target.files))} />
      )}
      {emailType === "template" && (
        <>
          <TemplateSelector 
            value={formData.templateName} 
            onChange={handleTemplateChange}
            onTemplateSelect={setSelectedTemplate}
          />
          <VariableInputs
            variables={variables}
            setVariables={setVariables}
            selectedTemplate={selectedTemplate}
          />
          <TemplatePreview
            template={selectedTemplate}
            variables={variables}
          />
        </>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Send Email
      </button>
      {status && (
        <p className={`mt-4 font-semibold ${status.includes('Error') ? 'text-red-700' : 'text-green-700'}`}>
          {status}
        </p>
      )}
      {bulkSummary && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h2 className="text-lg font-bold mb-2">Bulk Send Summary</h2>
          <div>Total: {bulkSummary.total}</div>
          <div>Success: <span className="text-green-700 font-semibold">{bulkSummary.success}</span></div>
          <div>Failed: <span className="text-red-700 font-semibold">{bulkSummary.failed}</span></div>
          <div>Time Taken: <span className="font-mono">{(bulkSummary.timeMs / 1000).toFixed(2)}s</span></div>
          {bulkSummary.failed > 0 && (
            <div className="mt-2">
              <div className="font-semibold">Failed Emails:</div>
              <ul className="list-disc ml-6 text-sm text-red-700">
                {bulkSummary.failedEmails.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default EmailSenderForm;
