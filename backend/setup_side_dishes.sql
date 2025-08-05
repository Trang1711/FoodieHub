-- Tạo bảng side_dishes cho SQLite
CREATE TABLE IF NOT EXISTS side_dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  main_dish_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  FOREIGN KEY (main_dish_id) REFERENCES foods (id)
); 