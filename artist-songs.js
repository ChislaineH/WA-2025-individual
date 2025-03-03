import songs from "./data.js";

function getArtistFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("artist");
}

function loadArtistSongs() {
  const artist = getArtistFromURL();
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get("image");

  if (!artist) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("artist-name").textContent = artist;

  // Add in image from params
  const imgElement = document.getElementById("artist-img");

  if (imageUrl) {
    imgElement.src = decodeURIComponent(imageUrl);
    imgElement.alt = artist;
  } else {
    const imageName = artist.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-&]/g, '') + ".jpg";
    imgElement.src = `/img/artists/${imageName}`;
    imgElement.alt = artist;
  }

  const songsList = document.getElementById("artist-songs-list");

  const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
  const allSongs = [...songs, ...savedSongs];

  // Get all songs from artist or otherArtist
  const artistSongs = allSongs.filter(song => 
    song.artist === artist || (Array.isArray(song.otherArtist) && song.otherArtist.includes(artist))
  );

  // Format duration
  function formatDuration(duration) {
    const totalSeconds = Math.round(duration * 60);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  songsList.innerHTML = "";

  artistSongs.forEach((song) => {
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

document.addEventListener("DOMContentLoaded", loadArtistSongs);