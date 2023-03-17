CREATE TABLE IF NOT EXISTS users(
    user_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(user_id),
    score INT NOT NULL DEFAULT 0,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL, 
    password VARCHAR(30) NOT NULL, 
    postcode VARCHAR(10), 
    image_path VARCHAR(100),
    is_staff INT NOT NULL DEFAULT 0
);



CREATE TABLE IF NOT EXISTS litter_locations(
    litter_location_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(litter_location_id),
    user_id INT,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
    recommended_volunteer_count INT, 
    `coordinate` POINT NOT NULL,
    is_clean INT NOT NULL DEFAULT 0,
    image_path VARCHAR(100)
); -- ENGINE=InnoDB; -- depends on the configuration of PHPMyAdmin 

CREATE TABLE IF NOT EXISTS volunteers(
    volunteer_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(volunteer_id),
    user_id INT, 
    litter_location_id INT, 
    CONSTRAINT FK_volunteer_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    CONSTRAINT FK_litter_location_id FOREIGN KEY (litter_location_id) REFERENCES litter_locations(litter_location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts(
    post_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(post_id), 
    user_id INT,
    CONSTRAINT FK_user_poster_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    title VARCHAR(50) NOT NULL,
    timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
    image_path VARCHAR(100) NOT NULL,
    content VARCHAR(500) NOT NULL
); 

CREATE TABLE IF NOT EXISTS comments(
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    post_id INT,
    CONSTRAINT FK_user_commenter_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    CONSTRAINT FK_post_id FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id), 
    timestamp_posted TIMESTAMP NOT NULL DEFAULT NOW(),
    content VARCHAR(100) NOT NULL
);

-- INSERT INTO `users`(`user_id`, `score`, `firstname`, `lastname`, `email`, `password`, `postcode`, `image_path`, `is_staff`) VALUES (DEFAULT, 1,'ross','lecturer','ross@ip3.com','password','postcode','',1)
