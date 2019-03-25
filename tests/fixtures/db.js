const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Todo = require('../../src/models/todo');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'John',
  email: 'john@example.com',
  password: 'johnspass',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Ryan',
  email: 'ryan@example.com',
  password: 'ryanspass',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const todoOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First todo',
  completed: false,
  author: userOneId
};

const todoTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second todo',
  completed: true,
  author: userOneId
};

const todoThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Three todo',
  completed: false,
  author: userTwoId
};

const configDb = async () => {
  await User.deleteMany();
  await Todo.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Todo(todoOne).save();
  await new Todo(todoTwo).save();
  await new Todo(todoThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  todoOne,
  todoTwo,
  todoThree,
  configDb
};
