const express = require('express');
const dotenv = require('dotenv');

const cors = require('cors'); 
const connectDB = require('./config/db');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


connectDB().catch((err) => {
  console.error(`Database connection failed: ${err.message}`);
  process.exit(1); 
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
