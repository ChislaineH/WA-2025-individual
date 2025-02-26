import songs from "./data.js";

function loadArtists() {
  const artistContainer = document.getElementById("artists-container");

  // Get unique artists, also from otherArtist
  const uniqueArtists = [...new Set(songs.map((song) => song.artist || song.otherArtist.flat()))];

  uniqueArtists.forEach(artist => {
    const card = document.createElement("div");
    card.classList.add("artist-card");
    card.addEventListener("click", () => {
      const imageUrl = encodeURIComponent(imageSrc);
      window.location.href = `artist-songs.html?artist=${encodeURIComponent(artist)}&image=${imageUrl}`;
    });

    // Convert artistname to filename
    const imageName = artist.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-&]/g, '') + '.jpg';
    const imageSrc = `/img/artists/${imageName}`;

    // Create image element
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = artist;

    const name = document.createElement("h3");
    name.textContent = artist;

    card.appendChild(img);
    card.appendChild(name);
    artistContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadArtists);