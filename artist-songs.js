const API_URL = "http://localhost:3000/songs";

const songsList = document.getElementById("artist-songs-list");
const searchBar = document.getElementById("search");
const sortSelection = document.getElementById("sort");

document.addEventListener("DOMContentLoaded", () => {
  // Get artist from params
  function getArtistFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("artist");
  }

  // Get img from params
  function getImageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get("image");

    if (!imageUrl) return "/img/music-note.jpg";

    const decodedImageUrl = decodeURIComponent(imageUrl);

    return decodedImageUrl;
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
    loadArtistSongs(searchValue);
  }

  // Sorting
  function sortSongs(songArray) {
    let sortedSongs = [...songArray];

    switch (sortSelection.value) {
      case "name-asc":
        return sortedSongs.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedSongs.sort((a, b) => b.name.localeCompare(a.name));
      case "other-artist-asc":
        return sortedSongs.sort((a, b) => a.otherArtist.localeCompare(b.otherArtist));
      case "other-artist-desc":
        return sortedSongs.sort((a, b) => b.otherArtist.localeCompare(a.otherArtist));
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
  async function loadArtistSongs(searchValue = "") {
    const artist = getArtistFromURL();
    const imageUrl = getImageFromURL();

    if (!artist) {
      window.location.href = "all-songs.html";
      return;
    }

    document.getElementById("artist-name").textContent = artist;
    const imgElement = document.getElementById("artist-img");
    imgElement.src = imageUrl;
    imgElement.alt = artist;

    // Get all songs from API
    const allSongs = await fetchSongs();

    // Get unique songs (remove duplcates)
    const uniqueSongs = Array.from(
      new Map(allSongs.map(song => [`${song.name.toLowerCase()}-${song.artist.toLowerCase()}`, song])).values()
    );

    // Filter songs from artist
    const artistSongs = uniqueSongs.filter(song =>
      song.artist.toLowerCase() === artist.toLowerCase() ||
      (Array.isArray(song.otherArtist) && song.otherArtist.some(a => a.toLowerCase() === artist.toLowerCase()))
    );

    // otherArtist column: delete artist (when in otherArtists) or add artist (to otherArtist column)
    const checkOtherArtists = artistSongs.map(song => {
      let otherArtists = Array.isArray(song.otherArtist) 
        ? [...song.otherArtist] 
        : song.otherArtist
          ? song.otherArtist.split(", ").map(a => a.trim())
          : [];

      // Delete artist when in otherArtists
      otherArtists = otherArtists.filter(a => a.toLowerCase() !== artist.toLowerCase());

      // Add artist when not equal to artist from artist-songs
      if (song.artist.toLowerCase() !== artist.toLowerCase()) {
        otherArtists.push(song.artist);
      }

      return {...song, otherArtist: otherArtists.length > 0 ? otherArtists.join(", ") : "-"};
    });

    // Filter search all songs
    const filteredSongs = checkOtherArtists.filter(song =>
      song.name.toLowerCase().includes(searchValue) ||
      (song.otherArtist && song.otherArtist.toLowerCase().includes(searchValue)) ||
      song.year.toString().includes(searchValue) ||
      formatDuration(song.duration).toLowerCase().includes(searchValue) 
    );

    const sortedSongs = sortSongs(filteredSongs); // Sort playlists by selected option

    songsList.innerHTML = "";

    sortedSongs.forEach((song) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${song.name}</td>
        <td>${song.otherArtist}</td>
        <td>${song.year}</td>
        <td>${formatDuration(song.duration)}</td>
      `;

      songsList.appendChild(row);
    });
  }

  // Search event listener
  searchBar.addEventListener("input", searchSongs);

  // Sort event listener
  sortSelection.addEventListener("change", () => loadArtistSongs());

  // Hamburger menu
  function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }

  // Hamburger event listener
  document.getElementById("hamburger").addEventListener("click", toggleMenu);

  loadArtistSongs();
});