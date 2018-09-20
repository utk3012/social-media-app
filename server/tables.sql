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
	liked char(1),
	public char(1),
	PRIMARY KEY (post_id),
	FOREIGN KEY (poster_id) references users(id)
);

create TABLE friends (
	friend_id int NOT NULL AUTO_INCREMENT,
	user1 int NOT NULL,
	user2 int NOT NULL,
	PRIMARY KEY (friend_id),
	FOREIGN KEY (user1) references users(id),
	FOREIGN KEy (user2) references users(id)
);