-- migrate:up
CREATE OR REPLACE FUNCTION update_time()
RETURNS TRIGGER AS $$
BEGIN 
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- migrate:down

