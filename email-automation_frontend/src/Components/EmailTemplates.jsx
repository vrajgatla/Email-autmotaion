import React, { useState, useEffect } from "react";
import TemplateSelector from "../EmailSender/TemplateSelector";
import { getToken } from "../App";
import axios from "axios";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectorValue, setSelectorValue] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectorValue && templates.length > 0) {
      const template = templates.find(t => t.name === selectorValue);
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectorValue, templates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get('http://localhost:8080/api/emails/templates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Email Templates</h1>
      <p className="mb-4">
        Here are the templates you can use in your emails. Choose a template name in the send email form.
      </p>
      {/* Template Selector with preview */}
      <div className="mb-8">
        <TemplateSelector
          value={selectorValue}
          onChange={e => setSelectorValue(e.target)}
          onTemplateSelect={setSelectedTemplate}
        />
      </div>
      {/* Full Template Gallery */}
      {loading ? (
        <div>Loading templates...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.name} className="border rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">{template.displayName}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="text-sm mb-2">
                <strong>Variables:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-xs"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded border text-xs">
                <strong>Preview:</strong>
                <div>{template.preview}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;

