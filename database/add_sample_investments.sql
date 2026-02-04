-- Add Sample Investments with Real Stock Tickers
-- Run this in Supabase SQL Editor to populate the investments table

-- Insert sample investments
INSERT INTO investments (name, type, ticker_symbol, current_price, return_1y, return_3y, return_5y, volatility_score, liquidity_score, rating_stars, rating_grade)
VALUES
-- Technology Stocks
('Apple Inc.', 'Stock', 'AAPL', 175.43, 25.5, 42.3, 120.5, 3.2, 4.8, 4.5, 'A'),
('Microsoft Corporation', 'Stock', 'MSFT', 370.24, 31.2, 55.8, 145.2, 2.8, 4.9, 4.8, 'A+'),
('Alphabet Inc. (Google)', 'Stock', 'GOOGL', 142.65, 28.4, 48.9, 115.3, 3.5, 4.7, 4.6, 'A'),
('Amazon.com Inc.', 'Stock', 'AMZN', 155.82, 22.8, 38.5, 95.6, 4.1, 4.9, 4.4, 'A'),
('Tesla Inc.', 'Stock', 'TSLA', 185.36, 18.5, 85.6, 425.8, 5.2, 4.5, 3.8, 'B+'),

-- Indian Stocks (NSE)
('Reliance Industries', 'Stock', 'RELIANCE.NS', 2450.50, 15.3, 28.5, 62.4, 3.8, 4.6, 4.3, 'A'),
('Tata Consultancy Services', 'Stock', 'TCS.NS', 3650.75, 12.8, 32.1, 85.3, 2.5, 4.7, 4.7, 'A+'),
('Infosys Limited', 'Stock', 'INFY.NS', 1425.30, 10.5, 25.8, 68.9, 2.9, 4.6, 4.5, 'A'),
('HDFC Bank', 'Stock', 'HDFCBANK.NS', 1580.40, 14.2, 30.5, 75.2, 3.1, 4.8, 4.6, 'A'),
('ITC Limited', 'Stock', 'ITC.NS', 425.60, 8.5, 18.3, 45.7, 2.2, 4.5, 4.2, 'A-'),

-- ETFs
('SPDR S&P 500 ETF', 'ETF', 'SPY', 445.82, 24.5, 42.8, 98.5, 2.1, 5.0, 4.7, 'A+'),
('Invesco QQQ Trust', 'ETF', 'QQQ', 385.45, 32.8, 58.3, 142.7, 3.2, 4.9, 4.5, 'A');

-- Verify the data
SELECT id, name, ticker_symbol, current_price, rating_stars, rating_grade 
FROM investments 
ORDER BY rating_stars DESC;
