const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('./connection');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

const populateDatabase = async () => {
  let users = [];
  let userIds = [];
  for (let i = 0; i < 20; i++) {
    let hashedPassword = await hashPassword(`password${i+1}`);
    let id = uuidv4();
    users.push(`('${id}', 'User${i+1}', 'Address${i+1}', ${50.00+i}, ${40.00+i}, 'user${i+1}@example.com', 'username${i+1}', '${hashedPassword}')`);
    userIds.push(id);
  }
  await pool.query(`INSERT INTO users (id, full_name, address, lat, long, email, username, password) VALUES ${users.join(", ")}`);

  const categories = ["Artificial Intelligence", "Business", "Money", "Technology"];

  let posts = [];
  let postIds = [];
  for (let i = 0; i < 10; i++) {
    let id = uuidv4();
    let category = categories[Math.floor(Math.random() * categories.length)];
    posts.push(`('${id}', '${userIds[i]}', '${category}', 'Body Text ${i+1}', 'Title ${i+1}')`);
    postIds.push(id);
  }
  await pool.query(`INSERT INTO posts (id, user_id, category, body, title) VALUES ${posts.join(", ")}`);

  let comments = [];
  for (let i = 0; i < 7; i++) {
    comments.push(`('${uuidv4()}', '${userIds[i]}', '${postIds[i]}', 'Comment Text ${i+1}')`);
  }
  await pool.query(`INSERT INTO comments (id, user_id, post_id, body) VALUES ${comments.join(", ")}`);
  console.log('Data created.');
};

populateDatabase();
