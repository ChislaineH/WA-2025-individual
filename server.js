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
const readData = () => JSON.parse(fs.readFileSync(dataJSONFile, "utf8"));
const writeData = (data) => fs.writeFileSync(dataJSONFile, JSON.stringify(data, null, 2));

// SONGS API
// Get all songs
app.get('/songs', (req, res) => {
  const songData = readData();
  res.json(songData.songs);
});

// Get song by ID
app.get("/songs/:id", (req, res) => {
  const songData = readData();
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
  const songData = readData();
  const maxID = Math.max(...songData.songs.map(song => song.id), 0); // Get max ID from songData
  const newSong = { id: maxID + 1, ...req.body };

  // Add new song
  songData.songs.push(newSong);
  writeData(songData);

  // Response new song
  res.status(201).json(newSong);
});

// Update song by ID
app.put("/songs/:id", (req, res) => {
  const songData = readData();
  const songIndex = songData.songs.findIndex((song) => song.id === Number(req.params.id));

  // songIndex will be -1 when song not found
  if (songIndex === -1) {
    return res.status(404).json({
      error: "Song not found"
    });
  }

  // Update song
  songData.songs[songIndex] = { ...songData.songs[songIndex], ...req.body };
  writeData(songData);

  // Response updated song
  res.json(songData.songs[songIndex]);
});

// Delete song by ID
app.delete("/songs/:id", (req, res) => {
  const songData = readData();
  const song = songData.songs.find((song) => song.id === Number(req.params.id));

  // Check if song exists
  if (!song) {
    return res.status(404).json({
      error: "Song not found"
    });
  }

  // Update songs
  const newSongsData = songData.songs.filter((song) => song.id !== Number(req.params.id));
  writeData({ songs: newSongsData });

  // Response deleted song
  res.json({ message: "Song deleted"});
})

// PLAYLISTS API
// Get all playlists
app.get('/playlists', (req, res) => {
  const playlistData = readData();
  res.json(playlistData.playlists);
});

// Get playlist by ID
app.get("/playlists/:id", (req, res) => {
  const playlistData = readData();
  const playlist = playlistData.playlists.find((playlist) => playlist.id === Number(req.params.id));

  if (!playlist) {
    return res.status(404).json({
      error: "Playlist not found"
    });
  }

  res.json(playlist);
});

// Post new playlist
app.post("/playlists", (req, res) => {
  const playlistData = readData();
  const { name, image } = req.body;

  const duplicatePlaylist = playlistData.playlists.find((playlist) => playlist.name.toLowerCase() === name.toLowerCase());

  if (duplicatePlaylist) {
    return res.status(400).json({
      error: "Playlist already exists"
    });
  }

  const maxID = Math.max(...playlistData.playlists.map(playlist => playlist.id), 0); // Get max ID from playlistData
  const newPlaylist = { id: maxID + 1, name, image, songs: [] };

  // Add new playlist
  playlistData.playlists.push(newPlaylist);
  writeData(playlistData);

  // Response new playlist
  res.status(201).json(newPlaylist);
});

// Delete playlist by ID
app.delete("/playlists/:id", (req, res) => {
  const playlistData = readData();
  const playlist = playlistData.playlists.findIndex((playlist) => playlist.id === Number(req.params.id));

  // playlistIndex will be -1 when playlist not found
  if (!playlist) {
    return res.status(404).json({
      error: "Playlist not found"
    });
  }

  // Remove playlist
  const newPlaylistData = playlistData.playlists.filter((playlist) => playlist.id !== Number(req.params.id));
  writeData({ ...playlistData, playlists: newPlaylistData });

  // Response deleted playlist
  res.json({ message: "Playlist deleted" });
});

app.listen(port, () => {
  console.log(`Server runs on http://localhost:${port}`);
})