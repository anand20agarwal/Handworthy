const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
require('dotenv').config();  // ✅ Load .env variables

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);  // ✅ Mount your routes

mongoose.connect('mongodb+srv://agarwalanand1802:agarwalanand1802@cluster0.cqdhvkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
