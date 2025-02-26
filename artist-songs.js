import songs from "./data.js";

function getArtistFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("artist");
}

function loadArtistSongs() {
  const artist = getArtistFromURL();

  if (!artist) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("artist-name").textContent = artist;

  const songsList = document.getElementById("artist-songs-list");
  const artistSongs = songs.filter((song) => song.artist === artist);

  artistSongs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${song.name}</td>
      <td>${song.otherArtist || "-"}</td>
      <td>${song.year}</td>
      <td>${song.duration}</td>
    `;
    songsList.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadArtistSongs);