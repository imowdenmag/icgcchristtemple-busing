-- Enable Row Level Security
ALTER TABLE church_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view the website)
CREATE POLICY "Public read access" ON church_content
    FOR SELECT USING (true);

-- Allow all operations for demo (in production, restrict to authenticated admins)
CREATE POLICY "Admin full access" ON church_content
    FOR ALL USING (true);
