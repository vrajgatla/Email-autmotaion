import React, { useState, useEffect } from "react";
import api from '../api';
import { getToken } from "../App";

const TemplateSelector = ({ value, onChange, onTemplateSelect, hideGallery }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (value && templates.length > 0) {
      const template = templates.find(t => t.name === value);
      setSelectedTemplate(template);
      if (onTemplateSelect) {
        onTemplateSelect(template);
      }
    } else {
      setSelectedTemplate(null);
      if (onTemplateSelect) {
        onTemplateSelect(null);
      }
    }
  }, [value, templates, onTemplateSelect]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await api.get('/api/emails/templates', {
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

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    onChange(e);
    
    const template = templates.find(t => t.name === templateName);
    setSelectedTemplate(template);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose Template:</label>
        <div className="w-full border px-3 py-2 rounded bg-gray-100">
          Loading templates...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose Template:</label>
        <div className="w-full border px-3 py-2 rounded bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
  <>
    {/* Dropdown for template selection */}
    <div className="mb-4">
      <label className="block font-semibold mb-1">Choose Template:</label>
      <select
        name="templateName"
        value={value}
          onChange={handleTemplateChange}
        className="w-full border px-3 py-2 rounded"
      >
          <option value="">Select a template...</option>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.displayName}
            </option>
          ))}
      </select>
    </div>

    {/* Template Preview Section */}
      {selectedTemplate && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{selectedTemplate.displayName}</h3>
          <p className="text-gray-600 mb-3">{selectedTemplate.description}</p>
          <div className="mb-3">
            <h4 className="font-medium mb-1">Preview:</h4>
            <div className="bg-white p-3 rounded border text-sm">
              {selectedTemplate.preview}
            </div>
        </div>
          <div>
            <h4 className="font-medium mb-1">Available Variables:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.variables.map((variable) => (
                <span
                  key={variable}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    {/* Template Gallery (hide if hideGallery) */}
    {!hideGallery && (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Available Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {templates.map((template) => (
            <div key={template.name} className="border rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">{template.displayName}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="text-sm">
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
            </div>
          ))}
      </div>
    </div>
    )}
  </>
);
};

export default TemplateSelector;