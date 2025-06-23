import React, { useEffect } from "react";

const VariableInputs = ({ variables, setVariables, selectedTemplate }) => {
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

  // Auto-populate variables when template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.variables) {
      const templateVars = selectedTemplate.variables.map(variable => ({
        key: variable,
        value: ""
      }));
      setVariables(templateVars);
    }
  }, [selectedTemplate, setVariables]);

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">
        Template Variables:
        {selectedTemplate && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({selectedTemplate.variables.length} required)
          </span>
        )}
      </label>
      
      {variables.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          Select a template to see available variables
        </div>
      ) : (
        <>
          {variables.map((variable, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Variable name"
                value={variable.key}
                onChange={(e) => handleVariableChange(index, "key", e.target.value)}
                className="border px-2 py-1 rounded w-1/2"
                readOnly={selectedTemplate && selectedTemplate.variables.includes(variable.key)}
              />
              <input
                type="text"
                placeholder="Value"
                value={variable.value}
                onChange={(e) => handleVariableChange(index, "value", e.target.value)}
                className="border px-2 py-1 rounded w-1/2"
              />
              {!selectedTemplate || !selectedTemplate.variables.includes(variable.key) ? (
                <button
                  onClick={() => removeVariableField(index)}
                  className="bg-red-500 text-white rounded px-2 hover:bg-red-600"
                  type="button"
                >
                  &times;
                </button>
              ) : (
                <div className="w-8"></div> // Spacer for alignment
              )}
            </div>
          ))}
          
          {selectedTemplate && (
            <div className="mt-2 text-xs text-gray-600">
              <strong>Template variables:</strong> {selectedTemplate.variables.join(", ")}
            </div>
          )}
          
          {(!selectedTemplate || variables.length < 5) && (
            <button
              onClick={addVariableField}
              type="button"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
            >
              Add Custom Variable
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VariableInputs;
