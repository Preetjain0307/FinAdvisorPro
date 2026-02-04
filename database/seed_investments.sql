-- Seed popular Indian investments with realistic data

-- Top Stocks
INSERT INTO public.investments (name, type, ticker_symbol, current_price, return_1y, return_3y, return_5y, volatility_score, liquidity_score, rating_stars, rating_grade)
VALUES
  ('Reliance Industries', 'Stock', 'RELIANCE.NS', 2456.75, 12.5, 38.4, 82.3, 35, 95, 4.2, 'A'),
  ('TCS (Tata Consultancy)', 'Stock', 'TCS.NS', 3678.90, 8.2, 28.6, 65.4, 28, 92, 4.0, 'A'),
  ('HDFC Bank', 'Stock', 'HDFCBANK.NS', 1587.30, 15.8, 42.1, 95.7, 32, 98, 4.5, 'A+'),
  ('Infosys', 'Stock', 'INFY.NS', 1456.20, 9.4, 31.2, 72.8, 30, 90, 4.1, 'A'),
  ('ICICI Bank', 'Stock', 'ICICIBANK.NS', 1023.45, 18.3, 48.5, 102.4, 38, 96, 4.3, 'A'),
  ('Bharti Airtel', 'Stock', 'BHARTIARTL.NS', 1234.80, 22.5, 55.2, 120.5, 42, 88, 4.4, 'A'),
  ('State Bank of India', 'Stock', 'SBIN.NS', 678.90, 16.4, 45.3, 88.6, 45, 85, 3.9, 'B+'),
  ('Asian Paints', 'Stock', 'ASIANPAINT.NS', 3124.50, 7.8, 25.4, 58.3, 25, 80, 3.8, 'B+'),
  ('Bajaj Finance', 'Stock', 'BAJFINANCE.NS', 7234.25, 14.2, 40.8, 92.5, 48, 75, 4.0, 'A'),
  ('HCL Technologies', 'Stock', 'HCLTECH.NS', 1342.60, 11.3, 34.5, 78.2, 33, 87, 3.9, 'B+'),
  
-- Mutual Funds
  ('SBI Bluechip Fund', 'Mutual Fund', 'SBI-BLUECHIP', 87.45, 13.5, 42.8, 98.3, 25, 100, 4.4, 'A'),
  ('HDFC Mid-Cap Opportunities', 'Mutual Fund', 'HDFC-MIDCAP', 132.80, 18.7, 52.4, 124.6, 42, 95, 4.3, 'A'),
  ('ICICI Prudential Value Discovery', 'Mutual Fund', 'ICICI-VALUE', 245.30, 16.2, 48.3, 112.5, 38, 98, 4.2, 'A'),
  ('Axis Long Term Equity', 'Mutual Fund', 'AXIS-LONGTERM', 98.60, 14.8, 45.7, 105.8, 35, 97, 4.3, 'A'),
  ('Mirae Asset Large Cap', 'Mutual Fund', 'MIRAE-LARGECAP', 76.25, 12.3, 39.5, 89.4, 28, 100, 4.1, 'A'),
  ('Parag Parikh Flexi Cap', 'Mutual Fund', 'PPFAS-FLEXI', 54.90, 19.5, 58.2, 135.7, 40, 92, 4.5, 'A+'),
  
-- Gold & Bonds
  ('Gold ETF - SBI', 'Gold', 'GOLDSHARE.NS', 56.78, 11.2, 28.5, 62.3, 18, 100, 3.7, 'B+'),
  ('Sovereign Gold Bond 2024', 'Bond', 'SGB-2024', 6234.50, 10.5, 25.8, 58.4, 12, 85, 3.9, 'B+'),
  ('HDFC Corporate Bond Fund', 'Bond', 'HDFC-CORPBOND', 23.45, 7.2, 22.4, 48.5, 15, 95, 3.5, 'B'),
  ('ICICI Gilt Fund', 'Bond', 'ICICI-GILT', 34.80, 6.8, 21.2, 45.8, 12, 98, 3.4, 'B'),
  
-- ETFs & Index Funds
  ('Nifty 50 ETF', 'Mutual Fund', 'NIFTYBEES.NS', 245.30, 13.2, 41.5, 94.2, 22, 100, 4.2, 'A'),
  ('Bank Nifty ETF', 'Mutual Fund', 'BANKBEES.NS', 478.90, 16.8, 48.3, 109.5, 35, 98, 4.1, 'A'),
  ('Nifty Next 50 ETF', 'Mutual Fund', 'JUNIORBEES.NS', 652.40, 15.4, 46.2, 105.3, 38, 95, 4.0, 'A'),
  
-- Fixed Deposits (simulated as investments)
  ('SBI Fixed Deposit 5Y', 'FD', 'SBI-FD-5Y', 100.00, 6.5, 20.1, 41.5, 5, 100, 3.2, 'C+'),
  ('HDFC Bank FD 3Y', 'FD', 'HDFC-FD-3Y', 100.00, 6.8, 21.2, 43.8, 5, 100, 3.3, 'C+'),
  
-- International
  ('Motilal Nasdaq 100 FOF', 'Mutual Fund', 'MOTILAL-NASDAQ', 45.80, 24.5, 68.3, 156.8, 52, 88, 4.2, 'A'),
  ('Edelweiss US Technology Equity', 'Mutual Fund', 'EDELWEISS-USTECH', 32.60, 28.3, 75.4, 172.5, 58, 85, 4.0, 'A'),
  
-- Debt Funds
  ('IDFC Corporate Bond Fund', 'Bond', 'IDFC-CORPBOND', 18.90, 7.5, 23.2, 49.8, 10, 97, 3.6, 'B'),
  ('Aditya Birla Dynamic Bond', 'Bond', 'ABSL-DYNAMIC', 28.45, 8.1, 24.8, 52.4, 18, 95, 3.7, 'B+'),
  ('Kotak Banking & PSU Debt', 'Bond', 'KOTAK-PSU', 56.30, 7.8, 24.2, 51.5, 12, 98, 3.6, 'B');

-- Verify insert
SELECT COUNT(*) FROM public.investments;
