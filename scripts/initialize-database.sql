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

-- Insert initial data (using UPSERT to avoid conflicts)
INSERT INTO church_content (content_type, data) VALUES 
('hero', '{
  "type": "image",
  "src": "/placeholder.svg?height=400&width=1200",
  "alt": "Revival Saturdays Banner"
}'),
('event_details', '{
  "title": "Revival Saturdays",
  "subtitle": "Join us for powerful worship and spiritual renewal",
  "date": "Every Saturday",
  "time": "6:00 PM - 8:00 PM",
  "venue": "Christ Temple East Main Auditorium",
  "description": "Experience the power of God in our weekly revival services. Come as you are and be transformed!"
}'),
('bus_schedule', '{
  "generalNotes": "All buses depart 30 minutes after service ends. Please arrive 15 minutes before boarding time.",
  "areas": [
    {
      "id": "1",
      "name": "Adenta Area",
      "terminals": [
        {"id": "1", "name": "Adenta Barrier", "buses": 2, "boardingTime": "4:30 PM", "departureTime": "5:00 PM"},
        {"id": "2", "name": "Frafraha Junction", "buses": 1, "boardingTime": "4:45 PM", "departureTime": "5:15 PM"}
      ]
    },
    {
      "id": "2",
      "name": "East Legon Area",
      "terminals": [
        {"id": "3", "name": "East Legon Junction", "buses": 3, "boardingTime": "4:15 PM", "departureTime": "4:45 PM"},
        {"id": "4", "name": "American House", "buses": 2, "boardingTime": "4:30 PM", "departureTime": "5:00 PM"}
      ]
    },
    {
      "id": "3",
      "name": "Tema Area",
      "terminals": [
        {"id": "5", "name": "Tema Station", "buses": 2, "boardingTime": "4:00 PM", "departureTime": "4:30 PM"},
        {"id": "6", "name": "Community 1 Market", "buses": 1, "boardingTime": "4:15 PM", "departureTime": "4:45 PM"}
      ]
    }
  ]
}'),
('footer', '{
  "churchName": "Christ Temple East",
  "location": "Accra, Ghana",
  "address": "123 Liberation Road, East Legon, Accra",
  "phone": "+233 24 123 4567",
  "email": "info@christtempleeast.org",
  "links": [
    {"name": "About Us", "url": "/about"},
    {"name": "Events", "url": "/events"},
    {"name": "Contact", "url": "/contact"},
    {"name": "FAQs", "url": "/faqs"}
  ]
}')
ON CONFLICT (content_type) DO UPDATE SET
  data = EXCLUDED.data,
  updated_at = NOW();
