-- Remove non-speaking categories from blog
-- IELTS EQ focuses exclusively on speaking skills

DELETE FROM "BlogCategory" WHERE slug IN ('listening', 'reading', 'writing');
