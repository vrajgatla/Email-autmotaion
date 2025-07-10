import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LiveTemplateView = () => {
  const { templateName } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/emails/templates/${templateName}/render`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Template not found or failed to render');
        return res.text();
      })
      .then(setHtml)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [templateName]);

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-4xl mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow mr-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Live Template Preview</h1>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-500">Loading preview...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {!loading && !error && (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow p-6 overflow-auto border border-gray-200">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
};

export default LiveTemplateView; 