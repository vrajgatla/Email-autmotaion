import React from "react";

const AttachmentInput = ({ onChange }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">Attachments:</label>
    <input type="file" multiple onChange={onChange} className="w-full" />
  </div>
);

export default AttachmentInput;
