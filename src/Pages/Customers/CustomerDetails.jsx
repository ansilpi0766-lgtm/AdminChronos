import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, User, Mail, CalendarDays, Package } from "lucide-react";
import API from "../../Services/api";

const CustomerDetails = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await API.get(`/users/admin/customers/${id}`);

        setCustomer(response.data.customer);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch customer details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading customer details...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  if (!customer) {
    return <p className="text-center py-10">Customer not found.</p>;
  }

  return (
    <div className="space-y-7">
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-2 text-[#421713] hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Customers
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-[#421713]">Customer Details</h1>
        <p className="text-gray-500 mt-2">
          View customer information and order history.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#421713] text-white flex items-center justify-center text-2xl font-bold">
            {customer.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#421713]">
              {customer.name}
            </h2>
            <p className="text-gray-500">Customer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Mail className="text-[#421713]" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-[#421713]" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{customer.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#421713]" />
            <div>
              <p className="text-sm text-gray-500">Joined Date</p>
              <p className="font-medium">
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Package className="text-[#421713]" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="font-medium">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[#421713] mb-5">
          Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            This customer has not placed any orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-4 px-3">Order ID</th>
                  <th className="py-4 px-3">Products</th>
                  <th className="py-4 px-3">Total Amount</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-4 px-3 font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="py-4 px-3">
                      {order.products?.length || 0} items
                    </td>

                    <td className="py-4 px-3">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-3">
                      <span className="px-3 py-1 rounded-full bg-[#FFF1DC] text-[#421713] text-sm">
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
