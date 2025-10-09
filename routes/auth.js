const express = require('express');
const router = express.Router();

// ví dụ route đơn giản
router.get('/', (req, res) => {
    res.send('Auth route working!');
});

// xuất router ra ngoài để server.js sử dụng
module.exports = router;
