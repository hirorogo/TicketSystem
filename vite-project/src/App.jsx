import { useState } from "react";
import "./App.css";

const GAS_URL = "https://script.google.com/macros/s/AKfycbxeZNwir5wTo13WBxOehhnl1S7Ud90QhUZEuvPVn0u2L_KRY7UE5tLDzj-chKNoei_bog/exec";
// ↑ あなたのデプロイ済みApps ScriptのURLに変更してください

export default function App() {
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("name", name);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      setTicket(`整理券番号：${data.ticket}`);
    } catch (err) {
      console.error(err);
      setTicket("通信エラーが発生しました。");
    }
  };

  return (
    <div className="app">
      <h1>整理券発行システム</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">発行</button>
      </form>
      {ticket && <p className="result">{ticket}</p>}
    </div>
  );
}
