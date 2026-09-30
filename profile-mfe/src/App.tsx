import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Panel, Field } from "host/shared";

type User = { id: string; name: string; email: string; password?: string };

export default function App() {
  const userId = useSelector((state: { auth: { userId: string | null } }) => state.auth.userId);

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userId)
      fetch(`http://localhost:5000/users/${userId}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load profile"))))
        .then(setUser)
        .catch((e) => setError(e.message));
  }, [userId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaved(false);
    const response = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user.name, email: user.email }),
    });
    if (!response.ok) {
      setError("Could not save profile");
      return;
    }
    setUser(await response.json());
    setSaved(true);
  };

  if (!user)
    return (
      <main className="page">
        <Panel title="Profile">
          <p>{error || "Loading profile..."}</p>
        </Panel>
      </main>
    );

  return (
    <main className="page">
      <Panel title="Your profile">
        <form className="form" onSubmit={submit}>
          <Field id="name" label="Name" value={user.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, name: e.target.value })} required />
          <Field id="email" label="Email" type="email" value={user.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} required />
          <button type="submit">Save changes</button>
          {saved && <p className="success">Profile updated.</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </Panel>
    </main>
  );
}
