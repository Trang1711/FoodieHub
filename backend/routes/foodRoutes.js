const express = require('express');
const router = express.Router();
const { getConnection } = require('../database_sqlite');

// Lấy tất cả foods
router.get('/', (req, res) => {
  const db = getConnection();
  
  db.all('SELECT * FROM foods WHERE is_available = 1 ORDER BY rating DESC', (err, foods) => {
    if (err) {
      console.error('❌ Lỗi lấy foods:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server, vui lòng thử lại sau'
      });
    }
    
    res.json({
      success: true,
      data: foods
    });
  });
});

// Lấy foods theo category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const db = getConnection();
  
  db.all('SELECT * FROM foods WHERE category = ? AND is_available = 1 ORDER BY rating DESC', 
    [category], (err, foods) => {
    if (err) {
      console.error('❌ Lỗi lấy foods theo category:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server, vui lòng thử lại sau'
      });
    }
    
    res.json({
      success: true,
      data: foods
    });
  });
});

// Lấy chi tiết food
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getConnection();
  
  db.get('SELECT * FROM foods WHERE id = ? AND is_available = 1', [id], (err, food) => {
    if (err) {
      console.error('❌ Lỗi lấy food:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server, vui lòng thử lại sau'
      });
    }
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn'
      });
    }
    
    res.json({
      success: true,
      data: food
    });
  });
});

// Tìm kiếm foods
router.get('/search/:keyword', (req, res) => {
  const { keyword } = req.params;
  const db = getConnection();
  
  db.all('SELECT * FROM foods WHERE (name LIKE ? OR description LIKE ?) AND is_available = 1 ORDER BY rating DESC', 
    [`%${keyword}%`, `%${keyword}%`], (err, foods) => {
    if (err) {
      console.error('❌ Lỗi tìm kiếm foods:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server, vui lòng thử lại sau'
      });
    }
    
    res.json({
      success: true,
      data: foods
    });
  });
});

// Lấy side dishes cho một món ăn
router.get('/:id/side-dishes', (req, res) => {
  const { id } = req.params;
  const db = getConnection();
  
  db.all('SELECT * FROM side_dishes WHERE main_dish_id = ?', [id], (err, sideDishes) => {
    if (err) {
      console.error('❌ Lỗi lấy side dishes:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server, vui lòng thử lại sau'
      });
    }
    
    res.json({
      success: true,
      data: sideDishes
    });
  });
});

module.exports = router; 