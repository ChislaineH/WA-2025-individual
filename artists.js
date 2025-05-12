const API_URL = "http://localhost:3000/songs";

const artistContainer = document.getElementById("artists-container");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");

let allArtists = [];
let currentFilteredArtists = null;

// Fetch songs from API and only get unique artsts
async function fetchArtists() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failure fetch songs");
    }

    const songs = await response.json();

    // Get artists from songs (artists and otherArtists)
    const allArtists = songs.flatMap((song) => {
      const otherArtists = Array.isArray(song.otherArtist) ? song.otherArtist : (song.otherArtist ? [song.otherArtist] : []);
      return [song.artist, ...otherArtists];
    }).filter(artist => artist);

    return [...new Set(allArtists)]; // Get unique artists => remove duplicate artists
  } catch (error) {
    console.error("Error fetch songs:", error);

    return [];
  }
}

// Display artists in Front-end
async function loadArtists(filteredArtists = null) {
  const artistsToShow = filteredArtists !== null ? filteredArtists : await fetchArtists();

  artistContainer.innerHTML = "";

  // Sort artists
  const sortedArtists = sortArtists(artistsToShow);

  sortedArtists.forEach(artist => {
    const card = document.createElement("div");
    card.classList.add("artist-card");
    card.addEventListener("click", () => {
      window.location.href = `artist-songs.html?artist=${encodeURIComponent(artist)}&image=${encodeURIComponent(imageSrc)}`;
    });

    // Convert artistname to filename
    const imageName = artist.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-&]/g, '') + '.jpg';
    const imageSrc = `/img/artists/${imageName}`;

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = artist;

    img.onerror = function() {
      img.src = "/img/music-note.jpg";
      card.addEventListener("click", () => {
        window.location.href = `artist-songs.html?artist=${encodeURIComponent(artist)}&image=${encodeURIComponent("/img/music-note.jpg")}`;
      });
    }

    const name = document.createElement("h3");
    name.textContent = artist;

    card.appendChild(img);
    card.appendChild(name);
    artistContainer.appendChild(card);
  });
}

// Search
searchBar.addEventListener("input", () => {
  const searchValue = searchBar.value.toLowerCase();

  if (searchValue === "") {
    currentFilteredArtists = null;
    loadArtists(allArtists); // Show all artists when search is empty
  } else {
    const filteredArtists = allArtists.filter((artist) => 
      artist.toLowerCase().includes(searchValue)
    );

    currentFilteredArtists = filteredArtists; // Store filtered songs
    loadArtists(currentFilteredArtists);
  }
});

// Sort artists
function sortArtists(artistArray) {
  if (!Array.isArray(artistArray)) {
    return [];
  }

  return artistArray.sort((a, b) =>
    sortSelection.value === "artist-asc" ? a.localeCompare(b) : b.localeCompare(a)
  );
}

// Sort event listener
sortSelection.addEventListener("change", () => {
  const searchValue = searchBar.value.toLowerCase();

  let artistsToSort = allArtists;

  if (searchValue !== "") {
    artistsToSort = allArtists.filter((artist) => 
      artist.toLowerCase().includes(searchValue)
    );
  }
  
  loadArtists(artistsToSort);
});

// Hamburger menu
function toggleMenu() {
  const navList = document.querySelector("nav ul");
  navList.classList.toggle("show");
}

// Hamburger event listener
document.getElementById("hamburger").addEventListener("click", toggleMenu);

// Load artists
document.addEventListener("DOMContentLoaded", async() => {
  allArtists = await fetchArtists();
  loadArtists(allArtists);
});