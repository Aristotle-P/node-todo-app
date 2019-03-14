const express = require('express');

require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: 'Attempted to update invalid fields.' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.send(todos);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/todos/:id', async (req, res) => {
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

app.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);

  try {
    await todo.save();
    res.status(201).send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch('/todos/:id', async (req, res) => {
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

app.delete('/todos/:id', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server up on ${port}`);
});
