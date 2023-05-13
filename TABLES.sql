set search_path = public;

CREATE TABLE users(
id int PRIMARY KEY NOT NULL,
username varchar(255) UNIQUE NOT NULL,
email varchar(255) NOT NULL,
password varchar(255) NOT NULL,
created TIMESTAMP NOT NULL
);

CREATE TABLE posts(
id int PRIMARY KEY NOT NULL,
created_by varchar(255) NOT NULL,
title varchar(255) NOT NULL,
body varchar(255) NOT NULL,
created TIMESTAMP NOT NULL
);

CREATE TABLE otp(
id int PRIMARY KEY NOT NULL,
username varchar(255) NOT NULL,
otp varchar(255) NOT NULL,
created TIMESTAMP NOT NULL
);
