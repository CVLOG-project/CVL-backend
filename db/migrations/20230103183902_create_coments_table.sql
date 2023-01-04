-- migrate:up
CREATE TABLE coments(
	id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	user_id INT NOT NULL,
	post_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (post_id) REFERENCES posts(id)
);
-- migrate:down
DROP TABLE coments;
