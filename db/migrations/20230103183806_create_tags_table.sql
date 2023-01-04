-- migrate:up
CREATE TABLE tags(
	id SERIAL PRIMARY KEY,
	name VARCHAR(200) NULL
);
-- migrate:down
DROP TABLE tags;
