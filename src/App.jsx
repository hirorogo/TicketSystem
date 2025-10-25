import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://5.104.86.48:3009";

export default function App() {
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const darkMode = saved ? JSON.parse(saved) : false;
    
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

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      setTicket(`整理券番号：${data.ticket}`);
      setWaitingCount(data.waitingCount);
      setName(""); // 名前をクリア
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
        setWaitingCount(0);
      }, 10000); // 10秒表示
      setIsClicked(false);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  // 現在の状況を定期的に取得
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/status`);
        const data = await res.json();
        setCurrentNumber(data.currentNumber);
      } catch (err) {
        console.error('状況取得エラー:', err);
      }
    };

    fetchCurrentStatus();
    const interval = setInterval(fetchCurrentStatus, 10000); // 10秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
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
      {ticket && (
        <div className="result-container">
          <p className="result">{ticket}</p>
          {waitingCount > 0 && (
            <p className="waiting-info">あと約{waitingCount}人お待ちください</p>
          )}
        </div>
      )}
      <p>{currentNumber}番までお呼びいたしました。</p>
      <p>お待ちの間に資料を御覧ください</p>
      <p>発券したものはスクショをしてください</p>
      
      <div className="links">
        <a href="/TicketSystem/status" target="_blank">混雑状◯況呼び出し状況</a>
      </div>
    </div>
  );
}