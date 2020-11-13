const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware/auth');
const app = express();

connectDB();

app.use(cors());
app.options('*', cors());
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
app.use(express.json({extended: false}));   
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/users', require('./routes/api/users'));
app.get('/checkToken', withAuth, (req, res) => res.sendStatus(200));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/project', require('./routes/api/project'));
app.use('/api/serialization', require('./routes/api/serialization'));
app.use('/api/annotation', require('./routes/api/annotation'));
app.use('/api/pdf', require('./routes/api/pdf'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
