import React, { useEffect } from "react";

const VariableInputs = ({ variables, setVariables, selectedTemplate, profileData, subscriberData, isBulk, receiverVariableNames }) => {
  const handleVariableChange = (index, field, value) => {
    const newVars = [...variables];
    newVars[index][field] = value;
    setVariables(newVars);
  };

  // Auto-populate variables when template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.variables) {
      const templateVars = selectedTemplate.variables.map((variable) => {
        let existing = variables.find((v) => v.key === variable);
        let value = existing ? existing.value : "";
        let isAutoPopulated = false;
        let isReceiverField = false;
        if (receiverVariableNames && receiverVariableNames.includes(variable)) {
          isReceiverField = true;
        }
        if (selectedTemplate && selectedTemplate.autoPopulatedVariables) {
          const autoPopulatedVars = selectedTemplate.autoPopulatedVariables;
          if (autoPopulatedVars[variable]) {
            const source = autoPopulatedVars[variable];
            if (!isReceiverField && (!value || value === "")) {
              if (source === "user.fullName" && profileData?.personal?.fullName) {
                value = profileData.personal.fullName;
                isAutoPopulated = true;
              } else if (source === "user.email" && profileData?.email) {
                value = profileData.email;
                isAutoPopulated = true;
              } else if (source === "user.phone" && profileData?.phone) {
                value = profileData.phone;
                isAutoPopulated = true;
              }
            }
            if (isReceiverField && isBulk) {
              if (variable.toLowerCase().includes("name")) {
                value = "Will use each subscriber's name";
              } else if (variable.toLowerCase().includes("email")) {
                value = "Will use each subscriber's email";
              } else {
                value = "Auto-filled per recipient";
              }
            } else if (isReceiverField && !isBulk && (!value || value === "")) {
              if (source === "subscriber.name" && subscriberData?.name) {
                value = subscriberData.name;
                isAutoPopulated = true;
              } else if (source === "subscriber.email" && subscriberData?.email) {
                value = subscriberData.email;
                isAutoPopulated = true;
              }
            }
          }
        }
        return { key: variable, value, isAutoPopulated, isReceiverField };
      });

      // Only update if different
      const isDifferent =
        variables.length !== templateVars.length ||
        variables.some(
          (v, i) =>
            v.key !== templateVars[i].key ||
            v.value !== templateVars[i].value ||
            v.isAutoPopulated !== templateVars[i].isAutoPopulated ||
            v.isReceiverField !== templateVars[i].isReceiverField
        );

      if (isDifferent) {
        setVariables(templateVars);
      }
    }
    // eslint-disable-next-line
  }, [selectedTemplate, profileData, subscriberData, receiverVariableNames, isBulk]);

  // Reset sender fields to profile data
  const handleResetToProfile = () => {
    if (!selectedTemplate || !selectedTemplate.variables) return;
    const newVars = variables.map(variable => {
      if (variable.isReceiverField) return variable; // Don't touch receiver fields
      let value = variable.value;
      if (selectedTemplate.autoPopulatedVariables && selectedTemplate.autoPopulatedVariables[variable.key]) {
        const source = selectedTemplate.autoPopulatedVariables[variable.key];
        if (source === "user.fullName" && profileData?.personal?.fullName) {
          value = profileData.personal.fullName;
        } else if (source === "user.email" && profileData?.email) {
          value = profileData.email;
        } else if (source === "user.phone" && profileData?.phone) {
          value = profileData.phone;
        }
      }
      return { ...variable, value };
    });
    setVariables(newVars);
  };

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
      <div className="mb-2">
        <button
          type="button"
          className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-300"
          onClick={handleResetToProfile}
        >
          Reset Sender Fields to Profile
        </button>
      </div>
      {variables.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          Select a template to see available variables
        </div>
      ) : (
        <>
          {variables.map((variable, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Variable name"
                value={variable.key}
                onChange={(e) => handleVariableChange(index, "key", e.target.value)}
                className={`border px-2 py-1 rounded w-1/2 ${variable.isReceiverField && isBulk ? 'bg-blue-50 border-blue-300' : variable.isAutoPopulated ? 'bg-green-50 border-green-300' : ''}`}
                readOnly={selectedTemplate && selectedTemplate.variables.includes(variable.key)}
              />
              <input
                type="text"
                placeholder="Value"
                value={variable.value}
                onChange={(e) => handleVariableChange(index, "value", e.target.value)}
                className={`border px-2 py-1 rounded w-1/2 ${variable.isReceiverField && isBulk ? 'bg-blue-50 border-blue-300' : variable.isAutoPopulated ? 'bg-green-50 border-green-300' : ''}`}
                readOnly={variable.isReceiverField && isBulk}
              />
              {variable.isReceiverField && isBulk && (
                <span className="text-blue-600 text-xs flex items-center px-2 font-semibold">
                  Auto-filled per recipient
                </span>
              )}
              {!variable.isReceiverField && variable.isAutoPopulated && (
                <span className="text-green-600 text-xs flex items-center px-2">
                  Auto
                </span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default VariableInputs;
