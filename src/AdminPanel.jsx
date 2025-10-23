import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3001/api";

export default function AdminPanel() {
  const [status, setStatus] = useState({});
  const [congestionStatus, setCongestionStatus] = useState('普通');

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/status`);
      const data = await res.json();
      setStatus(data);
      setCongestionStatus(data.congestionStatus);
    } catch (err) {
      console.error('ステータス取得エラー:', err);
    }
  };

  const callNext = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/call-next`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        fetchStatus();
        alert(`${data.calledNumber}番をお呼びしました`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('呼び出しエラー:', err);
    }
  };

  const updateCongestion = async (newStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/congestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setCongestionStatus(newStatus);
        fetchStatus();
      }
    } catch (err) {
      console.error('混雑状況更新エラー:', err);
    }
  };

  const resetSystem = async () => {
    if (confirm('システムをリセットしますか？')) {
      try {
        const res = await fetch(`${API_URL}/admin/reset`, {
          method: 'POST'
        });
        const data = await res.json();
        if (data.success) {
          fetchStatus();
          alert('システムをリセットしました');
        }
      } catch (err) {
        console.error('リセットエラー:', err);
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>管理者パネル</h1>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ marginTop: 0, color: '#495057' }}>現在の状況</h2>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          現在呼び出し中: <strong style={{ color: '#007bff' }}>{status.currentNumber || 0}番</strong>
        </p>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          最新発券番号: <strong style={{ color: '#28a745' }}>{status.lastIssuedNumber || 0}番</strong>
        </p>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          待ち人数: <strong style={{ color: '#dc3545' }}>{status.remainingCount || 0}人</strong>
        </p>
      </div>

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button 
          onClick={callNext}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
        >
          📢 次の番号を呼び出し
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#495057' }}>混雑状況設定</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['空いている', '普通', '混雑', '非常に混雑'].map(statusOption => (
            <button
              key={statusOption}
              onClick={() => updateCongestion(statusOption)}
              style={{
                padding: '10px 20px',
                backgroundColor: congestionStatus === statusOption ? '#28a745' : '#e9ecef',
                color: congestionStatus === statusOption ? 'white' : '#495057',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        border: '2px solid #dc3545', 
        borderRadius: '8px',
        backgroundColor: '#f8d7da'
      }}>
        <h3 style={{ color: '#721c24', marginTop: 0 }}>⚠️ 危険な操作</h3>
        <button 
          onClick={resetSystem}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
          onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
        >
          🔄 システムリセット
        </button>
      </div>
    </div>
  );
}
