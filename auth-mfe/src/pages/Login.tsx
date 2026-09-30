import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, name } from "host/store";
import { Panel, Field } from "host/shared";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("nasif@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name: email.split("@")[0] }) });
      if (!response.ok) throw new Error("Unable to sign in");
      const user = await response.json();
      dispatch(login({ user, token: `mock-jwt-${user.id}` }));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    }
  };
  return (
    <main className="page">
      <h1>Hoste name:{name}</h1>
      <Panel title="Welcome back">
        <form className="form" onSubmit={submit}>
          {error && <p className="error">{error}</p>} <Field id="email" label="Email" type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
          <Field id="password" label="Password" type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <div className="links">
            <Link to="../signup">Create an account</Link>
            <Link to="../forgot-password">Forgot password?</Link>
          </div>
        </form>
      </Panel>
    </main>
  );
}
