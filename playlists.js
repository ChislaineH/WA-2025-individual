const API_URL = "http://localhost:3000/playlists";

const playlistsContainer = document.getElementById("playlists-container");
const playlistForm = document.getElementById("playlist-form");
const playlistInput = document.getElementById("playlist-name");
const sortSelection = document.getElementById("sort");
const searchBar = document.getElementById("search");

// Set default sort to 'last-added'
sortSelection.value = "last-added";

async function fetchPlaylists() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failure fetch playlists");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetch playlists:", error);

    return [];
  }
}

// Display playlists in Front-end
async function loadPlaylists() {
  const playlists = await fetchPlaylists();
  playlistsContainer.innerHTML = "";
  
  const sortedPlaylists = sortPlaylist(playlists); // Sort playlists by selected option
  const searchValue = searchBar ? searchBar.value.toLowerCase() : "";
  const filteredPlaylists = sortedPlaylists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchValue)
  );

  filteredPlaylists.forEach((playlist) => {
    // Create card
    const card = document.createElement("div");
    card.classList.add("playlist-card");

    // Clickable card
    card.addEventListener("click", () => {
      window.location.href = `playlist-songs.html?playlist=${encodeURIComponent(playlist.name)}`;
    });

    // Create image
    const img = document.createElement("img");
    img.src = playlist.image;
    img.alt = playlist.name;

    // Create name
    const name = document.createElement("h3");
    name.textContent = playlist.name;

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevention of click on card
      deletePlaylist(playlist.id);
    });
    
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(deleteButton);
    playlistsContainer.appendChild(card);
  });
}

// Sort playlists
function sortPlaylist(playlists) {
  let sortedPlaylists = [...playlists];

  switch (sortSelection.value) {
    case "name-asc":
      return sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sortedPlaylists.sort((a, b) => b.name.localeCompare(a.name));
    case "last-added":
    default:
      return [...sortedPlaylists.reverse()];
  }
}

// Event listeners
searchBar.addEventListener("input", loadPlaylists); // Search when input is typed
sortSelection.addEventListener("change", loadPlaylists); // Sort when option is selected

// Delete playlist
async function deletePlaylist(playlistID) {
  try {
    const response = await fetch(`${API_URL}/${playlistID}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failure delete playlist");
    }

    loadPlaylists();
  } catch (error) {
    console.error("Error delete playlist:", error);
  }
}

// Submit form
playlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const playlistName = playlistInput.value.trim().toLowerCase();

  if (!playlistName) return;

  try {
    const playlists = await fetchPlaylists();
    const duplicatePlaylist = playlists.find((playlist) => playlist.name.toLowerCase() === playlistName);

    if (duplicatePlaylist) {
      alert("Playlist already exists");
      return;
    }
    
    const newPlaylist = {
      name: playlistName,
      image: "/img/playlist.jpg",
      songs: []
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlaylist),
    });

    if (!response.ok) {
      throw new Error("Failure add playlist");
    }

    playlistInput.value = "";
    loadPlaylists();
  } catch (error) {
    console.error("Error add playlist:", error);
  }
});

// Hamburger menu
function toggleMenu() {
  const navList = document.querySelector("nav ul");
  navList.classList.toggle("show");
}

// Hamburger event listener
document.getElementById("hamburger").addEventListener("click", toggleMenu);

// Load playlists
document.addEventListener("DOMContentLoaded", () => loadPlaylists());