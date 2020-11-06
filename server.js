const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const app = express();

connectDB();

app.use(cors());
app.options('*', cors());
app.use(express.json({extended: false}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
  });
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/project', require('./routes/api/project'));
app.use('/api/serialization', require('./routes/api/serialization'));
app.use('/api/annotation', require('./routes/api/annotation'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
