const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
} = require("./index");

async function testDB() {
  try {
    const users = await getAllUsers();
    console.log({ users });

    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log({ updateUserResult });

    const posts = await getAllPosts();
    console.log({ posts });

    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log({ updatePostResult });

    const albert = await getUserById(1);
    console.log({ albert, albertPosts: albert.posts });
  } catch (err) {
    console.error(err);
  }
}

async function dropTables() {
  try {
    await client.query(`
      drop table if exists posts;
      drop table if exists users;
    `);

    console.log("finished dropping tables!");
  } catch (err) {
    throw err;
  }
}

async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
        );

      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("finished seeding tables!");
  } catch (err) {
    throw err;
  }
}

async function createInitialUsers() {
  try {
    await createUser({
      username: "albert",
      password: "bertie99",
      name: "albert",
      location: "washington",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "sandra",
      location: "maine",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "glamgal",
      location: "oklahoma",
    });
  } catch (err) {
    throw err;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log({ albert });

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post, I hope you love my post!",
    });
    await createPost({
      authorId: albert.id,
      title: "Second Post",
      content: "This is my second post, I hope you really love this one!",
    });
    await createPost({
      authorId: sandra.id,
      title: "First Post",
      content: "This is my first post, I hope you love my post!",
    });
    await createPost({
      authorId: glamgal.id,
      title: "First Post",
      content: "This is my first post, I hope you love my post!",
    });
  } catch (err) {
    throw err;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (err) {
    console.error(err);
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
