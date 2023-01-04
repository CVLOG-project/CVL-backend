-- migrate:up
CREATE TABLE posts_tags(
    id SERIAL NOT NULL,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
-- migrate:down
DROP TABLE posts_tags;
