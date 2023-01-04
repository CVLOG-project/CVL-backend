-- migrate:up
CREATE TABLE videos(
	id SERIAL PRIMARY KEY,
	owner VARCHAR(20) NOT NULL,
	owner_id INT NOT NULL,
	video_url TEXT NOT NULL
);
-- migrate:down
DROP TABLE videos;
