import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import API from "../Services/api";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/orders/admin/all");
      setOrders(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const validOrders = useMemo(
    () => orders.filter((order) => order.status !== "Cancelled"),
    [orders],
  );

  const totalSales = validOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  const today = new Date();

  const todaySales = validOrders
    .filter(
      (order) =>
        new Date(order.createdAt).toDateString() === today.toDateString(),
    )
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const monthlySales = validOrders
    .filter((order) => {
      const date = new Date(order.createdAt);
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.createdAt);
      const start = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
      const end = toDate ? new Date(`${toDate}T23:59:59.999`) : null;
      return (!start || date >= start) && (!end || date <= end);
    });
  }, [orders, fromDate, toDate]);

  const chartData = useMemo(() => {
    const now = new Date();
    const start = fromDate
      ? new Date(`${fromDate}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const end = toDate
      ? new Date(`${toDate}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= last && months.length < 36) {
      months.push({
        label: cursor.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        month: cursor.getMonth(),
        year: cursor.getFullYear(),
        income: 0,
        count: 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    filteredOrders
      .filter((order) => order.status !== "Cancelled")
      .forEach((order) => {
        const date = new Date(order.createdAt);
        const month = months.find(
          (item) =>
            item.month === date.getMonth() && item.year === date.getFullYear(),
        );
        if (month) {
          month.income += Number(order.totalAmount || 0);
          month.count += 1;
        }
      });

    return months;
  }, [filteredOrders, fromDate, toDate]);

  const maxIncome = Math.max(...chartData.map((item) => item.income), 1);
  const maxOrders = Math.max(...chartData.map((item) => item.count), 1);
  const recentOrders = filteredOrders.slice(0, 5);

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="dash-loading">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="dash-page">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">CHRONOS ADMIN</p>
            <h2>Dashboard</h2>
            <p className="dash-subtitle">Overview of your store performance</p>
          </div>
          <button className="dash-refresh" onClick={fetchOrders}>
            <RefreshCw size={14} />
          </button>
        </div>

        {error && <div className="dash-error">{error}</div>}

        <div className="dash-cards">
          <div className="dash-card">
            <div className="dash-card-top">
              <span>Total Sales</span>
              <div className="dash-icon">
                <IndianRupee size={17} />
              </div>
            </div>
            <h3>{formatPrice(totalSales)}</h3>
            <p>All-time non-cancelled orders</p>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span>Today's Sales</span>
              <div className="dash-icon">
                <ShoppingBag size={17} />
              </div>
            </div>
            <h3>{formatPrice(todaySales)}</h3>
            <p>Today's non-cancelled orders</p>
          </div>

          <div className="dash-card">
            <div className="dash-card-top">
              <span>Monthly Sales</span>
              <div className="dash-icon">
                <TrendingUp size={17} />
              </div>
            </div>
            <h3>{formatPrice(monthlySales)}</h3>
            <p>Current month's sales</p>
          </div>
        </div>

        <section className="dash-section">
          <div className="dash-section-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Monthly income and order performance</p>
            </div>
            <div className="dash-legend">
              <span>
                <i className="income-dot" /> Income
              </span>
              <span>
                <i className="orders-dot" /> Orders
              </span>
            </div>
          </div>

          <div className="dash-filters">
            <div className="dash-filter-title">
              <CalendarDays size={15} /> Filter by date
            </div>
            <div className="dash-filter-inputs">
              <label>
                <span>From</span>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="dash-chart">
            {chartData.length === 0 ? (
              <p className="dash-empty">No chart data available.</p>
            ) : (
              <div className="dash-chart-bars">
                {chartData.map((item, index) => (
                  <div className="dash-chart-column" key={index}>
                    <div className="dash-bar-values">
                      <span>{formatPrice(item.income)}</span>
                      <span>{item.count} orders</span>
                    </div>
                    <div className="dash-bars">
                      <div
                        className="dash-income-bar"
                        style={{
                          height: `${(item.income / maxIncome) * 100}%`,
                        }}
                        title={`Income: ${formatPrice(item.income)}`}
                      />
                      <div
                        className="dash-orders-bar"
                        style={{ height: `${(item.count / maxOrders) * 100}%` }}
                        title={`Orders: ${item.count}`}
                      />
                    </div>
                    <span className="dash-month">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="dash-section">
          <div className="dash-section-heading">
            <div>
              <h3>Recent Orders</h3>
              <p>Latest customer orders</p>
            </div>
            <Link to="/admin/orders" className="dash-view-all">
              View All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="dash-order-id">
                        #{order._id.slice(-7).toUpperCase()}
                      </td>
                      <td>{order.user?.name || "Unknown Customer"}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="dash-amount">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td>
                        <span
                          className={`dash-status ${order.status?.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="dash-empty">
                      No orders found for this date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

const styles = `
.dash-page {
  width: 100%;
  max-width: 1400px;
  margin: auto;
  padding: 22px 26px;
  box-sizing: border-box;
  color: #35201d;
}
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.dash-eyebrow {
  color: #a47755;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 0 5px;
}
.dash-header h2 {
  font-size: 24px;
  margin: 0;
}
.dash-subtitle {
  color: #968681;
  font-size: 12px;
  margin: 5px 0 0;
}
.dash-refresh, .dash-view-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #e9ded8;
  background: white;
  color: #542b25;
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: .2s;
}
.dash-refresh:hover, .dash-view-all:hover {
  background: #542b25;
  color: white;
}
.dash-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 19px;
}
.dash-card {
  background: white;
  border: 1px solid #eee6e1;
  border-radius: 10px;
  padding: 16px 18px;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(50,25,20,.025);
}
.dash-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #887872;
  font-size: 12px;
  font-weight: 600;
}
.dash-icon {
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7eee8;
  color: #784638;
  border-radius: 8px;
}
.dash-card h3 {
  font-size: 22px;
  margin: 12px 0 4px;
  overflow-wrap: anywhere;
}
.dash-card p {
  font-size: 10px;
  color: #a09690;
  margin: 0;
}
.dash-section {
  background: white;
  border: 1px solid #eee6e1;
  border-radius: 10px;
  padding: 18px 19px;
  margin-bottom: 19px;
  box-shadow: 0 2px 8px rgba(50,25,20,.025);
}
.dash-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.dash-section-heading h3 {
  font-size: 15px;
  margin: 0;
}
.dash-section-heading p {
  color: #a09690;
  font-size: 11px;
  margin: 5px 0 0;
}
.dash-legend {
  display: flex;
  gap: 14px;
}
.dash-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #81716a;
}
.dash-legend i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.income-dot { background: #704338; }
.orders-dot { background: #d6a15c; }
.dash-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 11px 13px;
  background: #fbf8f6;
  border: 1px solid #f0e8e3;
  border-radius: 8px;
  margin-bottom: 20px;
}
.dash-filter-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #63453b;
  font-weight: 600;
}
.dash-filter-inputs {
  display: flex;
  align-items: end;
  gap: 9px;
}
.dash-filter-inputs label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dash-filter-inputs label span {
  color: #998982;
  font-size: 10px;
  font-weight: 600;
}
.dash-filter-inputs input {
  width: 140px;
  box-sizing: border-box;
  padding: 7px 8px;
  border: 1px solid #e8dcd5;
  border-radius: 6px;
  background: white;
  color: #49302a;
  font-size: 11px;
  outline: none;
}
.dash-filter-inputs input:focus { border-color: #9a6a53; }
.dash-filter-inputs button {
  border: none;
  background: #542b25;
  color: white;
  border-radius: 6px;
  padding: 8px 11px;
  font-size: 10px;
  cursor: pointer;
}
.dash-chart {
  width: 100%;
  overflow-x: auto;
  padding: 5px 0 0;
}
.dash-chart-bars {
  min-width: 400px;
  height: 210px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 12px;
  border-bottom: 1px solid #eee5df;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent 49px, #f5efeb 50px);
}
.dash-chart-column {
  height: 100%;
  flex: 1;
  min-width: 35px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
.dash-bar-values {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  color: #95847d;
  margin-bottom: 5px;
}
.dash-bars {
  height: 125px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
}
.dash-income-bar, .dash-orders-bar {
  width: min(25px, 35%);
  min-height: 0;
  border-radius: 4px 4px 0 0;
  transition: height .3s ease;
}
.dash-income-bar { background: #704338; }
.dash-orders-bar { background: #d6a15c; }
.dash-month {
  position: absolute;
  bottom: -23px;
  font-size: 10px;
  color: #897972;
  white-space: nowrap;
}
.dash-table-wrap { width: 100%; overflow-x: auto; }
.dash-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  text-align: left;
}
.dash-table th {
  padding: 11px 12px;
  background: #faf7f5;
  color: #93827b;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
}
.dash-table td {
  padding: 12px;
  border-bottom: 1px solid #f1ebe7;
  color: #66544d;
  font-size: 11px;
  white-space: nowrap;
}
.dash-table tbody tr:last-child td { border-bottom: none; }
.dash-order-id { font-weight: 700; color: #704338 !important; }
.dash-amount { font-weight: 700; color: #39231e !important; }
.dash-status {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  background: #f5eee8;
  color: #79553e;
}
.dash-status.delivered { background: #e9f5ed; color: #37804d; }
.dash-status.cancelled { background: #fbeaea; color: #b44b4b; }
.dash-status.shipped { background: #eaf1fb; color: #4e70a4; }
.dash-status.processing { background: #fff3df; color: #a16b24; }
.dash-empty {
  text-align: center;
  padding: 30px !important;
  color: #a09690 !important;
  font-size: 12px;
}
.dash-loading {
  padding: 50px;
  text-align: center;
  color: #79594d;
  font-size: 13px;
}
.dash-error {
  background: #fff0f0;
  color: #b33d3d;
  border: 1px solid #f1d1d1;
  padding: 10px 13px;
  border-radius: 7px;
  font-size: 12px;
  margin-bottom: 16px;
}
@media (max-width: 900px) {
  .dash-page { padding: 18px; }
  .dash-card { padding: 14px; }
  .dash-card h3 { font-size: 19px; }
}
@media (max-width: 650px) {
  .dash-page { padding: 14px; }
  .dash-header h2 { font-size: 21px; }
  .dash-cards { grid-template-columns: 1fr; gap: 10px; }
  .dash-card { padding: 13px 15px; }
  .dash-card h3 { font-size: 20px; margin-top: 8px; }
  .dash-section { padding: 14px; }
  .dash-filters { align-items: flex-start; flex-direction: column; }
  .dash-filter-inputs { width: 100%; flex-wrap: wrap; }
  .dash-filter-inputs label { flex: 1; min-width: 110px; }
  .dash-filter-inputs input { width: 100%; }
  .dash-legend { gap: 8px; }
  .dash-legend span { font-size: 9px; }
  .dash-view-all { padding: 8px; font-size: 10px; }
}
`;

export default Dashboard;
