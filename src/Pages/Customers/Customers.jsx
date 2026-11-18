import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Eye, Search } from "lucide-react";
import API from "../../Services/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get("/users/admin/customers");
        setCustomers(response.data.customers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name || ""} ${customer.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-[#421713]">Customers</h1>
        <p className="text-gray-500 mt-2">
          Manage your registered CHRONOS customers.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
        <div className="bg-[#FFF1DC] p-4 rounded-xl">
          <Users className="text-[#421713]" size={26} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="text-2xl font-bold text-[#421713]">
            {customers.length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-[#421713]">
            Customer List
          </h2>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-4 py-2 outline-none focus:border-[#421713]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading customers...
          </p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {customers.length === 0
                ? "No registered customers yet."
                : "No customers match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-4 px-3">Customer</th>
                  <th className="py-4 px-3">Email</th>
                  <th className="py-4 px-3">Joined</th>
                  <th className="py-4 px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b last:border-0 hover:bg-[#FFFDF8]"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#421713] text-white flex items-center justify-center font-semibold">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {customer.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-gray-600">
                      {customer.email}
                    </td>

                    <td className="py-4 px-3 text-gray-600">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="py-4 px-3">
                      <Link
                        to={`/admin/customers/${customer._id}`}
                        className="inline-flex items-center gap-2 bg-[#421713] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a241e]"
                      >
                        <Eye size={16} />
                        View
                      </Link>
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

export default Customers;
