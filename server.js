const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", async (req, res, next) => {
  try {
    const accounts = await db.select("*").from("accounts");
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

server.get("/:id", async (req, res, next) => {
  try {
    const accountById = await db
      .first("*")
      .from("accounts")
      .where({ id: req.params.id });
    res.json(accountById);
  } catch (error) {
    next(error);
  }
});

server.post("/", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget
    };

    const [id] = await db.select("*").from("accounts").insert(payload);
    const newAccount = await db.select("*").from("accounts").where("id", id).first();
    res.json(newAccount);
  } catch (error) {
    next(error);
  }
});

server.put("/:id", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget
    };
    await db.select("*").from('accounts').where("id", req.params.id).update(payload);
    const updatedAccount = await db.select("*").from('accounts').where("id", req.params.id);
    res.json(updatedAccount)
  } catch (error) {
    next(error);
  }
});

server.delete("/:id", async (req, res, next) => {
  try {
    await db
      .select("*")
      .from("accounts")
      .where("id", req.params.id)
      .del();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = server;
