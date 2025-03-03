import songs from "./data.js";

const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
const songsList = document.getElementById("songs-list");
const songForm = document.getElementById("song-form");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");

document.addEventListener("DOMContentLoaded", () => {
  // Pagination
  const songsPerPage = 5;
  let currentPage = 1;

  // Load list from all songs
  function loadSongs(filteredSongs = [...songs, ...savedSongs]) {
    songsList.innerHTML = "";

    const sortedSongs = sortSongs(filteredSongs); // Sort playlists by selected option
    const start = (currentPage - 1) * songsPerPage;
    const end = start + songsPerPage;
    const paginatedSongs = sortedSongs.slice(start, end);
  
    paginatedSongs.forEach((song, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><button class="add-to-playlist-btn" song-index="${start + index}">+</button></td>
        <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
        <td>${song.name}</td>
        <td>${song.artist}</td>
        <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
        <td>${song.year}</td>
        <td>${formatDuration(song.duration)}</td>
        <td><button class="delete-btn" data-index="${start + index}">X</button></td>
      `;
      songsList.appendChild(row);
    });

    updatePagination(filteredSongs.length);

    deleteEventListener();
    addToPlaylistEventListener();
  }

  // Delete event listener
  function deleteEventListener() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"), 10);
        const songToDelete = index < songs.length ? songs[index] : savedSongs[index - songs.length];
  
        if (index >= songs.length) {  
          // Delete from localStorage
          let updatedSavedSongs = savedSongs.filter((song) =>
            song.name !== songToDelete.name || song.artist !== songToDelete.artist
          );
  
          // Update localStorage
          localStorage.setItem("songs", JSON.stringify(updatedSavedSongs));
  
          // Delete from localStorage array
          savedSongs.splice(0, savedSongs.length, ...updatedSavedSongs);
        }
  
        loadSongs();
      });
    });
  }
  
  //  Add song to playlist event listener
  function addToPlaylistEventListener() {
    document.querySelectorAll(".add-to-playlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const songIndex = e.target.getAttribute("song-index");
        const song = songIndex < songs.length ? songs[songIndex] : savedSongs[songIndex - songs.length];

        addToPlaylist(song);
      });
    });
  }

  // Add song to existing or new playlist
  function addToPlaylist(song) {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    let playlistName = prompt("Type existing playlist or remain empty to create new playlist...");

    if (!playlistName) {
      playlistName = prompt("Type name for new playlist: ");
      if (!playlistName) return;

      playlists.push({ name: playlistName, songs: [] });
    }

    // Search the playlist
    let playlist = playlists.find((p) => p.name.toLowerCase() === playlistName.toLowerCase());

    if (!playlist) {
      alert("Playlist not found");
      return;
    }

    // Check if song already in playlist
    if (playlist.songs.some(s => s.name.toLowerCase() === song.name.toLowerCase() && s.artist.toLowerCase() === song.artist.toLowerCase())) {
      alert("Song already in playlist");
      return;
    }

    // Add song to playlist
    playlist.songs.push(song);
    localStorage.setItem("playlists", JSON.stringify(playlists));

    alert(`${song.name} is added to ${playlist.name}`);
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

  // Update pagination
  function updatePagination(totalSongs) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalSongs / songsPerPage);
    if (totalPages <= 1) return; // No pagination when only 1 page

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("pagination-btn");

      if (i === currentPage) { 
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentPage = i;
        loadSongs();
      });
      paginationContainer.appendChild(button);
    }
  }

  // Format duration
  function formatDuration(duration) {
    const totalSeconds = Math.round(duration * 60);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  // Search
  function searchSongs() {
    const searchValue = searchBar.value.toLowerCase();
    const filteredSongs = [...songs, ...savedSongs].filter((song) =>
      song.name.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      (Array.isArray(song.otherArtist) ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue)) : song.otherArtist?.toLowerCase().includes(searchValue))
    );
    return filteredSongs;
  }

  // Search event listener
  searchBar.addEventListener("input", searchSongs);

  // Sort event listener
  sortSelection.addEventListener("change", () => loadSongs());

  // Submit form (add song)
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
        duration: minutes + seconds / 60,
        image: "/img/music-note.jpg"
      };

      // If song is new (name/artist/otherArtist) add to localStorage
      if (newSong.name && newSong.artist && newSong.year) {
        savedSongs.push(newSong);
        localStorage.setItem("songs", JSON.stringify(savedSongs));

        if (typeof loadArtists === "function") {
          loadArtists();
        }

        // Update artists list in localStorage
        let artists = JSON.parse(localStorage.getItem("artists")) || [];

        if (!artists.includes(newSong.artist)) {
          artists.push(newSong.artist);
        }
        
        if (newSong.otherArtist) {
          let otherArtists = newSong.otherArtist.split(",").map(artist => artist.trim());
          otherArtists.forEach(artist => {
            if (artist && !artists.includes(artist)) {
              artists.push(artist);
            }
          });
        }

        localStorage.setItem("artists", JSON.stringify(artists));

        loadSongs();
        songForm.reset();
      }
    });
  }
  
  loadSongs();
});