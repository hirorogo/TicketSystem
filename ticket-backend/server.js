const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 整理券発行API
app.post('/api/tickets', (req, res) => {
  try {
    const { name } = req.body;
    const ticketNumber = Math.floor(Math.random() * 1000) + 1;
    
    console.log(`整理券発行: ${name} -> ${ticketNumber}`);
    
    res.json({ 
      success: true, 
      ticket: ticketNumber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '発券エラー' });
  }
});

app.listen(PORT, () => {
  console.log(`バックエンドサーバー起動: http://localhost:${PORT}`);
});