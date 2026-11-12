import React, { useEffect, useState } from "react";
import API from "../../Services/api";

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/orders/admin/all");

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);

      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await API.patch(`/orders/${orderId}/status`, {
        status,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      console.error("Update status error:", err);

      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#351711]">
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">View and manage customer orders</p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-[#351711] text-white px-5 py-2.5 rounded-lg hover:bg-[#57251d] transition"
        >
          Refresh Orders
        </button>
      </div>

      {/* Total Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <p className="text-sm text-gray-500">Total Orders</p>
        <h2 className="text-3xl font-bold text-[#351711] mt-2">
          {orders.length}
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <h3 className="text-lg font-semibold">No orders found</h3>
            <p className="text-sm mt-2">Customer orders will appear here.</p>
          </div>
        ) : (
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Products</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  {/* Order ID */}
                  <td className="p-4">
                    <span className="font-medium text-gray-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <p className="font-medium text-gray-800">
                      {order.user?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.user?.email || ""}
                    </p>
                  </td>

                  {/* Products */}
                  <td className="p-4">
                    {order.products?.map((item, index) => (
                      <div key={item._id || index} className="text-sm mb-1">
                        <span className="text-gray-800">
                          {item.product?.name || "Product"}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </td>

                  {/* Total */}
                  <td className="p-4 font-semibold text-gray-800">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#351711] disabled:opacity-50"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingId === order._id && (
                        <span className="text-xs text-gray-500">
                          Updating...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
