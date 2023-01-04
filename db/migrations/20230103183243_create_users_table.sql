-- migrate:up
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	github_id VARCHAR(50) UNIQUE NOT NULL,
	name VARCHAR(50) NOT NULL,
	refresh_token VARCHAR(60) NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP
);
-- migrate:down
DROP TABLE users;
