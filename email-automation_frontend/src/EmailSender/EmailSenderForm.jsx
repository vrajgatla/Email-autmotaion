// EmailSenderForm.jsx
import React, { useState, useEffect } from "react";

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
import BackButton from '../Components/Common/BackButton';
import LiveHtmlPreviewModal from "./LiveHtmlPreviewSidebar";

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
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [livePreviewHtml, setLivePreviewHtml] = useState("");
  const [livePreviewLoading, setLivePreviewLoading] = useState(false);
  const [livePreviewError, setLivePreviewError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    api.get('/api/auth/profile')
      .then(res => setProfileData(res.data))
      .catch(() => setProfileData(null));
  }, []);

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

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setBulkSummary(null);
    try {
      const token = getToken();
      const endpointSuffix = sendToAll ? "-to-all" : "";
      const headers = getAuthHeaders();
      let response;
      if (sendToAll) {
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
            form.append("variables", JSON.stringify(Object.fromEntries(variables.filter(v => v.key).map(v => [v.key, v.value]))));
            responseConfig = { headers: { ...headers, "Content-Type": "multipart/form-data" } };
            response = await api.post('/api/emails/send-template-to-all', form, responseConfig);
          } else {
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
      setBulkSummary(null);
    } catch (error) {
      let errorMsg = "Error sending email. Please try again.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      setStatus(errorMsg);
      setBulkSummary(null);
    }
  };

  const handleShowLivePreview = async () => {
    if (!formData.templateName) return;
    setLivePreviewLoading(true);
    setLivePreviewError(null);
    setShowLivePreview(true);
    try {
      const token = getToken();
      const res = await api.get(`/api/emails/templates/${formData.templateName}/render`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLivePreviewHtml(res.data);
    } catch (err) {
      setLivePreviewError("Failed to load live preview");
      setLivePreviewHtml("");
    } finally {
      setLivePreviewLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="mb-4"><BackButton /></div>
      <form onSubmit={sendEmail} className="space-y-3 sm:space-y-4 max-w-2xl mx-auto p-3 sm:p-6 bg-white rounded shadow">
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

        {(emailType === "attachment" || emailType === "template") && (
          <AttachmentInput onChange={(e) => setAttachments(Array.from(e.target.files))} />
        )}
        {emailType === "template" && (
          <>
            <TemplateSelector
              value={formData.templateName}
              onChange={handleTemplateChange}
              onTemplateSelect={setSelectedTemplate}
              hideGallery={true}
            />
            {/* Compute receiverVariableNames for VariableInputs */}
            {(() => {
              const receiverVariableNames = selectedTemplate && selectedTemplate.autoPopulatedVariables
                ? Object.entries(selectedTemplate.autoPopulatedVariables)
                    .filter(([_, source]) => source === "subscriber.name" || source === "subscriber.email")
                    .map(([key]) => key)
                : [];
              return (
                <VariableInputs
                  variables={variables}
                  setVariables={setVariables}
                  selectedTemplate={selectedTemplate}
                  profileData={profileData}
                  isBulk={sendToAll}
                  receiverVariableNames={receiverVariableNames}
                />
              );
            })()}
            <div className="mb-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleShowLivePreview}
                disabled={!formData.templateName}
              >
                Show Live Preview
              </button>
            </div>
            <TemplatePreview
              template={selectedTemplate}
              variables={variables}
            />
            <LiveHtmlPreviewModal
              open={showLivePreview}
              onClose={() => setShowLivePreview(false)}
              html={livePreviewHtml}
              loading={livePreviewLoading}
              error={livePreviewError}
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
    </div>
  );
};

export default EmailSenderForm;
