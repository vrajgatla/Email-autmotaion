import React from "react";

const SubjectInput = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">Subject:</label>
    <input
      type="text"
      name="subject"
      value={value}
      onChange={onChange}
      placeholder="Email subject"
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

export default SubjectInput;
