const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'consultations.json');

// data 폴더 생성
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// JSON 파일 DB
function readDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 미들웨어
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 상담 접수 API
app.post('/api/consult', (req, res) => {
  const { clinic, name, phone, cases, interest, memo, submitted_at } = req.body;

  if (!clinic || !name || !phone) {
    return res.status(400).json({ error: '필수 항목을 입력해주세요.' });
  }

  const rows = readDB();
  const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;

  rows.push({
    id: newId,
    clinic,
    name,
    phone,
    cases: cases || '',
    interest: interest || [],
    memo: memo || '',
    submitted_at: submitted_at || new Date().toISOString()
  });

  writeDB(rows);
  res.json({ success: true });
});

// 관리자 API — 접수 목록
app.get('/api/admin/consultations', (req, res) => {
  const rows = readDB().reverse();
  res.json(rows);
});

// 관리자 API — 삭제
app.delete('/api/admin/consultations/:id', (req, res) => {
  const rows = readDB().filter(r => r.id !== Number(req.params.id));
  writeDB(rows);
  res.json({ success: true });
});

// 관리자 페이지
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
  console.log(`랜딩페이지: http://localhost:${PORT}`);
  console.log(`관리자페이지: http://localhost:${PORT}/admin`);
});
