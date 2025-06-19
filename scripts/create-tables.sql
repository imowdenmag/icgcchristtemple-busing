-- Drop existing table if it exists (for development)
DROP TABLE IF EXISTS church_content CASCADE;

-- Create the main content table
CREATE TABLE church_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on content_type for faster queries
CREATE INDEX idx_church_content_type ON church_content(content_type);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_church_content_updated_at
    BEFORE UPDATE ON church_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
