-- Tạo database food_delivery
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'food_delivery')
BEGIN
    CREATE DATABASE food_delivery;
END
GO

USE food_delivery;
GO

-- Tạo bảng users
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar VARCHAR(500),
        address TEXT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    
    PRINT 'Bảng users đã được tạo thành công!';
END
ELSE
BEGIN
    PRINT 'Bảng users đã tồn tại!';
END
GO

-- Tạo index cho email để tìm kiếm nhanh hơn
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_users_email')
BEGIN
    CREATE INDEX IX_users_email ON users(email);
    PRINT 'Index cho email đã được tạo!';
END
GO

-- Tạo stored procedure để tìm user theo email
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUserByEmail')
BEGIN
    EXEC('
        CREATE PROCEDURE sp_GetUserByEmail
            @email VARCHAR(255)
        AS
        BEGIN
            SELECT * FROM users WHERE email = @email;
        END
    ');
    PRINT 'Stored procedure sp_GetUserByEmail đã được tạo!';
END
GO

-- Tạo stored procedure để tạo user mới
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateUser')
BEGIN
    EXEC('
        CREATE PROCEDURE sp_CreateUser
            @email VARCHAR(255),
            @password VARCHAR(255),
            @full_name VARCHAR(255),
            @phone VARCHAR(20) = NULL,
            @address TEXT = NULL
        AS
        BEGIN
            INSERT INTO users (email, password, full_name, phone, address)
            OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.created_at
            VALUES (@email, @password, @full_name, @phone, @address);
        END
    ');
    PRINT 'Stored procedure sp_CreateUser đã được tạo!';
END
GO

-- Tạo stored procedure để cập nhật user
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateUser')
BEGIN
    EXEC('
        CREATE PROCEDURE sp_UpdateUser
            @id INT,
            @full_name VARCHAR(255),
            @phone VARCHAR(20) = NULL,
            @address TEXT = NULL
        AS
        BEGIN
            UPDATE users 
            SET full_name = @full_name, 
                phone = @phone, 
                address = @address, 
                updated_at = GETDATE()
            OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.phone, INSERTED.address
            WHERE id = @id;
        END
    ');
    PRINT 'Stored procedure sp_UpdateUser đã được tạo!';
END
GO

PRINT 'Database setup hoàn thành!';
PRINT 'Database: food_delivery';
PRINT 'Bảng: users';
PRINT 'Stored Procedures: sp_GetUserByEmail, sp_CreateUser, sp_UpdateUser'; 