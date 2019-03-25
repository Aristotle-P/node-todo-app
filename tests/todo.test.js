const request = require('supertest');
const app = require('../src/app');
const Todo = require('../src/models/todo');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  todoOne,
  todoTwo,
  todoThree,
  configDb
} = require('./fixtures/db');

beforeEach(configDb);

test('Should create todo for user', async () => {
  const res = await request(app)
    .post('/todos')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'From my test' })
    .expect(201);

  const todo = await Todo.findById(res.body._id);
  expect(todo).not.toBeNull();
  expect(todo.completed).toBe(false);
});

test('Should get all todos for a user', async () => {
  const res = await request(app)
    .get('/todos')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});

test('Should fail to delete todo created by other user', async () => {});
