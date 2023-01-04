-- migrate:up
CREATE TABLE categories(
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);
-- migrate:down
DROP TABLE categories;