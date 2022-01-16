const express = require("express");
const tagsRouter = express.Router();
const { getAllTags } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags: tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  try {
    let tags = await getAllTags();
    return (
      tags,
      res.send({
        posts: tags,
      })
    );
  } catch ({ name, message }) {
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;
