const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo');
  console.log('Database connected');
}

const registeredSchema = new mongoose.Schema({
    email: String,
    password: String, // You should hash the password before saving it for security.
  });
  
const Registered = mongoose.model('Registered', registeredSchema);

const loginSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
const Login = mongoose.model('Login', loginSchema);
  

const contactSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  contactNumber: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  date: String,
  time: String,
  specialRequests: String,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

const server = express();

server.use(cors());
server.use(bodyParser.json());

// Handle reservation requests
server.post('/demo', async (req, res) => {
  const reservationData = req.body;

  try {
    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();
    console.log(savedReservation);
    res.json(savedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving the reservation.' });
  }
});

// Handle contact form submissions
server.post('/contact', async (req, res) => {
  const contactData = req.body;

  try {
    const contact = new Contact(contactData);
    const savedContact = await contact.save();
    console.log('Contact Form Submitted:', savedContact);
    res.json(savedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving the contact form data.' });
  }
});

// Handle registration requests
server.post('/register', async (req, res) => {
    const registrationData = req.body;
  
    try {
      const registered = new Registered(registrationData);
      const savedRegistered = await registered.save();
      console.log('Registration Successful:', savedRegistered);
      res.json(savedRegistered);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving the registration data.' });
    }
  });
  
// Handle login requests
server.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // First, check if the user exists for validation
      const user = await Registered.findOne({ email });
  
      if (user) {
        // In a real application, you should hash the stored password and compare it.
        if (user.password === password) {
          // Authentication succeeded
          // Create a new entry in the "logins" collection to store the login user
          const login = new Login({ email, password });
          const savedLogin = await login.save();
          console.log('Login Successful:', savedLogin);
          res.json({ message: 'Authentication succeeded' });
        } else {
          // Authentication failed
          res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        // Authentication failed
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error occurred during login.' });
    }
  });

  // Update a reservation
server.put('/reservation/:id', async (req, res) => {
    const reservationId = req.params.id;
    const updatedReservationData = req.body;
  
    try {
      // Find the reservation by ID and update its details
      const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updatedReservationData, { new: true });
      res.json(updatedReservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating reservation.' });
    }
  });
  
  // Delete a reservation
  server.delete('/reservation/:id', async (req, res) => {
    const reservationId = req.params.id;
  
    try {
      // Find the reservation by ID and delete it
      await Reservation.findByIdAndDelete(reservationId);
      res.json({ message: 'Reservation deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting reservation.' });
    }
  });
  


server.listen(8080, () => {
  console.log("Server started");
});
