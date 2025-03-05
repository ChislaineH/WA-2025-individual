import songs from "./data.js";

const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
const songsList = document.getElementById("songs-list");
const songForm = document.getElementById("song-form");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");
const paginationContainer = document.getElementById("pagination");

// Pagination
const songsPerPage = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  // Load list from all songs
  function loadSongs(filteredSongs = [...songs, ...savedSongs]) {
    songsList.innerHTML = "";

    const sortedSongs = sortSongs(filteredSongs); // Sort playlists by selected option
    
    const totalSongs = sortedSongs.length;
    const start = (currentPage - 1) * songsPerPage;
    const end = start + songsPerPage;
    const paginatedSongs = sortedSongs.slice(start, end);
  
    paginatedSongs.forEach((song, index) => {
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

    updatePagination(totalSongs);

    deleteEventListener();
  }

  // Delete event listener
  function deleteEventListener() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"), 10);
        const songToDelete = savedSongs[index]

        // Delete from localStorage
        savedSongs.splice(index, 1);

        // Update localStorage
        localStorage.setItem("songs", JSON.stringify(savedSongs));

        updateArtists();

        updatePlaylists(songToDelete);
  
        setTimeout(() => loadSongs(), 50);
      });
    });
  }

  function updateArtists() {
    let allSongs = [...songs, ...savedSongs];

    let allArtists = allSongs.flatMap((song) =>
      [song.artist, ...(Array.isArray(song.otherArtist) ? song.otherArtist : (song.otherArtist ? [song.otherArtist] : []))]
    ).filter(artist => artist);
    
    localStorage.setItem("artists", JSON.stringify([...new Set(allArtists)]));

    if (typeof loadArtists === "function") {
      loadArtists();
    }
  }

  function updatePlaylists(songToDelete) {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

    playlists.forEach((playlist) => {
      playlist.songs = playlist.songs.filter((song) =>
        songs.name !== songToDelete.name || song.artist !== songToDelete.artist
      );
    });

    localStorage.setItem("playlists", JSON.stringify(playlists));
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

  // Update pagination
  function updatePagination(totalSongs) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalSongs / songsPerPage);

    if (totalPages <= 1) return; // No pagination when only 1 page

    // Update title with current page
    document.title = `Muse-ic - All Songs - ${currentPage} of ${totalPages}`;

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

    const allSongs = [...songs, ...savedSongs];
    
    const filteredSongs = allSongs
      .filter((song) => 
        song.name.toLowerCase().includes(searchValue) ||
        song.artist.toLowerCase().includes(searchValue) ||
        (Array.isArray(song.otherArtist) 
          ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue)) 
          : song.otherArtist?.toLowerCase().includes(searchValue)
        )
    );
    return filteredSongs;
  }

  // Search event listener
  searchBar.addEventListener("input", () => {
    currentPage = 1;
    loadSongs(searchSongs());
  });

  // Sort event listener
  sortSelection.addEventListener("change", () => {
    currentPage = 1;
    loadSongs();
  });

  // Submit form (add song)
  if (songForm) {
    songForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const minutes = parseInt(document.getElementById("duration-minutes").value, 10);
      const seconds = parseInt(document.getElementById("duration-seconds").value, 10);

      // Validation duration
      if (isNaN(minutes) || isNaN(seconds || seconds< 0 || seconds >= 60)) {
        alert("Please enter a valid duration, seconds need to be between 0 and 59.");
        return;
      }
      
      // Create song object
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

        loadSongs();
        songForm.reset();
      }
    });
  }

  // Hamburger menu
  function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }

  // Hamburger event listener
  document.getElementById("hamburger").addEventListener("click", toggleMenu);
  
  loadSongs();
});