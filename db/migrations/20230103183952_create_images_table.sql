-- migrate:up
CREATE TABLE images(
	id SERIAL PRIMARY KEY,
	owner VARCHAR(20) NOT NULL,
	owner_id INT NOT NULL,
	image_url TEXT NOT NULL
)
-- migrate:down
DROP TABLE images;
