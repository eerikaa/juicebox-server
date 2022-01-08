const { Client } = require("pg");
const { rows } = require("pg/lib/defaults");
const client = new Client(`postgres://localhost:5432/juicebox-dev`);

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
};

///////////
/* USERS */
///////////

async function getAllUsers() {
  const { rows } = await client.query(`
    select id, username, name, location from users;
  `);

  return rows;
}

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      insert into users (username, password, name, location)
      values ($1, $2, $3, $4)
      on conflict (username) do nothing
      returning *;
    `,
      [username, password, name, location]
    );

    return user;
  } catch (err) {
    throw err;
  }
}

async function updateUser(id, fields = {}) {
  // key = ownerId, postgres will lowercase this by default
  // so we want to wrap it in quotes so that we don't lose the field!
  // ex, "username"=$1
  // ['"username"=$1', ...] -> we need to join these so that we have string to stick in our SQL query!
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      update users
      set ${setString}
      where id=${id}
      returning *;
    `,
      Object.values(fields) // this expression returns an array, so we're good :)
    );

    return user;
  } catch (err) {
    throw err;
  }
}

async function getUserById(userId) {
  // first get the user (NOTE: Remember the query returns
  // (1) an object that contains
  // (2) a `rows` array that (in this case) will contain
  // (3) one object, which is our user.
  const {
    rows: [user],
  } = await client.query(`
    select id, name, username, location from users
    where id=${userId};
  `);

  // if it doesn't exist (if there are no `rows` or `rows.length`), return null
  if (!user || (user && !user.id)) {
    return;
  }

  // if it does:
  // delete the 'password' key from the returned object
  // get their posts (use getPostsByUser)
  const posts = await getPostsByUser(user.id);

  // then add the posts to the user object with key 'posts'
  user.posts = posts;

  // return the user object
  return user;
}

///////////
/* POSTS */
///////////

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      insert into posts ("authorId", title, content)
      values ($1, $2, $3)
      returning *;
    `,
      [authorId, title, content]
    );

    return post;
  } catch (err) {
    throw err;
  }
}

async function updatePost(id, fields = { title, content, active }) {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}"=$${idx + 1}`)
      .join(", ");

    if (setString.length === 0) {
      return;
    }

    try {
      const {
        rows: [post],
      } = await client.query(
        `
      update posts
      set ${setString}
      where id=${id}
      returning *;
    `,
        Object.values(fields) // this expression returns an array, so we're good :)
      );

      return post;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
      select * from posts;
    `);

    return rows;
  } catch (err) {
    throw err;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      select * from posts
      where posts."authorId"=${userId};
    `);

    return rows;
  } catch (err) {
    throw err;
  }
}
