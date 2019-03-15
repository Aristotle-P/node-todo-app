const express = require('express');

require('./db/mongoose');
const userRouter = require('./routers/user');
const todoRouter = require('./routers/todo');

const app = express();
const port = 3000;

app.use(express.json());
app.use(userRouter);
app.use(todoRouter);

app.listen(port, () => {
  console.log(`Server up on ${port}`);
});
