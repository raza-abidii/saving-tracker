-- Create the savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  target_price DECIMAL(10, 2) NOT NULL,
  weekly_savings DECIMAL(10, 2) NOT NULL,
  current_savings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- NOTE: For production, you should implement proper authentication
-- and create policies that restrict access to authenticated users only
CREATE POLICY "Allow all operations for now" 
ON savings_goals 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Optional: Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_savings_goals_created_at 
ON savings_goals(created_at DESC);

-- Optional: Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_savings_goals_updated_at
BEFORE UPDATE ON savings_goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
