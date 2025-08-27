
// src/screens/LoginScreen.tsx

import React, { useState } from "react";
import { useApp } from "../components/AppContext";

const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    setMessage(success ? "ログイン成功" : "ログイン失敗");
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="メールアドレス" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワード" required />
        <button type="submit">ログイン</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginScreen;
