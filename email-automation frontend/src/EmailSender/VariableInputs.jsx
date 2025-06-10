import React from "react";

const VariableInputs = ({ variables, setVariables }) => {
  const handleVariableChange = (index, field, value) => {
    const newVars = [...variables];
    newVars[index][field] = value;
    setVariables(newVars);
  };

  const addVariableField = () => {
    setVariables([...variables, { key: "", value: "" }]);
  };

  const removeVariableField = (index) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">Variables:</label>
      {variables.map((variable, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Key"
            value={variable.key}
            onChange={(e) => handleVariableChange(index, "key", e.target.value)}
            className="border px-2 py-1 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Value"
            value={variable.value}
            onChange={(e) => handleVariableChange(index, "value", e.target.value)}
            className="border px-2 py-1 rounded w-1/2"
          />
          <button
            onClick={() => removeVariableField(index)}
            className="bg-red-500 text-white rounded px-2"
            type="button"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={addVariableField}
        type="button"
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Add Variable
      </button>
    </div>
  );
};

export default VariableInputs;
