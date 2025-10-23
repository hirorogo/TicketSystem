import { useState, useEffect } from "react";
import "./App.css";

const GAS_URL = "http://localhost:3001/api/tickets";
// ↑ バックエンドAPIのURLに変更

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [ticket, setTicket] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // ローカルストレージからダークモード設定を読み込み
    const saved = localStorage.getItem('darkMode');
    const darkMode = saved ? JSON.parse(saved) : false;
    
    // 初期読み込み時にbodyクラスを設定
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    return darkMode;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClicked(true);

    const params = new URLSearchParams();
    params.append("name", name);
    params.append("amount", amount);

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
      setIsClicked(false);
    }
  };

  useEffect(() => {
    if (ticket) {
      const timer = setTimeout(() => {
        setTicket("");
      }, 5000);
      setIsClicked(false);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  // ダークモード設定をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    // bodyクラスを切り替え
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header" onDoubleClick={toggleDarkMode}>
        <h1>整理券を発券</h1>
        <button 
          type="button" 
          className="dark-mode-toggle visually-hidden" 
          onClick={toggleDarkMode}
          aria-label="ダークモード切り替え"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={isClicked}>発券</button>
      </form>
      {ticket && <p className="result">{ticket}</p>}
      <p>◯番までお呼びいたしました。</p>
      <p>お待ちの間に資料を御覧ください</p>
      <p>おおよそ10分ほどでお呼びいたします。</p>
    </div>
  );
}
