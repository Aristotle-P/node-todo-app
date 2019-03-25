const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, configDb } = require('./fixtures/db');

beforeEach(configDb);

test('Should sign up a new user', async () => {
  const res = await request(app)
    .post('/users')
    .send({
      name: 'Aristotle',
      email: 'example@example.com',
      password: 'mypass123'
    })
    .expect(201);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();
  expect(user.password).not.toBe('mypass123');

  expect(res.body).toMatchObject({
    user: {
      name: 'Aristotle',
      email: 'example@example.com'
    },
    token: user.tokens[0].token
  });
});

test('Should log in existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).not.toBeNull();
  expect(user.tokens[1].token).toBe(res.body.token);
});

test('Should not log in nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'myemail@example.com',
      password: '1234567'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete profile for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update user profile', async () => {
  const res = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Ryan' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('Ryan');
});

test('Should not update invalid fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Florida' })
    .expect(400);
});
