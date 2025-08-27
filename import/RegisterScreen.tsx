
// src/screens/RegisterScreen.tsx

import React, { useState } from "react";
import { useApp } from "../components/AppContext";

const RegisterScreen: React.FC = () => {
  const { register } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    age: "",
    avatar: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(form);
    setMessage(success ? "登録に成功しました" : "登録に失敗しました");
  };

  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="名前" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="メールアドレス" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="パスワード" required />
        <input name="department" value={form.department} onChange={handleChange} placeholder="部署" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="年代" />
        <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="アバター画像URL" />
        <button type="submit">登録</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RegisterScreen;
