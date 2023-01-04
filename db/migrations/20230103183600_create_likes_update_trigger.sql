-- migrate:up
CREATE TRIGGER update_trigger
BEFORE UPDATE ON likes
FOR EACH ROW
EXECUTE PROCEDURE update_time()

-- migrate:down

