const path = require('path');
const fs = require('fs');

// Controller to list all songs
const getAllSongs = (req, res) => {
    try {
        const { cardID } = req.body;
        if (!cardID) {
            return res.status(400).json({ error: 'cardID is required' });
        }

        const songsDirectory = path.join(__dirname, `../${cardID}`);
        console.log(songsDirectory);

        fs.readdir(songsDirectory, (err, files) => {
            if (err) {
                console.error("Error reading directory:", err);
                return res.status(500).json({ error: 'Unable to scan directory' });
            }
            res.json({ songs: files });
        });
    } catch (error) {
        console.error("Error in getAllSongs:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller to play a specific song
// const playSong = (req, res) => {
//     try {
//         const { cardID, songName } = req.body;
//         if (!cardID || !songName) {
//             return res.status(400).json({ error: 'cardID and songName are required' });
//         }

//         const songPath = path.join(__dirname, `../${cardID}`, songName);
        
//         // Check if the song exists
//         fs.access(songPath, fs.constants.F_OK, (err) => {
//             if (err) {
//                 console.error("Song not found:", err);
//                 return res.status(404).json({ error: 'Song not found' });
//             }

//             // Set headers and send the file as a stream
//             res.setHeader('Content-Type', 'audio/mpeg');
//             const songStream = fs.createReadStream(songPath);
//             songStream.pipe(res);
//         });
//     } catch (error) {
//         console.error("Error in playSong:", error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

module.exports = {
    getAllSongs,
    // playSong
};
