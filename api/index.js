// // api/index.js

// const express = require("express");
// const apiRouter = express.Router();

// const usersRouter = require("./users");
// const postsRouter = require("./posts");
// const tagsRouter = require("./tags");

// apiRouter.use("/users", usersRouter);
// apiRouter.use("/posts", postsRouter);
// apiRouter.use("/tags", tagsRouter);

// module.exports = apiRouter;

// const jwt = require("jsonwebtoken");
// const { getUserById, getUserByUsername } = require("../db");
// const { JWT_SECRET } = process.env;

// apiRouter.use((req, res, next) => {
//   if (req.user) {
//     console.log("User is set:", req.user);
//   }

//   next();
// });

// // set `req.user` if possible
// apiRouter.use(async (req, res, next) => {
//   const prefix = "Bearer ";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     next();
//   } else if (auth.startsWith(prefix)) {
//     // 'Bearer token' -> 'Bearer token'.slice(7) -> 'token'
//     const token = auth.slice(prefix.length);

//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);

//       if (id) {
//         req.user = await getUserById(id);
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must start with ${prefix}`,
//     });
//   }
// });

// apiRouter.use((req, res, next) => {
//   if (req.user) {
//     console.log("User is set: ", req.user);
//   }

//   next();
// });

// apiRouter.use((error, req, res, next) => {
//   res.send({
//     name: error.name,
//     message: error.message,
//   });
// });

// module.exports = apiRouter;

const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const tagsRouter = require("./tags");

const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

module.exports = apiRouter;

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }

  next();
});

// token middleware to verify and attach user object
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    // 'Bearer token' -> 'Bearer token'.slice(7) -> 'token'
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// these are middleware!
apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/tags", tagsRouter);

// this is our error handling middleware for the apiRouter
apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});
