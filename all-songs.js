const API_URL = "http://localhost:3000/songs";

const songsList = document.getElementById("songs-list");
const songForm = document.getElementById("song-form");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");
const paginationContainer = document.getElementById("pagination");

let allSongs = [];

// Pagination
const songsPerPage = 5;
let currentPage = 1;
let currentFilteredSongs = null;

// Fetch songs from API
async function fetchSongs() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) throw new Error("Failure fetch songs");

    return await response.json();
  } catch (error) {
    console.error("Error fetch songs:", error);

    return [];
  }
}

// Display songs in Front-end (with filter/sort/pagination)
async function loadSongs(filtered = null, resetPage = false) {
  if (resetPage) currentPage = 1;
  if (filtered !== null) currentFilteredSongs = filtered; // Stores filtered songs for pagination

  let songs;
  if (currentFilteredSongs !== null && currentFilteredSongs.length > 0) {
    songs = currentFilteredSongs; // Use filtered songs if available
  } else if (allSongs.length > 0) {
    songs = allSongs; // Use all songs if no filter applied
  } else {
    songs = await fetchSongs(); // Fetch songs if no data available
  }

  if (allSongs.length === 0 && currentFilteredSongs === null) allSongs = songs; // Fill when empty

  const sortedSongs = sortSongs(songs); // Sort playlists by selected option

  const totalPages = Math.ceil(sortedSongs.length / songsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1; // Reset to last page if current page exceeds total pages
  songsList.innerHTML = "";

  const start = (currentPage - 1) * songsPerPage;
  const end = start + songsPerPage;
  const paginatedSongs = sortedSongs.slice(start, end);

  paginatedSongs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${song.image || "/img/music-note.jpg"}" alt="${song.name} image" width="80" height="80"></td>
      <td><span class="editable-text" contenteditable="false">${song.name}</span></td>
      <td><span class="editable-text" contenteditable="false">${song.artist}</span></td>
      <td><span class="editable-text" contenteditable="false">${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</span></td>
      <td><span class="editable-text" contenteditable="false">${song.year}</span></td>
      <td><span class="editable-text" contenteditable="false">${formatDuration(song.duration)}</span></td>
      <td>
        <button class="edit-btn" data-id="${song.id}">EDIT</button>
        <button class="delete-btn" data-id="${song.id}">DELETE</button>
      </td>
    `;
    songsList.appendChild(row);
  });

  updatePagination(sortedSongs.length);
  editEventListener();
  deleteEventListener();
}

// Update songs after search/sort/pagination
async function updateSongs() {
  if (allSongs.length === 0) {
    allSongs = await fetchSongs();
  }

  // Search songs
  const searchValue = searchBar.value.toLowerCase();

  let filteredSongs = allSongs.filter((song) => {
    const name = song.name.toLowerCase() || "";
    const artist = song.artist.toLowerCase() || "";
    const otherArtists = Array.isArray(song.otherArtist) 
      ? song.otherArtist.some(artist => artist.toLowerCase().includes(searchValue))
      : (song.otherArtist?.toLowerCase().includes(searchValue) || false);
    
    return name.includes(searchValue) || artist.includes(searchValue) || otherArtists;
  });

  currentFilteredSongs = filteredSongs; // Stores filtered songs for pagination

  await loadSongs(currentFilteredSongs, true); // Load filtered songs
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSong)
    });

    if (!response.ok) throw new Error("Failure add song");

    allSongs = await fetchSongs(); // Refresh all songs after adding new one
    await loadSongs(currentFilteredSongs, true); // Load songs with current filtered songs
    songForm.reset();
  } catch (error) {
    console.error("Error add song:", error);
  }
});

// Edit song via API
function editEventListener() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const songId = e.target.getAttribute("data-id");
      const isEditing = e.target.textContent === "SAVE";
      const cells = row.querySelectorAll("td");
      const [imageCell, nameCell, artistCell, otherArtistCell, yearCell, durationCell] = cells;

      // Selection all edit and delete buttons
      const allEditButtons = document.querySelectorAll(".edit-btn");
      const allDeleteButtons = document.querySelectorAll(".delete-btn");

      if (isEditing) {
        // Save changes
        const updatedSong = {
          id: songId,
          name: nameCell.textContent.trim(),
          artist: artistCell.textContent.trim(),
          otherArtist: otherArtistCell.textContent.split(",").map(artist => artist.trim()),
          year: parseInt(yearCell.textContent.trim(), 10),
          duration: parseDuration(durationCell.textContent.trim())
        };

        // Validation for editing
        if (!updatedSong.name || !updatedSong.artist || isNaN(updatedSong.year) || isNaN(updatedSong.duration)) {
          alert("Je kunt geen lege velden opslaan.");
          return;
        }

        const originalSong = JSON.parse(row.dataset.originalSong);

        const isSameSong = 
          updatedSong.name === originalSong.name &&
          updatedSong.artist === originalSong.artist &&
          JSON.stringify(updatedSong.otherArtist) === JSON.stringify(originalSong.otherArtist) &&
          updatedSong.year === originalSong.year &&
          updatedSong.duration === originalSong.duration;

        if (isSameSong) {
          console.log("No changes, but song is saved...")
        }

        try {
          const response = await fetch(`${API_URL}/${songId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSong)
          });

          if (!response.ok) throw new Error("Failure update song");

          // Disable editing
          const editableSpans = [
            nameCell.querySelector(".editable-text"),
            artistCell.querySelector(".editable-text"),
            otherArtistCell.querySelector(".editable-text"),
            yearCell.querySelector(".editable-text"),
            durationCell.querySelector(".editable-text")
          ];

          editableSpans.forEach(span => {
            span.contentEditable = "false";
            span.classList.remove("editing-text");
          })

          e.target.textContent = "EDIT";

          // Show all buttons
          allEditButtons.forEach(button => button.style.visibility = "visible");
          allDeleteButtons.forEach(button => button.style.visibility = "visible");

          allSongs = await fetchSongs(); // Refresh all songs after editing
          await loadSongs(currentFilteredSongs, false); // Load songs with current filtered songs
        } catch (error) {
          console.error("Error update song:", error);
        }
      } else {
        // Edit song
        const originalSong = {
          name: nameCell.textContent.trim(),
          artist: artistCell.textContent.trim(),
          otherArtist: otherArtistCell.textContent.split(",").map(artist => artist.trim()),
          year: parseInt(yearCell.textContent.trim(), 10),
          duration: parseDuration(durationCell.textContent.trim())
        };

        row.dataset.originalSong= JSON.stringify(originalSong);

        // Enable editing
        const editableSpans = [
          nameCell.querySelector(".editable-text"),
          artistCell.querySelector(".editable-text"),
          otherArtistCell.querySelector(".editable-text"),
          yearCell.querySelector(".editable-text"),
          durationCell.querySelector(".editable-text")
        ];

        editableSpans.forEach(span => {
          span.contentEditable = "true";
          span.classList.add("editing-text");
        })

        e.target.textContent = "SAVE";

        // Hide all buttons except the clicked edit button (changes in save)
        allEditButtons.forEach(button => {
          if (button !== e.target) button.style.visibility = "hidden";
        });
        allDeleteButtons.forEach(button => {
          button.style.visibility = "hidden";
        });
      }
    })
  });
}

// Parse duration from string to number
function parseDuration(durationString) {
  const [minString, secString] = durationString.split(":");
  const min = parseInt(minString, 10);
  const sec = parseInt(secString, 10);

  return min + (sec / 100);
}

// Delete song via API
function deleteEventListener() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const songID = e.target.getAttribute("data-id");

      try {
        const response = await fetch(`${API_URL}/${songID}`, {
          method: "DELETE"
        });
        
        if (!response.ok) throw new Error("Failure delete song");

        allSongs = await fetchSongs(); // Refresh all songs after deletion
        await loadSongs(currentFilteredSongs, false); // Load songs with current filtered songs
      } catch (error) {
        console.error("Error delete song:", error);
      }
    });
  });
}

// Search
searchBar.addEventListener("input", async () => {
  currentPage = 1; // Reset when searching to first page
  await updateSongs(); // Update songs when searching
});

// Sort event listener
sortSelection.addEventListener("change", async () => {
  currentPage = 1; // Reset when sorting to first page
  await loadSongs(currentFilteredSongs, false); // Load songs with current filtered songs
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

    if (i === currentPage) button.classList.add("active");

    button.addEventListener("click", async () => {
      currentPage = i;
      await loadSongs(currentFilteredSongs, false);
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
document.addEventListener("DOMContentLoaded", async () => {
  allSongs = await fetchSongs(); // Fetch all songs on page load
  await loadSongs();
});