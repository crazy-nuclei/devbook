const express = require('express');
const connectDB = require('./config/db');
const app = express();

// connect to database 
connectDB();

app.get('/', (req, res) => res.send('API running '));

// init middleware
app.use(express.json({ extended: false }));

// routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

//listen on port
app.listen(PORT, () => console.log(`listening on port ${PORT}`));