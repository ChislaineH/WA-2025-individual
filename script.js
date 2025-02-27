import songs from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const songsList = document.getElementById("songs-list");
  const songForm = document.getElementById("song-form");
  const searchBar = document.getElementById("search");

  function loadSongs(filteredSongs = songs) {
    songsList.innerHTML = "";
  
    filteredSongs.forEach((song, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
        <td>${song.name}</td>
        <td>${song.artist}</td>
        <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
        <td>${song.year}</td>
        <td>${song.duration}</td>
        <td><button class="delete-btn" data-index="${index}">X</button></td>
      `;
      songsList.appendChild(row);
    });

    // Delete event listener
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        songs.splice(index, 1);
        localStorage.setItem("songs", JSON.stringify(songs));
        loadSongs();
      });
    })
  }

  // Search
  function searchSongs() {
    const searchValue = searchBar.value.toLowerCase();
    const filteredSongs = songs.filter((song) =>
      song.name.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      (Array.isArray(song.otherArtist) ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue)) : song.otherArtist?.toLowerCase().includes(searchValue))
    );
    loadSongs(filteredSongs);
  }

  // Search event listener
  searchBar.addEventListener("input", searchSongs);

  // Submit form
  if (songForm) {
    songForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newSong = {
        name: document.getElementById("song-name").value.trim(),
        artist: document.getElementById("artist").value.trim(),
        otherArtist: document.getElementById("other-artists").value.trim(),
        year: document.getElementById("year").value.trim(),
        duration: document.getElementById("duration").value.trim(),
        image: "/img/music-note.jpg"
      };

      if (newSong.name && newSong.artist && newSong.year && newSong.duration) {
        songs.push(newSong);
        localStorage.setItem("songs", JSON.stringify(songs));
        loadSongs();
        songForm.reset();
      }
    });
  }
  
  loadSongs();
});