require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes=require('./routes/leavesRoutes')


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB(process.env.MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);


app.get('/', (req, res) => res.send('Leave Management API running'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);

});
