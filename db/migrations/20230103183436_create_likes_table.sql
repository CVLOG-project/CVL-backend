-- migrate:up
CREATE TABLE likes(
	id SERIAL PRIMARY KEY,
	target VARCHAR(20) NOT NULL,
	target_id INT NOT NULL,
	user_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id)
);
-- migrate:down
DROP TABLE likes;
