const cors = require('cors');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors({
  origin: "http://127.0.0.1:5500" // for cross-origin requests
}));
app.use(express.json());

// Functions for reading and writing songs data
const dataJSONFile = "data.json";
const readSongs = () => JSON.parse(fs.readFileSync(dataJSONFile, "utf8"));
const writeSongs = (songData) => fs.writeFileSync(dataJSONFile, JSON.stringify(songData, null, 2));

// Get all songs
app.get('/songs', (req, res) => {
  const songData = readSongs();
  res.json(songData.songs);
});

// Get song by ID
app.get("/songs/:id", (req, res) => {
  const songData = readSongs();
  const song = songData.songs.find((song) => song.id === Number(req.params.id));

  if (!song) {
    return res.status(404).json({
      error: "Song not found"
    });
  }

  res.json(song);
});

// Post new song
app.post("/songs", (req, res) => {
  const songData = readSongs();

  // Convert IDs to numbers and check what is the highest ID
  const highestId = songData.songs.reduce((maxId, song) => {
    return Math.max(maxId, parseInt(song.id, 10));
  }, 0);
  const newId = (highestId + 1).toString();
  const newSong = { id: newId, ...req.body };

  // Add new song
  songData.songs.push(newSong);
  writeSongs(songData);

  // Response new song
  res.status(201).json(newSong);
});

// Update song by ID
app.put("/songs/:id", (req, res) => {
  const songData = readSongs();
  const songIndex = songData.songs.findIndex((song) => song.id === Number(req.params.id));

  // songIndex will be -1 when song not found
  if (songIndex === -1) {
    return res.status(404).json({
      error: "Song not found"
    });
  }

  // Update song
  songData.songs[songIndex] = { ...songData.songs[songIndex], ...req.body };
  writeSongs(songData);

  // Response updated song
  res.json(songData.songs[songIndex]);
});

// Delete song by ID
app.delete("/songs/:id", (req, res) => {
  const songIdToDelete = req.params.id;
  const songData = readSongs();
  const songIndex = songData.songs.findIndex((song) => {
    return song.id === songIdToDelete
  });

  // Check if song exists
  if (songIndex === -1) {
    return res.status(404).json({
      error: "Song not found"
    });
  }

  // Update songs
  songData.songs.splice(songIndex, 1);
  writeSongs(songData);

  // Response deleted song
  res.json({ message: "Song deleted"});
})

app.listen(port, () => {
  console.log(`Server runs on http://localhost:${port}`);
})