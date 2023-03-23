// Ignore this file for now, as we have decided to stop using SQL 

const sqllite = require("sqlite3").verbose()
/*
const database = new sqlite.Database("./littermap.db", sqlite.OPEN_READWRITE, err => {
    if (err) return console.error(err.message)
}) 
*/
const database = new sqllite.Database(':memory:');

// [todo] maybe add a command line argument to allow this to be optional? 
console.log("Dropping database")
database.run("DROP TABLE IF EXISTS users;")
database.run("DROP TABLE IF EXISTS litter_locations;")

console.log("Creating users table")
database.run(`CREATE TABLE IF NOT EXISTS users(
user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
score INTEGER NOT NULL DEFAULT 0,
firstname TEXT NOT NULL,
lastname TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
postcode TEXT,
image_path TEXT,
is_staff INTEGER NOT NULL DEFAULT 0
);`)

console.log("Creating litter_locations table")

//database.get("PRAGMA foreign_keys = ON")
database.run(`CREATE TABLE IF NOT EXISTS litter_locations(
litter_location_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
timestamp_posted TEXT,
recommended_volunteer_count INTEGER,
'coordinate' REAL NOT NULL,
is_clean INTEGER NOT NULL DEFAULT 0,
image_path TEXT
);`)

