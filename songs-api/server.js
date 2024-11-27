const express = require('express');
const app = express();
const { getAllSongs } = require('./controllers/songsController');
const cors = require('cors');


// Ensure JSON parsing is enabled
app.use(express.json());
app.use(cors());
// Add a simple test route to ensure the server is running
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.post('/api/songs/list', getAllSongs);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
