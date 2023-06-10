const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('Password is missing or incorrect');
  process.exit(1);
} else if (process.argv.length === 4) {
  console.log('Phone number is missing');
  process.exit(1);
}


const password = process.argv[2];
const dbname = 'phonebook'; 
const url = `mongodb+srv://kevintcolleges:${password}@phonebook.gt3jc5u.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });


const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

if (process.argv.length === 3) {
  
  Person.find({}).then((result) => {
    console.log('Phonebook:');
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`Added "${process.argv[3]}" with number "${process.argv[4]}" to phone book`);
    mongoose.connection.close();
  });
}




