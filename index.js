const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT } = require('./config');
const Person = require('./models/person');


const app = express();


app.use(cors());
app.use(express.static('build'));
app.use(express.json());


morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.static('build'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
       tokens.url(req, res),
       tokens.status(req, res),
       tokens.method(req, res),
       tokens['response-time'](req, res), 'ms',
       tokens.res(req, res, 'content-length'), '-',
       req.method === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))
app.use(express.json())

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return res.status(400).json({ error: 'Malformed ID' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});


app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;


  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});


app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;


  const person = new Person({
    name,
    number,
  });


  person.save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;


  const updatedPerson = {
    name,
    number,
  };


  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});


app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;


  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




