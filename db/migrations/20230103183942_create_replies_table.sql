-- migrate:up
CREATE TABLE replies(
	id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	user_id INT NOT NULL,
	coment_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (coment_id) REFERENCES coments(id)
);
-- migrate:down
DROP TABLE replies;
