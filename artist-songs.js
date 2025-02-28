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

  // Get all songs from artist or otherArtist
  const artistSongs = songs.filter(song => 
    song.artist === artist || (Array.isArray(song.otherArtist) && song.otherArtist.includes(artist))
  );

  songsList.innerHTML = "";

  artistSongs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${song.name}</td>
      <td>${song.otherArtist ? song.otherArtist.join(", ") : "-"}</td>
      <td>${song.year}</td>
      <td>${song.duration}</td>
    `;
    songsList.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadArtistSongs);