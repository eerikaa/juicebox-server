const { client, getAllUsers, createUser } = require("./index");

async function testDB() {
  try {
    const users = await getAllUsers();
    console.log(users);
  } catch (err) {
    console.error(err);
  }
}

async function dropTables() {
  try {
    await client.query(`
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
        password VARCHAR(255) NOT NULL
        );
    `);

    console.log("finished seeding tables!");
  } catch (err) {
    throw err;
  }
}

async function createInitialUsers() {
  try {
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });
    const albert2 = await createUser({
      username: "albert",
      password: "bertie999",
    });

    console.log(albert);
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
  } catch (err) {
    console.error(err);
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
