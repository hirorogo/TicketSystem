import { useState, useEffect } from 'react';
import './StatusDisplay.css';

const API_URL = "http://localhost:3001/api";

export default function StatusDisplay() {
  const [status, setStatus] = useState({});

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('ステータス取得エラー:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // 3秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (congestion) => {
    switch(congestion) {
      case '空いている': return '#4ade80';
      case '普通': return '#fbbf24';
      case '混雑': return '#f97316';
      case '非常に混雑': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="status-display">
      <h1>現在の状況</h1>
      
      <div className="current-number">
        <h2>現在お呼びしている番号</h2>
        <div className="number-display">
          {status.currentNumber || 0}
        </div>
      </div>

      <div className="remaining-info">
        <h3>本日の残り</h3>
        <p className="remaining-count">{status.remainingCount || 0}人</p>
      </div>

      <div className="congestion-info">
        <h3>混雑状況</h3>
        <div 
          className="congestion-status"
          style={{ backgroundColor: getCongestionColor(status.congestionStatus) }}
        >
          {status.congestionStatus || '普通'}
        </div>
      </div>

      <div className="updated-time">
        最終更新: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
