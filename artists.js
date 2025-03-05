import songs from "./data.js";

// Get unique artists, also from otherArtist
function getUniqueArtists() {
  const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
  const allSongs = [...songs, ...savedSongs];

  const allArtists = allSongs.flatMap((song) => 
    [song.artist, ...(Array.isArray(song.otherArtist) ? song.otherArtist : [])]
  ).filter(artist => artist);
  
  return [...new Set(allArtists)];
}

document.addEventListener("DOMContentLoaded", () => {
  const artistContainer = document.getElementById("artists-container");
  const searchBar = document.getElementById("search");
  const sortSelection = document.getElementById("sort");

  function loadArtists(filteredArtists) {
    const allArtists = getUniqueArtists();
    const artistsToShow = filteredArtists || allArtists;

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
      }
  
      const name = document.createElement("h3");
      name.textContent = artist;
  
      card.appendChild(img);
      card.appendChild(name);
      artistContainer.appendChild(card);
    });
  }

  // Search
  function searchArtists() {
    const searchValue = searchBar.value.toLowerCase();
    const filteredArtists = getUniqueArtists().filter(artist => 
      artist.toLowerCase().includes(searchValue)
    );
    loadArtists(filteredArtists);
  }

  // Sort artists
  function sortArtists(artistArray) {
    return artistArray.sort((a, b) =>
      sortSelection.value === "artist-asc" ? a.localeCompare(b) : b.localeCompare(a)
    );
  }

  // Event listeners
  searchBar.addEventListener("input", searchArtists);
  sortSelection.addEventListener("change", () => loadArtists());

  // Hamburger menu
  function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }

  // Hamburger event listener
  document.getElementById("hamburger").addEventListener("click", toggleMenu);

  loadArtists();
});