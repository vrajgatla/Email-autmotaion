import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");

  const backendUrl = "http://localhost:8080/api/subscribers";

  // Fetch subscribers from backend
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(backendUrl);
      setSubscribers(res.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
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
      await axios.post(backendUrl, form);
      setForm({ name: "", email: "" });
      setStatus("Subscriber added!");
      fetchSubscribers();
    } catch (error) {
      setStatus("Failed to add subscriber");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/${id}`);
      fetchSubscribers();
    } catch (error) {
      setStatus("Failed to delete subscriber");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Subscribers</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {status && <p className="mb-4 font-semibold">{status}</p>}

      <table className="w-full border-collapse border border-gray-300">
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
  );
};

export default SubscribersPage;
