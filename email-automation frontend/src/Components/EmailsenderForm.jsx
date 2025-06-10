// import React, { useState } from "react";
// import axios from "axios";

// const EmailSenderForm = () => {
//   const [formData, setFormData] = useState({
//     to: "",
//     subject: "",
//     body: "",
//     templateName: "template1", // Should match template1.html
//   });
//   const [variables, setVariables] = useState([{ key: "", value: "" }]);
//   const [attachments, setAttachments] = useState([]);
//   const [emailType, setEmailType] = useState("simple");
//   const [sendToAll, setSendToAll] = useState(false);
//   const [status, setStatus] = useState("");

//   const backendUrl = "http://localhost:8080/api/emails";

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setAttachments(Array.from(e.target.files));
//   };

//   const handleVariableChange = (index, field, value) => {
//     const newVars = [...variables];
//     newVars[index][field] = value;
//     setVariables(newVars);
//   };

//   const addVariableField = () => {
//     setVariables([...variables, { key: "", value: "" }]);
//   };

//   const removeVariableField = (index) => {
//     setVariables(variables.filter((_, i) => i !== index));
//   };

//   const sendEmail = async () => {
//     setStatus("Sending...");
//     try {
//       const endpointSuffix = sendToAll ? "-to-all" : "";

//       if (emailType === "simple") {
//         await axios.post(`${backendUrl}/send-simple${endpointSuffix}`, null, {
//           params: sendToAll
//             ? { subject: formData.subject, body: formData.body }
//             : { to: formData.to, subject: formData.subject, body: formData.body },
//         });
//       } else if (emailType === "attachment") {
//         const form = new FormData();
//         form.append("subject", formData.subject);
//         form.append("body", formData.body);
//         attachments.forEach((file) => form.append("attachments", file));
//         if (!sendToAll) form.append("to", formData.to);

//         await axios.post(`${backendUrl}/send-attachment${endpointSuffix}`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else if (emailType === "template") {
//         const varsObj = {};
//         variables.forEach(({ key, value }) => {
//           if (key) varsObj[key] = value;
//         });

//         await axios.post(
//           `${backendUrl}/send-template${endpointSuffix}`,
//           varsObj,
//           {
//             params: sendToAll
//               ? {
//                   subject: formData.subject,
//                   templateName: formData.templateName,
//                 }
//               : {
//                   to: formData.to,
//                   subject: formData.subject,
//                   templateName: formData.templateName,
//                 },
//           }
//         );
//       }

//       setStatus("✅ Email sent successfully!");
//     } catch (error) {
//       console.error(error);
//       setStatus("❌ Error sending email.");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//       <h1 className="text-3xl font-bold mb-6">Send Email</h1>

//       <div className="mb-4 flex items-center gap-4">
//         <label className="font-semibold">Email Type:</label>
//         <select
//           value={emailType}
//           onChange={(e) => setEmailType(e.target.value)}
//           className="border rounded px-3 py-1"
//         >
//           <option value="simple">Simple</option>
//           <option value="attachment">With Attachment</option>
//           <option value="template">Template</option>
//         </select>

//         <label className="ml-6 flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={sendToAll}
//             onChange={() => setSendToAll(!sendToAll)}
//           />
//           <span className="text-sm font-medium">Send to All</span>
//         </label>
//       </div>

//       {!sendToAll && (
//         <div className="mb-4">
//           <label className="block font-semibold mb-1">To:</label>
//           <input
//             type="email"
//             name="to"
//             value={formData.to}
//             onChange={handleInputChange}
//             placeholder="recipient@example.com"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
//       )}

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Subject:</label>
//         <input
//           type="text"
//           name="subject"
//           value={formData.subject}
//           onChange={handleInputChange}
//           placeholder="Email subject"
//           className="w-full border px-3 py-2 rounded"
//         />
//       </div>

//       {(emailType === "simple" || emailType === "attachment") && (
//         <div className="mb-4">
//           <label className="block font-semibold mb-1">Body:</label>
//           <textarea
//             name="body"
//             value={formData.body}
//             onChange={handleInputChange}
//             rows="6"
//             placeholder="Write your message here"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
//       )}

//       {emailType === "attachment" && (
//         <div className="mb-4">
//           <label className="block font-semibold mb-1">Attachments:</label>
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="w-full"
//           />
//         </div>
//       )}

//       {emailType === "template" && (
//         <>
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Template:</label>
//             <select
//               name="templateName"
//               value={formData.templateName}
//               onChange={handleInputChange}
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="template1">Template 1</option>
//               <option value="template2">Template 2</option>
//               <option value="template3">Template 3</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block font-semibold mb-2">Variables:</label>
//             {variables.map((variable, index) => (
//               <div key={index} className="flex space-x-2 mb-2">
//                 <input
//                   type="text"
//                   placeholder="Key"
//                   value={variable.key}
//                   onChange={(e) =>
//                     handleVariableChange(index, "key", e.target.value)
//                   }
//                   className="border px-2 py-1 rounded w-1/2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Value"
//                   value={variable.value}
//                   onChange={(e) =>
//                     handleVariableChange(index, "value", e.target.value)
//                   }
//                   className="border px-2 py-1 rounded w-1/2"
//                 />
//                 <button
//                   onClick={() => removeVariableField(index)}
//                   className="bg-red-500 text-white rounded px-2"
//                   type="button"
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//             <button
//               onClick={addVariableField}
//               type="button"
//               className="bg-green-500 text-white px-3 py-1 rounded"
//             >
//               Add Variable
//             </button>
//           </div>
//         </>
//       )}

//       <button
//         onClick={sendEmail}
//         className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//       >
//         Send Email
//       </button>

//       {status && <p className="mt-4 font-semibold text-green-700">{status}</p>}
//     </div>
//   );
// };

// export default EmailSenderForm;
