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

module.exports = tagsRouter;
