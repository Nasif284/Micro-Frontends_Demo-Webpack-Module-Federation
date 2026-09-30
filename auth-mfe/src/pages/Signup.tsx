import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "host/store";
import { useDispatch } from "react-redux";
import { Panel, Field } from "host/shared";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Unable to create account");
      const user = await response.json();
      dispatch(login({ user, token: `mock-jwt-${user.id}` }));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    }
  };
  return (
    <main className="page">
      <Panel title="Create your account">
        <form className="form" onSubmit={submit}>
          {error && <p className="error">{error}</p>}
          <Field id="name" label="Name" value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
          <Field id="email" label="Email" type="email" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} required />
          <Field id="password" label="Password" type="password" value={form.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">Sign up</button>
          <p className="links">
            Already registered? <Link to="../login">Login</Link>
          </p>
        </form>
      </Panel>
    </main>
  );
}
