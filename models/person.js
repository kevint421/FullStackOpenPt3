const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


mongoose.set('useCreateIndex', true);


/* Connect to MongoDB */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });


/* Define data model */
const phonebookSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) => (
        /* The phone number must contain at least 8 digits */
        value.replace(/[^0-9]/g, '').length >= 8
      ),
    },
  },
});
phonebookSchema.plugin(uniqueValidator);
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


module.exports = mongoose.model('Person', phonebookSchema);




