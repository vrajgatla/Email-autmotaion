import React from "react";

const RecipientInput = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">To:</label>
    <input
      type="email"
      name="to"
      value={value}
      onChange={onChange}
      placeholder="recipient@example.com"
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

export default RecipientInput;
