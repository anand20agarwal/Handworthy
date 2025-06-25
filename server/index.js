const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // ✅ CORRECT IMPORT

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://agarwalanand1802:agarwalanand1802@cluster0.cqdhvkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

app.use('/api/users', userRoutes); // ✅ MOUNT ROUTES PROPERLY

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
