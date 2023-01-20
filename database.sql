CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE authentication;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT UNIQUE,
  user_password TEXT,
  user_type TEXT,
  created_date  TIMESTAMP DEFAULT NOW()
);


CREATE TABLE liveTv(
  channel_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_name TEXT NOT NULL UNIQUE,
  channel_URL TEXT,
  channel_icon_url TEXT,
  channel_created_date  TIMESTAMP DEFAULT NOW()
);


CREATE TABLE vod(
  vod_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vod_name TEXT NOT NULL UNIQUE,
  vod_URL TEXT,
  vod_image_url TEXT,
  vod_relese_date DATE,
  vod_created_date  TIMESTAMP DEFAULT NOW()
);


CREATE TABLE series(
  series_id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  series_name VARCHAR(100) UNIQUE NOT NULL,
  series_relese_date DATE,
  series_details VARCHAR(500) NOT NULL,
  series_created_date  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE episodes(
  episodes_id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  series_id INTEGER REFERENCES series(series_id),
  episodes_name VARCHAR(100) NOT NULL,
  episodes_url VARCHAR NOT NULL,
  episodes_icon_url VARCHAR,
  episodes_relese_date DATE,
  episodes_created_date  TIMESTAMP DEFAULT NOW()
);


SELECT * FROM users;

INSERT INTO users (user_name,user_email,user_password) VALUES ('Bob','bob@email.com','bob');

--psql -U postgres
--\c authentication
--\dt
--heroku pg:psql
