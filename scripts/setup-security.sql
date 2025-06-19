-- Enable Row Level Security
ALTER TABLE church_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON church_content
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to modify" ON church_content
    FOR ALL USING (auth.role() = 'authenticated');

-- For demo purposes, also allow anonymous modifications
-- In production, you'd want proper authentication
CREATE POLICY "Allow anonymous modifications for demo" ON church_content
    FOR ALL USING (true);
