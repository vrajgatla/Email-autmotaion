import React from "react";

const EmailTypeSelector = ({ emailType, setEmailType, sendToAll, setSendToAll }) => (
  <div className="mb-4 flex items-center gap-4">
    <label className="font-semibold">Email Type:</label>
    <select
      value={emailType}
      onChange={(e) => setEmailType(e.target.value)}
      className="border rounded px-3 py-1"
    >
      <option value="simple">Simple</option>
      <option value="attachment">With Attachment</option>
      <option value="template">Template</option>
    </select>

    <label className="ml-6 flex items-center space-x-2">
      <input
        type="checkbox"
        checked={sendToAll}
        onChange={() => setSendToAll(!sendToAll)}
      />
      <span className="text-sm font-medium">Send to All</span>
    </label>
  </div>
);

export default EmailTypeSelector;
