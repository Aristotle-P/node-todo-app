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

test('Should not create todo with invalid values', async () => {
  await request(app)
    .post('/todos')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: false, completed: 'A string' })
    .expect(400);
});

test('Should not update a todo with invalid values', async () => {
  await request(app)
    .patch(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: false, completed: 'A string' })
    .expect(400);

  expect(todoOne.description).toBe('First todo');
});

test('Should not update other users todos', async () => {
  await request(app)
    .patch(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({ description: 'An updated todo', completed: true })
    .expect(404);

  expect(todoOne.description).toBe('First todo');
});

test('Should get all todos for a user', async () => {
  const res = await request(app)
    .get('/todos')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});

test('Should fetch only completed tasks', async () => {
  const res = await request(app)
    .get('/todos?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(1);
});

test('Should fetch only uncompleted tasks', async () => {
  const res = await request(app)
    .get('/todos?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(1);
});

test('Should get todo by id', async () => {
  const res = await request(app)
    .get(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const todo = await Todo.findById(todoOne._id);
  expect(todo.description).toBe(res.body.description);
});

test('Should not get todo other users todos', async () => {
  const res = await request(app)
    .get(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test('Should not get todos if unauthenticated', async () => {
  const res = await request(app)
    .get(`/todos/${todoOne._id}`)
    .send()
    .expect(401);

  expect(res.body).toEqual({ error: 'Please authenticate.' });
});

test('Should delete todo', async () => {
  await request(app)
    .delete(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const todo = await Todo.findById(todoOne._id);
  expect(todo).toBeNull();
});

test('Should not delete todo if unauthenticated', async () => {
  await request(app)
    .delete(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const todo = await Todo.findById(todoOne._id);
  expect(todo).not.toBeNull();
});

test('Should fail to delete todo created by other user', async () => {
  await request(app)
    .delete(`/todos/${todoOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const todo = await Todo.findById(todoOne._id);
  expect(todo).not.toBeNull();
});
