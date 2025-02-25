import songs from "./data.js";

function loadSongs() {
  const songList = document.getElementById("songs-list");
  songs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>TODO: INSERT IMAGE</td>
      <td>${song.name}</td>
      <td>${song.artist}</td>
      <td>${song.year}</td>
      <td>${song.duration}</td>
    `;
    songList.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadSongs);