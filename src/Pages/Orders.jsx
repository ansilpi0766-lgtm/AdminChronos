// import React, { useEffect, useState } from "react";
// import api from "../Services/api";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await api.get("/orders");
//         setOrders(res.data.orders || res.data);
//       } catch (error) {
//         console.error("Orders error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p className="p-6">Loading orders...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-[#421713]">Orders</h1>
//       <p className="text-gray-500 mb-6">Manage customer orders</p>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-[#f5eee5]">
//             <tr>
//               <th className="p-4">Order ID</th>
//               <th className="p-4">Customer</th>
//               <th className="p-4">Total</th>
//               <th className="p-4">Payment</th>
//               <th className="p-4">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} className="border-b">
//                 <td className="p-4">{order._id?.slice(-8)}</td>
//                 <td className="p-4">
//                   {order.user?.name || order.customerName || "Customer"}
//                 </td>
//                 <td className="p-4">
//                   ${order.totalAmount ?? order.total ?? 0}
//                 </td>
//                 <td className="p-4">{order.paymentStatus || "Pending"}</td>
//                 <td className="p-4">{order.status || "Processing"}</td>
//               </tr>
//             ))}

//             {orders.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="p-8 text-center text-gray-500">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;
