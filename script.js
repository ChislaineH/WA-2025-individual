import songs from "./data.js";

function loadSongs() {
  const songList = document.getElementById("songs-list");

  // Loop every song in the list
  songs.forEach((song) => {
    // Add new row to the table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${song.image}" alt="${song.name} image" width="80" height="80"></td>
      <td>${song.name}</td>
      <td>${song.artist}</td>
      <td>${song.otherArtist || "-"}</td>
      <td>${song.year}</td>
      <td>${song.duration}</td>
    `;
    songList.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadSongs);