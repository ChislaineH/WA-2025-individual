import songs from "./data.js";

function getPlaylistFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("playlist");
}

function loadPlaylistSongs() {
  const playlistName = getPlaylistFromURL();
  if (!playlistName) {
    window.location.href = "playlists.html";
    return;
  }

  function searchPlaylistSongs() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const songsList = document.getElementById("playlist-songs-list");
  
    songsList.innerHTML = "";
  
    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    const playlist = playlists.find((p) => p.name === playlistName);
  
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      songsList.innerHTML = `<tr><td colspan="6" style="text-align:center;">No songs yet in this playlist...</td></tr>`;
      return;
    }

    const playlistSongs = songs.filter((song) => playlist.songs.includes(song.name)); // Get songs from playlist

    const filteredSongs = sortPlaylistSongs(playlistSongs.filter((song) => 
      song.name.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      (Array.isArray(song.otherArtist) 
        ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue)) 
        : song.otherArtist?.toLowerCase().includes(searchValue)) ||
      song.year.toString().includes(searchValue) ||
      formatDuration(song.duration).toLowerCase().includes(searchValue)
    ));

    if (filteredSongs.length === 0) {
      songsList.innerHTML = `<tr><td colspan="6" style="text-align:center;">No matching songs found...</td></tr>`;
      return;
    }

    filteredSongs.forEach((song, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
        <td>${song.name}</td>
        <td>${song.artist}</td>
        <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
        <td>${song.year}</td>
        <td>${formatDuration(song.duration)}</td>
        <td><button class="delete-btn" data-song="${song.name}">X</button></td>
      `;
      songsList.appendChild(row);
    });

    // Delete event listener
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", function() {
        const songName = this.getAttribute("data-song");
        deleteSong(songName);
      });
    });
  };

  // Search event listener
  document.getElementById("search").addEventListener("input", searchPlaylistSongs);

  // Sort event listener
  document.getElementById("sort").addEventListener("change", searchPlaylistSongs);

  document.getElementById("playlist-name").textContent = playlistName;

  const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
  const playlist = playlists.find((p) => p.name === playlistName);

  const playlistImg = document.getElementById("playlist-img"); 
  playlistImg.src = playlist?.image || "/img/music-note.jpg";

  function formatDuration(duration) {
    const totalSeconds = Math.round(duration * 60);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  searchPlaylistSongs();
};

function deleteSong(songName) {
  const playlistName = getPlaylistFromURL();
  const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
  const playlist = playlists.find((p) => p.name === playlistName);

  if (!playlist) return;

  // Delete from playlist
  playlist.songs = playlist.songs.filter((song) => song !== songName);

  // Update localStorage
  localStorage.setItem("playlists", JSON.stringify(playlists));

  loadPlaylistSongs();
}

document.addEventListener("DOMContentLoaded", loadPlaylistSongs);

function sortPlaylistSongs(songArray) {
  let sortedSongs = [...songArray];
  const sortSelection = document.getElementById("sort");

  switch (sortSelection.value) {
    case "name-asc":
      return sortedSongs.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sortedSongs.sort((a, b) => b.name.localeCompare(a.name));
    case "artist-asc":
      return sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
    case "artist-desc":
      return sortedSongs.sort((a, b) => b.artist.localeCompare(a.artist));
    case "other-artist-asc":
      return sortedSongs.sort((a, b) => {
        const otherA = Array.isArray(a.otherArtist) ? a.otherArtist.join(", ") : a.otherArtist || "";
        const otherB = Array.isArray(b.otherArtist) ? b.otherArtist.join(", ") : b.otherArtist || "";
        return otherA.localeCompare(otherB);
      });
    case "other-artist-desc":
      return sortedSongs.sort((a, b) => {
        const otherA = Array.isArray(a.otherArtist) ? a.otherArtist.join(", ") : a.otherArtist || "";
        const otherB = Array.isArray(b.otherArtist) ? b.otherArtist.join(", ") : b.otherArtist || "";
        return otherB.localeCompare(otherA);
      });
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

function loadAvailableSongs() {
  const songSelect = document.getElementById("song-select");
  const searchInput = document.getElementById("song-search");

  if (!songSelect || !searchInput) return;

  songSelect.innerHTML = "";

  const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
  const playlistName = getPlaylistFromURL();
  const playlist = playlists.find((p) => p.name === playlistName);

  let availableSongs = [...songs];

  if (playlist) {
    availableSongs = availableSongs.filter(song => !((playlist?.songs ?? []).includes(song.name)));
  }

  function fillDropdown(filter = "") {
    songSelect.innerHTML = "";

    // Filter songs in dropdownmenu (name, artist or otherArtist)
    let filteredSongs = availableSongs.filter(song => {
      const searchValue = filter.toLowerCase();
      return (
        song.name.toLowerCase().includes(searchValue) ||
        song.artist.toLowerCase().includes(searchValue) ||
        (Array.isArray(song.otherArtist)
          ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue))
          : (song.otherArtist && typeof song.otherArtist === "string"
            ? song.otherArtist.toLowerCase().includes(searchValue)
            : false)
          )
      );
    });

    if (filteredSongs.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No matching songs found";
      option.disabled = true;
      songSelect.appendChild(option);
      return;
    }

    filteredSongs.forEach(song => {
      const option = document.createElement("option");
      option.value = song.name;
      option.textContent = `${song.name} - ${song.artist}`;
      songSelect.appendChild(option);
    });
  }

  // Filter list when user types in search dropdown
  searchInput.addEventListener("input", () => {
    fillDropdown(searchInput.value);
  });

  fillDropdown();
}

document.addEventListener("DOMContentLoaded", loadAvailableSongs);

// Add song to playlist by button click
document.getElementById("add-song-btn").addEventListener("click", () => {
  const selectedSong = document.getElementById("song-select").value;
  const addMessage = document.getElementById("add-song-message");

  if (!selectedSong) {
    // addMessage failure nothing selected
    addMessage.style.color = "red";
    addMessage.textContent = "Please select a song first!";
    return;
  }
  
  const playlistName = getPlaylistFromURL();
  const playlists = JSON.parse(localStorage.getItem("playlists")) || [];
  const playlist = playlists.find((p) => p.name === playlistName);

  if (!playlist) {
    // Make new list for empty playlist
    playlist = { name: playlistName, songs: [] };
    playlist.push(playlist);
  }

  playlist.songs = playlist.songs || []; // Make sure song list is an array

  if (!playlist.songs.includes(selectedSong)) {
    playlist.songs.unshift(selectedSong);
    localStorage.setItem("playlists", JSON.stringify(playlists));

    // Make sure the "No songs yet in this playlist..." is not visible when song is added to playlist
    document.getElementById("playlist-songs-list").innerHTML = "";

    // addMessage succesfully added
    addMessage.style.color = "green";
    addMessage.textContent = `${selectedSong} is added to ${playlistName}!`;

    loadPlaylistSongs();
    loadAvailableSongs();
  } else {
    // addMessage failure already in list
    addMessage.style.color = "red";
    addMessage.textContent = `${selectedSong} is already in ${playlistName}!`;  
  }
});