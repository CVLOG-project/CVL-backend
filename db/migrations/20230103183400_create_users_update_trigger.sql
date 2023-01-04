-- migrate:up
CREATE TRIGGER update_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_time();

-- migrate:down

