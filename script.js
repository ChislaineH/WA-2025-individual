import songs from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const songsList = document.getElementById("songs-list");
  const songForm = document.getElementById("song-form");
  const searchBar = document.getElementById("search");
  const sortSelection = document.getElementById("sort");

  function formatDuration(duration) {
    const min = Math.floor(duration);
    const sec = Math.round((duration - min) * 100);
    
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

   // Set default sort to 'last-added'
   sortSelection.value = "last-added";

  function loadSongs(filteredSongs = songs) {
    songsList.innerHTML = "";

    const sortedSongs = sortSongs(filteredSongs); // Sort playlists by selected option
  
    sortedSongs.forEach((song, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
        <td>${song.name}</td>
        <td>${song.artist}</td>
        <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
        <td>${song.year}</td>
        <td>${formatDuration(song.duration)}</td>
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

  // Sort songs
  function sortSongs(songArray) {
    let sortedSongs = [...songArray];

    switch (sortSelection.value) {
      case "name-asc":
        return sortedSongs.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedSongs.sort((a, b) => b.name.localeCompare(a.name));
      case "artist-asc":
        return sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
      case "artist-desc":
        return sortedSongs.sort((a, b) => b.artist.localeCompare(a.artist));
      case "year-asc":
        return sortedSongs.sort((a, b) => a.year - b.year);
      case "year-desc":
        return sortedSongs.sort((a, b) => b.year - a.year);
      case "duration-asc":
        return sortedSongs.sort((a, b) => a.duration - b.duration);
      case "duration-desc":
        return sortedSongs.sort((a, b) => b.duration - a.duration);
      case "last-added":
      default:
        return [...sortedSongs].reverse();
    }
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

  // Event listeners
  searchBar.addEventListener("input", searchSongs);
  sortSelection.addEventListener("change", () => loadSongs());

  // Submit form
  if (songForm) {
    songForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const minutes = parseInt(document.getElementById("duration-minutes").value, 10);
      const seconds = parseInt(document.getElementById("duration-seconds").value, 10);

      if (isNaN(minutes) || isNaN(seconds || seconds >= 60)) {
        alert("Please enter a valid duration, seconds need to be between 0 and 59.");
        return;
      }
      
      const newSong = {
        name: document.getElementById("song-name").value.trim(),
        artist: document.getElementById("artist").value.trim(),
        otherArtist: document.getElementById("other-artists").value.trim(),
        year: document.getElementById("year").value.trim(),
        duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        image: "/img/music-note.jpg"
      };

      if (newSong.name && newSong.artist && newSong.year) {
        songs.push(newSong);
        localStorage.setItem("songs", JSON.stringify(songs));
        loadSongs();
        songForm.reset();
      }
    });
  }
  
  loadSongs();
});