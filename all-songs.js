const API_URL = "http://localhost:3000/songs";

const songsList = document.getElementById("songs-list");
const songForm = document.getElementById("song-form");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");
const paginationContainer = document.getElementById("pagination");

// Pagination
const songsPerPage = 5;
let currentPage = 1;

// Fetch songs from API
async function fetchSongs() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failure fetch songs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetch songs:", error);

    return [];
  }
}

// Display songs in Front-end
async function loadSongs(filtered = null) {
  const songs = filtered || await fetchSongs();
  songsList.innerHTML = "";

  const sortedSongs = sortSongs(songs); // Sort playlists by selected option
  const totalSongs = sortedSongs.length;
  const start = (currentPage - 1) * songsPerPage;
  const end = start + songsPerPage;
  const paginatedSongs = sortedSongs.slice(start, end);

  paginatedSongs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
      <td>${song.name}</td>
      <td>${song.artist}</td>
      <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
      <td>${song.year}</td>
      <td>${formatDuration(song.duration)}</td>
      <td><button class="delete-btn" data-id="${song.id}">X</button></td>
    `;
    songsList.appendChild(row);
  });

  updatePagination(totalSongs);
  deleteEventListener();
}

// Submit form (add song) via API
songForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const minutes = parseInt(document.getElementById("duration-minutes").value, 10);
  const seconds = parseInt(document.getElementById("duration-seconds").value, 10);
  const duration = minutes + (seconds / 100);

  // Validation duration
  if (isNaN(minutes) || isNaN(seconds) || seconds< 0 || seconds >= 60) {
    alert("Please enter a valid duration, seconds need to be between 0 and 59.");
    return;
  }

  // Check what is the highest ID
  const songs = await fetchSongs();
  const highestId = songs.reduce((maxId, song) => Math.max(maxId, song.id), 0);
  const newId = (highestId + 1).toString();
  
  // Create song object
  const newSong = {
    id: newId,
    name: document.getElementById("song-name").value.trim(),
    artist: document.getElementById("artist").value.trim(),
    otherArtist: document.getElementById("other-artists").value.trim() || null,
    year: document.getElementById("year").value.trim(),
    duration: duration,
    image: "/img/music-note.jpg"
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSong)
    });

    if (!response.ok) {
      throw new Error("Failure add song");
    }

    loadSongs();
    songForm.reset();
  } catch (error) {
    console.error("Error add song:", error);
  }
});

// Delete song via API
function deleteEventListener() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const songID = e.target.getAttribute("data-id");

      try {
        const response = await fetch(`${API_URL}/${songID}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("Failure delete song");
        }

        loadSongs();
      } catch (error) {
        console.error("Error delete song:", error);
      }
    });
  });
}

// Search
searchBar.addEventListener("input", async () => {
  const searchValue = searchBar.value.toLowerCase();
  const allSongs = await fetchSongs();
  const filteredSongs = allSongs.filter((song) => 
    song.name.toLowerCase().includes(searchValue) ||
    song.artist.toLowerCase().includes(searchValue) ||
    (Array.isArray(song.otherArtist) 
      ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue)) 
      : song.otherArtist?.toLowerCase().includes(searchValue)
    )
  );

  loadSongs(filteredSongs);
});

// Sort event listener
sortSelection.addEventListener("change", () => {
  currentPage = 1; // Reset when sorting to first page
  loadSongs();
});

// Sort
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
      return sortedSongs.reverse();
  }
}

// Pagination
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
  const min = Math.floor(duration);
  const sec = Math.round((duration - min) * 100);
  
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

// Hamburger menu
function toggleMenu() {
  const navList = document.querySelector("nav ul");
  navList.classList.toggle("show");
}

// Hamburger event listener
document.getElementById("hamburger").addEventListener("click", toggleMenu);

// Load songs
document.addEventListener("DOMContentLoaded", () => loadSongs());