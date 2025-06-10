// TemplateSelector.jsx

import React from "react";

const TemplateSelector = ({ value, onChange }) => (
  <>
    {/* Dropdown for template selection */}
    <div className="mb-4">
      <label className="block font-semibold mb-1">Choose Template:</label>
      <select
        name="templateName"
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="welcome">Welcome</option>
        <option value="goodmorning">Good Morning</option>
        <option value="thankyou">Thank You</option>
      </select>

    </div>

    {/* Template Preview Section */}
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Email Template Previews</h1>
      <p className="mb-4">Here are the templates available for use.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Template: Welcome (index)</h2>
          <p>
            Hi <b>[[name]]</b>,<br />
            Welcome to our platform! We're thrilled to have you here.
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Template: Good Morning</h2>
          <p>
            Good morning <b>[[name]]</b>,<br />
            Wishing you a productive and positive day ahead!
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Template: Thank You</h2>
          <p>
            Hello <b>[[name]]</b>,<br />
            Thank you for being a valued user. Your support means a lot!
          </p>
        </div>
      </div>
    </div>
  </>
);

export default TemplateSelector;
