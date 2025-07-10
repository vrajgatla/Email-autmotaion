import React from "react";

const LiveHtmlPreviewModal = ({ open, onClose, html, loading, error }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold">Live Template Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold px-2"
            aria-label="Close preview"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-gray-500">Loading preview...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
          )}
          {!loading && !error && html && (
            <div className="w-full bg-white rounded-xl shadow p-2 border border-gray-200 min-h-[300px]" style={{ minHeight: 300 }}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveHtmlPreviewModal; 