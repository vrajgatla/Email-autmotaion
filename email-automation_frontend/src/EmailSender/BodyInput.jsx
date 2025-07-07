import React from "react";

const BodyInput = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">Body:</label>
    <textarea
      name="body"
      value={value}
      onChange={onChange}
      rows="6"
      placeholder="Write your message here"
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

export default BodyInput;
