const express = require('express');
const Todo = require('../models/todo');
const auth = require('../middleware/auth');
const router = new express.Router();

router.get('/todos', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ author: req.user._id });
    res.send(todos);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/todos/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const todo = await Todo.findOne({ _id, author: req.user._id });

    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/todos', auth, async (req, res) => {
  const todo = new Todo({
    ...req.body,
    author: req.user._id
  });

  try {
    await todo.save();
    res.status(201).send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/todos/:id', auth, async (req, res) => {
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
    const todo = await Todo.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!todo) {
      return res.status(404).send();
    }

    updates.forEach(update => (todo[update] = req.body[update]));
    await todo.save();

    res.send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/todos/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }

    // await todo.remove();
    res.send(todo);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
