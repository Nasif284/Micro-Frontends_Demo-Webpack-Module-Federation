import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Panel } from "host/shared";

type Order = { id: string; product: string; amount: number; status: string };
export default function App() {
  
  const user = useSelector((state: { auth: { user: { name: string } | null } }) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load orders"))))
      .then(setOrders)
      .catch((e) => setError(e.message));
    
  }, []);
// throw new Error("Test crash triggered by user!");
  return (
    <main className="page">
      <Panel title={`Dashboard${user ? ` · ${user?.name}` : ""}`}>
        <p>Recent orders from the mock API</p>
        {error && <p className="error">{error}</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product}</td>
                <td>₹{order.amount.toLocaleString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </main>
  );
}
