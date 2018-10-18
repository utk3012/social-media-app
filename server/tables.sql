create DATABASE social;

create TABLE users (
	id int NOT NULL AUTO_INCREMENT,
	username varchar(50),
    email varchar(255) NOT NULL,
    password varchar(64) NOT NULL,
    PRIMARY KEY (id, username)
);

create TABLE info (
	id int,
	name varchar(255),
	place varchar(255),
	info varchar(255),
	birthday varchar(20),
	image varchar(200),
	FOREIGN KEY (id) references users(id)
);

create TABLE posts (
	post_id int NOT NULL AUTO_INCREMENT,
	poster_id int,
	post varchar(1000),
	post_date datetime,
	public char(1),
	PRIMARY KEY (post_id),
	FOREIGN KEY (poster_id) references users(id)
);

create TABLE friends (
	friend_id int NOT NULL AUTO_INCREMENT,
	user1 int NOT NULL,   --requester
	user2 int NOT NULL,	  -- accepter
	time_stamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (friend_id),
	FOREIGN KEY (user1) references users(id),
	FOREIGN KEy (user2) references users(id)
);

create TABLE requests (
	req_id int NOT NULL AUTO_INCREMENT,
	user1 int NOT NULL,   -- from
	user2 int NOT NULL,	  -- for
	time_stamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	accepted char(1),
	PRIMARY KEY (req_id),
	FOREIGN KEY (user1) references users(id),
	FOREIGN KEY (user2) references users(id)
);

CREATE TABLE messages (
	mess_id int NOT NULL AUTO_INCREMENT,
	s_id int NOT NULL,
	r_id int NOT NULL,
	dts datetime NOT NULL,
	seen char(1),
	msg varchar(500),
	PRIMARY KEY (mess_id),
	FOREIGN KEY (s_id) references users(id),
	FOREIGN KEY (r_id) references users(id)	
);

create TABLE liked (
	post_id int,
	user_id int,
	time_stamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (post_id, user_id),
	FOREIGN KEY (post_id) references posts(post_id),
	FOREIGN KEY (user_id) references users(id)		
);

DELIMITER $$
CREATE PROCEDURE likePost (IN postId int, IN userId int)
	BEGIN
		IF (SELECT exists (SELECT 1 FROM liked where post_id = postId and user_id = userId)) THEN
			DELETE FROM liked where post_id = postId and userId = userId;
		ELSE
			INSERT into liked(post_id, user_id) values (postId, userId);
		END IF;
	END$$

DELIMITER $$
CREATE TRIGGER requestAccepted
AFTER INSERT ON friends
FOR EACH ROW
BEGIN
	UPDATE requests SET accepted = 1 WHERE requests.user1 = NEW.user1 and requests.user2 = NEW.user2;
END$$



