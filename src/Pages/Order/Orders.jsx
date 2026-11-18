import React, { useEffect, useState } from "react";
import API from "../../Services/api";
import {
  RefreshCw,
  Eye,
  X,
  Package,
  UserRound,
  MapPin,
  CalendarDays,
  IndianRupee,
  CheckCircle2,
  Clock3,
} from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  // UPDATE ORDER STATUS
  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await API.patch(`/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?._id === orderId ? { ...prev, status } : prev,
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Processing: "bg-blue-50 text-blue-700 border-blue-200",
      Shipped: "bg-purple-50 text-purple-700 border-purple-200",
      Delivered: "bg-green-50 text-green-700 border-green-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  // SHIPPING ADDRESS
  const getAddress = (address) => {
    if (!address) return [];

    if (typeof address === "string") {
      return [address];
    }

    const fields = [
      "name",
      "phone",
      "address",
      "street",
      "city",
      "state",
      "postalCode",
      "zipCode",
      "country",
    ];

    return fields
      .filter((key) => address[key])
      .map(
        (key) =>
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${address[key]}`,
      );
  };

  // ORDER TIMELINE
  const timelineSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  const getTimelineIndex = (status) => timelineSteps.indexOf(status);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="orders-loading">Loading orders...</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="orders-page">
        {/* HEADER */}
        <div className="orders-header">
          <div>
            <p className="orders-eyebrow">CHRONOS ADMIN</p>
            <h1>Orders Management</h1>
            <p>View and manage customer orders</p>
          </div>

          <button className="refresh-orders" onClick={fetchOrders}>
            <RefreshCw size={15} />
            Refresh Orders
          </button>
        </div>

        {error && <div className="orders-error">{error}</div>}

        {/* TOTAL ORDERS */}
        <div className="orders-summary">
          <div className="summary-icon">
            <Package size={21} />
          </div>

          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="orders-table-card">
          {orders.length === 0 ? (
            <div className="orders-empty">
              <Package size={35} />
              <h3>No orders found</h3>
              <p>Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td>
                        <div className="customer-name">
                          {order.user?.name || "Unknown"}
                        </div>
                        <div className="customer-email">
                          {order.user?.email || ""}
                        </div>
                      </td>

                      <td>
                        {order.products?.map((item, index) => (
                          <div className="product-line" key={item._id || index}>
                            {item.product?.name || "Product"} × {item.quantity}
                          </div>
                        ))}
                      </td>

                      <td className="order-total">
                        {formatPrice(order.totalAmount)}
                      </td>

                      <td>{formatDate(order.createdAt)}</td>

                      <td>
                        <div className="status-control">
                          <span
                            className={`status-badge ${getStatusStyle(order.status)}`}
                          >
                            {order.status}
                          </span>

                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {updatingId === order._id && (
                            <small>Updating...</small>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p>ORDER DETAILS</p>
                <h2>#{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* ORDER INFORMATION */}
              <div className="detail-grid">
                <div className="detail-card">
                  <CalendarDays size={18} />
                  <div>
                    <span>Order Date</span>
                    <strong>{formatDate(selectedOrder.createdAt)}</strong>
                  </div>
                </div>

                <div className="detail-card">
                  <IndianRupee size={18} />
                  <div>
                    <span>Total Amount</span>
                    <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="detail-section">
                <h3>
                  <UserRound size={17} /> Customer Information
                </h3>

                <div className="info-box">
                  <strong>
                    {selectedOrder.user?.name || "Unknown Customer"}
                  </strong>
                  <p>{selectedOrder.user?.email || "No email available"}</p>
                </div>
              </div>

              {/* SHIPPING */}
              <div className="detail-section">
                <h3>
                  <MapPin size={17} /> Shipping Address
                </h3>

                <div className="info-box">
                  {getAddress(selectedOrder.shippingAddress).length > 0 ? (
                    getAddress(selectedOrder.shippingAddress).map(
                      (line, index) => <p key={index}>{line}</p>,
                    )
                  ) : (
                    <p>Shipping address not available.</p>
                  )}
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="detail-section">
                <h3>
                  <Package size={17} /> Ordered Products
                </h3>

                <div className="detail-products">
                  {selectedOrder.products?.map((item, index) => (
                    <div className="detail-product" key={item._id || index}>
                      <div className="product-image-placeholder">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        ) : (
                          <Package size={22} />
                        )}
                      </div>

                      <div className="detail-product-info">
                        <strong>{item.product?.name || "Product"}</strong>
                        <span>Quantity: {item.quantity}</span>
                      </div>

                      <strong className="detail-product-price">
                        {formatPrice(
                          Number(item.product?.price || 0) *
                            Number(item.quantity || 0),
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="detail-total">
                  <span>Total Amount</span>
                  <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="detail-section">
                <h3>
                  <Clock3 size={17} /> Order Status
                </h3>

                {selectedOrder.status === "Cancelled" ? (
                  <div className="cancelled-message">
                    This order has been cancelled.
                  </div>
                ) : (
                  <div className="order-timeline">
                    {timelineSteps.map((step, index) => {
                      const currentIndex = getTimelineIndex(
                        selectedOrder.status,
                      );
                      const completed = index <= currentIndex;

                      return (
                        <div className="timeline-step" key={step}>
                          <div
                            className={`timeline-circle ${completed ? "completed" : ""}`}
                          >
                            {completed ? (
                              <CheckCircle2 size={17} />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>

                          <span className={completed ? "timeline-active" : ""}>
                            {step}
                          </span>

                          {index !== timelineSteps.length - 1 && (
                            <div
                              className={`timeline-line ${index < currentIndex ? "line-active" : ""}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* UPDATE STATUS */}
              <div className="modal-status-update">
                <label>Update Order Status</label>

                <select
                  value={selectedOrder.status}
                  disabled={updatingId === selectedOrder._id}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = `
.orders-page {
  padding: 24px 26px;
  max-width: 1450px;
  margin: auto;
  color: #351711;
}
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}
.orders-eyebrow {
  color: #a47755;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 0 5px;
}
.orders-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.orders-header p:last-child {
  font-size: 12px;
  color: #998b84;
  margin: 5px 0 0;
}
.refresh-orders {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  border: none;
  border-radius: 7px;
  background: #351711;
  color: white;
  font-size: 11px;
  cursor: pointer;
}
.refresh-orders:hover { background: #633329; }
.orders-summary {
  display: flex;
  align-items: center;
  gap: 13px;
  background: white;
  border: 1px solid #eee5df;
  border-radius: 10px;
  padding: 15px 18px;
  margin-bottom: 18px;
  max-width: 300px;
}
.summary-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f6eee8;
  color: #704338;
}
.orders-summary p {
  color: #91827a;
  font-size: 11px;
  margin: 0 0 4px;
}
.orders-summary h2 {
  font-size: 23px;
  margin: 0;
}
.orders-table-card {
  background: white;
  border: 1px solid #eee5df;
  border-radius: 10px;
  overflow: hidden;
}
.orders-table-wrapper { overflow-x: auto; }
.orders-table {
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
  text-align: left;
}
.orders-table th {
  padding: 13px 14px;
  background: #faf7f5;
  color: #88766e;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
}
.orders-table td {
  padding: 14px;
  border-top: 1px solid #f0eae6;
  color: #62514a;
  font-size: 11px;
  vertical-align: middle;
}
.orders-table tbody tr:hover { background: #fdfaf8; }
.order-id, .order-total {
  font-weight: 700;
  color: #542b25 !important;
}
.customer-name { font-weight: 600; color: #39231e; }
.customer-email { color: #9a8b84; font-size: 10px; margin-top: 4px; }
.product-line { margin: 3px 0; }
.status-control { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.status-control select {
  max-width: 120px;
  padding: 6px 8px;
  border: 1px solid #e7ddd6;
  border-radius: 5px;
  font-size: 10px;
  outline: none;
  background: white;
}
.status-control small { color: #9a8b84; font-size: 9px; }
.status-badge {
  display: inline-block;
  border: 1px solid;
  border-radius: 20px;
  padding: 4px 9px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.view-details-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #e8dcd5;
  background: #fffaf7;
  color: #704338;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}
.view-details-btn:hover {
  background: #542b25;
  color: white;
  border-color: #542b25;
}
.orders-empty {
  text-align: center;
  padding: 55px 15px;
  color: #998b84;
}
.orders-empty h3 { color: #49332c; margin: 12px 0 5px; }
.orders-empty p { font-size: 12px; }
.orders-loading { text-align: center; padding: 50px; color: #79594d; }
.orders-error {
  padding: 11px;
  border-radius: 7px;
  background: #fff0f0;
  color: #b33d3d;
  font-size: 12px;
  margin-bottom: 15px;
}

/* MODAL */
.order-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(24, 12, 9, .58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.order-modal {
  width: 100%;
  max-width: 690px;
  max-height: 90vh;
  background: #fff;
  border-radius: 13px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 70px rgba(0,0,0,.2);
}
.modal-header {
  padding: 17px 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #351711;
  color: white;
}
.modal-header p {
  font-size: 9px;
  letter-spacing: 2px;
  color: #d6a15c;
  margin: 0 0 4px;
}
.modal-header h2 { font-size: 20px; margin: 0; }
.modal-close {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 7px;
  background: transparent;
  color: white;
  cursor: pointer;
}
.modal-body { padding: 20px; overflow-y: auto; }
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.detail-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  background: #faf7f5;
  border: 1px solid #f0e7e1;
  border-radius: 8px;
  color: #79513f;
}
.detail-card div { display: flex; flex-direction: column; gap: 4px; }
.detail-card span { font-size: 10px; color: #998b84; }
.detail-card strong { font-size: 12px; color: #39231e; }
.detail-section { margin-bottom: 20px; }
.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #49312a;
  font-size: 13px;
  margin: 0 0 10px;
}
.info-box {
  padding: 12px 14px;
  border: 1px solid #eee5df;
  border-radius: 8px;
  background: #fff;
  font-size: 11px;
  color: #72615a;
}
.info-box strong { color: #39231e; }
.info-box p { margin: 5px 0 0; }
.detail-products {
  border: 1px solid #eee5df;
  border-radius: 8px;
  overflow: hidden;
}
.detail-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px;
  border-bottom: 1px solid #f0eae6;
}
.detail-product:last-child { border-bottom: none; }
.product-image-placeholder {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #f8f3ef;
  color: #805a49;
  border-radius: 6px;
  overflow: hidden;
}
.product-image-placeholder img { width: 100%; height: 100%; object-fit: cover; }
.detail-product-info { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.detail-product-info strong { font-size: 11px; color: #39231e; }
.detail-product-info span { font-size: 10px; color: #998b84; }
.detail-product-price { font-size: 11px; color: #542b25; }
.detail-total {
  display: flex;
  justify-content: space-between;
  padding: 13px;
  background: #faf7f5;
  color: #49312a;
  font-size: 12px;
}
.detail-total strong { color: #542b25; font-size: 15px; }
.order-timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 4px;
}
.timeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 7px;
  font-size: 10px;
  color: #a99b94;
}
.timeline-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #ded3cc;
  display: grid;
  place-items: center;
  background: white;
  font-size: 10px;
  z-index: 1;
}
.timeline-circle.completed {
  background: #542b25;
  color: white;
  border-color: #542b25;
}
.timeline-active { color: #542b25; font-weight: 700; }
.timeline-line {
  position: absolute;
  height: 2px;
  width: 75%;
  top: 13px;
  left: 62%;
  background: #e9dfd9;
}
.timeline-line.line-active { background: #704338; }
.cancelled-message {
  padding: 12px;
  background: #fff0f0;
  color: #b33d3d;
  border-radius: 7px;
  font-size: 12px;
}
.modal-status-update {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.modal-status-update label {
  font-size: 11px;
  font-weight: 600;
  color: #49312a;
}
.modal-status-update select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e7ddd6;
  border-radius: 7px;
  background: white;
  color: #49312a;
  font-size: 12px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 13px 20px;
  border-top: 1px solid #eee5df;
}
.modal-footer button {
  padding: 9px 17px;
  background: #351711;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}
@media (max-width: 650px) {
  .orders-page { padding: 15px; }
  .orders-header { align-items: flex-start; flex-direction: column; }
  .orders-header h1 { font-size: 21px; }
  .detail-grid { grid-template-columns: 1fr; }
  .order-modal-overlay { padding: 10px; }
  .modal-body { padding: 14px; }
  .timeline-step { font-size: 9px; }
  .timeline-line { width: 65%; }
}
`;

export default Orders;
