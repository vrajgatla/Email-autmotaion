import React, { useEffect, useState } from "react";
import api from '../api';
import BackButton from './Common/BackButton';

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const username = localStorage.getItem("username");
  const [csvFile, setCsvFile] = useState(null);
  const [csvStatus, setCsvStatus] = useState("");
  const [error, setError] = useState("");

  // Fetch subscribers from backend
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get(`/api/subscribers`, { params: { username } });
      setSubscribers(res.data);
    } catch (error) {
      setError("Failed to fetch subscribers.");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setStatus("Name and email are required");
      return;
    }
    try {
      await api.post(`/api/subscribers/add`, form, { params: { username } });
      setForm({ name: "", email: "" });
      setStatus("Subscriber added!");
      setError("");
      fetchSubscribers();
    } catch (error) {
      let errorMessage = "Failed to add subscriber";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      setStatus(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/subscribers/${id}`, { params: { username } });
      setStatus("");
      fetchSubscribers();
    } catch (error) {
      let errorMessage = "Failed to delete subscriber";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      setStatus(errorMessage);
    }
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvStatus("");
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvStatus("Please select a CSV file.");
      return;
    }
    setCsvStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      const res = await api.post(`/api/subscribers/import-csv`, formData, { 
        headers: { "Content-Type": "multipart/form-data" },
        params: { username }
      });
      setCsvStatus(res.data);
      setCsvFile(null);
      fetchSubscribers();
    } catch (error) {
      let errorMessage = "Failed to import subscribers. Please check your CSV file.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      setCsvStatus(errorMessage);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL subscribers? This action cannot be undone.")) {
      return;
    }
    
    try {
      await api.delete(`/api/subscribers/delete-all`, { params: { username } });
      setStatus("All subscribers deleted successfully!");
      setError("");
      fetchSubscribers();
    } catch (error) {
      let errorMessage = "Failed to delete all subscribers";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      setStatus(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <div className="mb-4"><BackButton /></div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Subscribers</h1>

      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Add Subscriber
        </button>
      </form>

      <div className="mb-4 sm:mb-6">
        <label className="block font-semibold mb-1 sm:mb-2">Import Subscribers from CSV:</label>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={handleCsvUpload}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Upload CSV
          </button>
        </div>
      </div>

      {csvStatus && <p className="mt-2 text-sm font-semibold">{csvStatus}</p>}
      {status && <p className="mb-2 sm:mb-4 font-semibold">{status}</p>}

      {subscribers.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleDeleteAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete All Subscribers ({subscribers.length})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse border border-gray-300 text-xs sm:text-sm">
          <thead>
            <tr className="bg-orange-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="border border-gray-300 px-4 py-2">{sub.name}</td>
                <td className="border border-gray-300 px-4 py-2">{sub.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscribersPage;
