const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoutes = require('./routes/api');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 启用 CORS
app.use(cors());

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));