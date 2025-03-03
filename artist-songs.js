import songs from "./data.js";

const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
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
    return urlParams.get("image");
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

  //  Load artist songs
  function loadArtistSongs(searchValue = "") {
    const artist = getArtistFromURL();
    const imageUrl = getImageFromURL();

    if (!artist) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("artist-name").textContent = artist;
    const imgElement = document.getElementById("artist-img");
    imgElement.src = imageUrl ? decodeURIComponent(imageUrl) : "/img/music-note.jpg";
    imgElement.alt = artist;

    // Get all unique songs (remove duplicates on name + artist)
    const allSongs = [...songs, ...savedSongs];
    const uniqueSongs = Array.from(
      new Map(allSongs.map(song => [`${song.name.toLowerCase()}-${song.artist.toLowerCase()}`, song])).values()
    );

    // Filter songs from artist
    const artistSongs = uniqueSongs.filter(song =>
      song.artist.toLowerCase() === artist.toLowerCase() ||
      (Array.isArray(song.otherArtist) && song.otherArtist.some(a => a.toLowerCase() === artist.toLowerCase()))
    );

    // Filter search all songs
    const filteredSongs = artistSongs.filter(song =>
      song.name.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      (Array.isArray(song.otherArtist) 
        ? song.otherArtist.join(", ").toLowerCase()
        : song.otherArtist?.toLowerCase().includes(searchValue)) ||
      song.year.toString().includes(searchValue) ||
      formatDuration(song.duration).toLowerCase().includes(searchValue) 
    );

    const sortedSongs = sortSongs(filteredSongs); // Sort playlists by selected option

    songsList.innerHTML = "";

    sortedSongs.forEach((song) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${song.name}</td>
        <td>${Array.isArray(song.otherArtist) ? song.otherArtist.join(", ") : song.otherArtist || "-"}</td>
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

  loadArtistSongs();
});