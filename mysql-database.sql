-- import to SQLite by running: sqlite3.exe db.sqlite3 -init sqlite.sql

PRAGMA journal_mode = MEMORY;
PRAGMA synchronous = OFF;
PRAGMA foreign_keys = OFF;
PRAGMA ignore_check_constraints = OFF;
PRAGMA auto_vacuum = NONE;
PRAGMA secure_delete = OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users(
PRIMARY KEY(user_id),
score INT NOT NULL DEFAULT 0,
firstname TEXT NOT NULL,
lastname TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
postcode TEXT,
image_path TEXT,
is_staff INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS litter_locations(
litter_location_id INT NOT NULL ,
PRIMARY KEY(litter_location_id),
CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
recommended_volunteer_count INT,
`coordinate` POINT NOT NULL,
is_clean INT NOT NULL DEFAULT 0,
image_path TEXT
);
CREATE TABLE IF NOT EXISTS volunteers(
volunteer_id INT NOT NULL ,
PRIMARY KEY(volunteer_id),
litter_location_id INT,
CONSTRAINT FK_volunteer_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
CONSTRAINT FK_litter_location_id FOREIGN KEY (litter_location_id) REFERENCES litter_locations(litter_location_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS posts(
post_id INT NOT NULL ,
PRIMARY KEY(post_id),
CONSTRAINT FK_user_poster_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
title TEXT NOT NULL,
timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
image_path TEXT NOT NULL,
content TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS comments(
comment_id INT NOT NULL ,
post_id INT,
CONSTRAINT FK_user_commenter_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
CONSTRAINT FK_post_id FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
PRIMARY KEY (comment_id),
timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
content TEXT NOT NULL
);





COMMIT;
PRAGMA ignore_check_constraints = ON;
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
