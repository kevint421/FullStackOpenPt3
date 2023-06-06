const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());

const combinedFormat = ':method :url :status :res[content-length] - :response-time ms :postData';
app.use(morgan(combinedFormat));

morgan.token('postData', (req) => {
  return JSON.stringify(req.body);
});

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
  

app.get('/info', (req, res) => {
    const requestTime = new Date();
    const entryCount = persons.length;
    const responseText = `<p>Request received at: ${requestTime}</p><p>Number of entries in the phonebook: ${entryCount}</p>`;
    res.send(responseText);
  });
  

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
  });
  
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(person => person.id))
      : 0;
    return Math.floor(Math.random() * (1000000 - maxId) + maxId + 1);
  };
  
  app.post('/api/persons', (req, res) => {
    const body = req.body;
  
    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'Name or number missing'
      });
    }
  
    const existingPerson = persons.find(person => person.name === body.name);
    if (existingPerson) {
      return res.status(400).json({
        error: 'Name must be unique'
      });
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    };
  
    persons = persons.concat(person);
  
    res.json(person);
  });
  
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


