-- import to SQLite by running: sqlite3.exe db.sqlite3 -init sqlite.sql

PRAGMA journal_mode = MEMORY;
PRAGMA synchronous = OFF;
PRAGMA foreign_keys = OFF;
PRAGMA ignore_check_constraints = OFF;
PRAGMA auto_vacuum = NONE;
PRAGMA secure_delete = OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users(
user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
score INTEGER NOT NULL DEFAULT 0,
firstname TEXT NOT NULL,
lastname TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
postcode TEXT,
image_path TEXT,
is_staff INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS litter_locations(
litter_location_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
timestamp_posted REAL,
recommended_volunteer_count INTEGER DEFAULT 0,
'coordinate' REAL NOT NULL,
is_clean INTEGER NOT NULL DEFAULT 0,
image_path TEXT
);
CREATE TABLE IF NOT EXISTS volunteers(
volunteer_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
litter_location_id INTEGER NOT NULL,
user_id INTEGER NOT NULL, 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (litter_location_id) REFERENCES litter_locations(litter_location_id) ON DELETE CASCADE,
);
CREATE TABLE IF NOT EXISTS posts(
post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
title TEXT NOT NULL,
timestamp_posted REAL,
image_path TEXT NOT NULL,
content TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS comments(
comment_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
post_id INTEGER AUTOINCREMENT,
user_id INTEGER NOT NULL,
post_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
timestamp_posted REAL,
content TEXT NOT NULL
);





COMMIT;
PRAGMA ignore_check_constraints = ON;
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
