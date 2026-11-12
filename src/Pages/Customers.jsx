// import React, { useEffect, useState } from "react";
// import api from "../Services/api";

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await api.get("/users");
//         setCustomers(res.data.users || res.data);
//       } catch (error) {
//         console.error("Customers error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   if (loading) return <p className="p-6">Loading customers...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-[#421713]">Customers</h1>
//       <p className="text-gray-500 mb-6">Manage registered customers</p>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-[#f5eee5]">
//             <tr>
//               <th className="p-4">Name</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Role</th>
//               <th className="p-4">Joined</th>
//             </tr>
//           </thead>

//           <tbody>
//             {customers.map((customer) => (
//               <tr key={customer._id} className="border-b">
//                 <td className="p-4">{customer.name}</td>
//                 <td className="p-4">{customer.email}</td>
//                 <td className="p-4">{customer.role || "Customer"}</td>
//                 <td className="p-4">
//                   {customer.createdAt
//                     ? new Date(customer.createdAt).toLocaleDateString()
//                     : "—"}
//                 </td>
//               </tr>
//             ))}

//             {customers.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="p-8 text-center text-gray-500">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Customers;
