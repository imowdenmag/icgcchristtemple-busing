-- Create the main content table
CREATE TABLE IF NOT EXISTS church_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on content_type for faster queries
CREATE INDEX IF NOT EXISTS idx_church_content_type ON church_content(content_type);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_church_content_updated_at ON church_content;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_church_content_updated_at
    BEFORE UPDATE ON church_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create admin users table for additional user management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create trigger for admin_users updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS content_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on content_type and changed_at for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_log_content_type ON content_audit_log(content_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON content_audit_log(changed_at);
