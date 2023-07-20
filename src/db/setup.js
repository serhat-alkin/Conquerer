const pool = require('./connection');

const setup = async () => {

  await pool.query('DROP TABLE IF EXISTS comments;');
  await pool.query('DROP TABLE IF EXISTS posts;');
  await pool.query('DROP TABLE IF EXISTS users;');
  
  await pool.query(`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      full_name VARCHAR(100),
      address VARCHAR(255),
      lat NUMERIC,
      long NUMERIC,
      email VARCHAR(255),
      username VARCHAR(50),
      password VARCHAR(255),
      session_token TEXT,
      session_token_expiration TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE posts (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      category VARCHAR(50),
      body TEXT,
      title VARCHAR(255),
      deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE comments (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      post_id UUID REFERENCES posts(id),
      body TEXT,
      deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created.');
};

setup();
