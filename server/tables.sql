create DATABASE social;

create TABLE users (
	id int NOT NULL AUTO_INCREMENT,
    email varchar(255) not null,
    password varchar(500) not null,
    PRIMARY KEY (id)
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
	post_date date,
	PRIMARY KEY (post_id),
	FOREIGN KEY (poster_id) references users(id)
);