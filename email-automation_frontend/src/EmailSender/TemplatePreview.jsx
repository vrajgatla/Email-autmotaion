import React, { useState, useEffect } from "react";

const TemplatePreview = ({ template, variables }) => {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (template && variables.length > 0) {
      generatePreview();
    }
  }, [template, variables]);

  const generatePreview = () => {
    if (!template) return;

    // Create a simple preview by replacing variables in the preview text
    let preview = template.preview;
    
    variables.forEach(({ key, value }) => {
      if (key && value) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        preview = preview.replace(regex, value);
      }
    });

    // Replace any remaining [variable] placeholders with sample values
    template.variables.forEach(variable => {
      const regex = new RegExp(`\\[${variable}\\]`, 'g');
      if (!preview.includes(`[${variable}]`)) return;
      
      const sampleValues = {
        name: "John Doe",
        company: "Your Company",
        website: "https://example.com",
        date: "January 15, 2025",
        weather: "Sunny",
        service: "Premium Service",
        feedback: "Excellent",
        highlight1: "New feature launch",
        highlight2: "Customer success stories",
        highlight3: "Upcoming events",
        newsContent: "We've launched exciting new features that will enhance your experience.",
        proTip: "Use our mobile app for better accessibility on the go!",
        unsubscribeLink: "https://example.com/unsubscribe",
        discountPercent: "25",
        offerDescription: "Premium subscription",
        promoCode: "SAVE25",
        feature1: "Unlimited access",
        feature2: "Priority support",
        feature3: "Advanced analytics",
        ctaLink: "https://example.com/offer",
        expiryDate: "January 31, 2025",
        supportEmail: "support@example.com"
      };
      
      preview = preview.replace(regex, sampleValues[variable] || `[${variable}]`);
    });

    setPreviewHtml(preview);
  };

  if (!template) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Template Preview</h3>
      </div>
      
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="mb-3">
          <strong>Subject:</strong> 
          <span className="ml-2 text-gray-600">
            {template.displayName} - {variables.find(v => v.key === "company")?.value || "Your Company"}
          </span>
        </div>
        
        <div className="mb-3">
          <strong>Preview:</strong>
          <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
            {previewHtml}
          </div>
        </div>
        
        <div>
          <strong>Variables Used:</strong>
          <div className="mt-1 flex flex-wrap gap-1">
            {variables.map(({ key, value }) => (
              key && value && (
                <span
                  key={key}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                >
                  {key}: {value}
                </span>
              )
            ))}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <strong>Note:</strong> This is a text preview. The actual email will be sent as HTML with full styling.
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview; 