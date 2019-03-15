const express = require('express');
const { Todo } = require('../models/todo');
const router = new express.Router();

router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.send(todos);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/todos/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const todo = await Todo.findById(_id);

    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);

  try {
    await todo.save();
    res.status(201).send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/todos/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: 'Attempted to update invalid fields.' });
  }

  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
