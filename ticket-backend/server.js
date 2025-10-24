const express = require('express');
const cors = require('cors');

const app = express();
// by otoneko. 3001 --> 3009
const PORT = 3009;

// by otoneko.
const fs = require("fs-extra");
const path = require("path");
const DATABASE = path.join(__dirname, "./db/data.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// データストレージ（本来はDBを使用）
let ticketCounter = 1;
let currentCalledNumber = 0;
let congestionStatus = '普通'; // 空いている, 普通, 混雑, 非常に混雑

// by otoneko.
// let tickets = []; // 発券履歴
let tickets = fs.readJsonSync(DATABASE);

// 整理券発行API
app.post('/api/tickets', (req, res) => {
  try {
    const { name } = req.body;
    const ticketNumber = ticketCounter++;
    
    const ticket = {
      id: ticketNumber,
      name: name,
      issuedAt: new Date(),
      status: 'waiting'
    };
    
    tickets.push(ticket);
    fs.writeJSONSync(DATABASE, tickets, { spaces: 2 });
    
    console.log(`整理券発行: ${name} -> ${ticketNumber}`);
    
    res.json({ 
      success: true, 
      ticket: ticketNumber,
      waitingCount: ticketNumber - currentCalledNumber - 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '発券エラー' });
  }
});

// 現在の状況取得API
app.get('/api/status', (req, res) => {
  const remainingCount = Math.max(0, ticketCounter - 1 - currentCalledNumber);
  res.json({
    currentNumber: currentCalledNumber,
    lastIssuedNumber: ticketCounter - 1,
    remainingCount: remainingCount,
    congestionStatus: congestionStatus,
    waitingCount: remainingCount
  });
});

// 管理者：次の番号を呼び出し
app.post('/api/admin/call-next', (req, res) => {
  if (currentCalledNumber < ticketCounter - 1) {
    currentCalledNumber++;
    console.log(`番号呼び出し: ${currentCalledNumber}`);
    res.json({ 
      success: true, 
      calledNumber: currentCalledNumber,
      remainingCount: ticketCounter - 1 - currentCalledNumber
    });
  } else {
    res.json({ success: false, message: '呼び出す番号がありません' });
  }
});

// 管理者：混雑状況更新
app.post('/api/admin/congestion', (req, res) => {
  const { status } = req.body;
  congestionStatus = status;
  console.log(`混雑状況更新: ${status}`);
  res.json({ success: true, congestionStatus: status });
});

// 管理者：リセット
app.post('/api/admin/reset', (req, res) => {
  ticketCounter = 1;
  currentCalledNumber = 0;
  tickets = [];
  // by otoneko.
  fs.writeJsonSync(DATABASE, tickets, { spaces: 2 });
  congestionStatus = '普通';
  console.log('システムリセット');
  res.json({ success: true, message: 'リセット完了' });
});

app.listen(PORT, () => {
  console.log(`バックエンドサーバー起動: http://localhost:${PORT}`);
});