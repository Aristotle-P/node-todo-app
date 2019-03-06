const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todo-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});

const Todo = mongoose.model('Todo', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});
