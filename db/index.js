const { Client } = require("pg");
const client = new Client(`postgres://localhost:5432/juicebox-dev`);

module.exports = {
  client,
  getAllUsers,
  createUser,
};

async function getAllUsers() {
  const { rows } = await client.query(`
    select id, username from users;
  `);

  return rows;
}

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      insert into users (username, password)
      values ($1, $2)
      on conflict (username) do nothing
      returning *;
    `,
      [username, password]
    );

    return user;
  } catch (err) {
    throw err;
  }
}
