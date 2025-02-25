import songs from "./data.js";

function loadArtists() {
  const artistContainer = document.getElementById("artists-container");
  const uniqueArtists = [...new Set(songs.map((song) => song.artist || song.otherArtist).flat())]; // Get unique artists

  uniqueArtists.forEach(artist => {
    const card = document.createElement("div");
    card.classList.add("artist-card");
    card.addEventListener("click", () => {
      window.location.href = `artist-songs.html?artist=${encodeURIComponent(artist)}`;;
    });

    // TODO: ADD IMAGE
    const img = document.createElement("img");
    img.src = "https://via.placeholder.com/150";
    img.alt = artist;

    const name = document.createElement("h3");
    name.textContent = artist;

    card.appendChild(img);
    card.appendChild(name);
    artistContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadArtists);