import songs from "./data.js";

function loadPlaylists() {
  const artistContainer = document.getElementById("playlists-container");
  // TODO: VERANDEREN NAAR EIGEN PLAYLISTS
  const playlists = ["Playlist 1", "Playlist 2", "Playlist 3", "Playlist 4", "Playlist 5"];

  playlists.forEach(playlist => {
    const card = document.createElement("div");
    card.classList.add("playlist-card");
    card.addEventListener("click", () => {
      window.location.href = `playlist-songs.html?playlist=${encodeURIComponent(playlist)}`;;
    });

    // TODO: ADD IMAGE
    const img = document.createElement("img");
    img.src = "https://via.placeholder.com/150";
    img.alt = playlist;

    const name = document.createElement("h3");
    name.textContent = playlist;

    card.appendChild(img);
    card.appendChild(name);
    playlistContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadPlaylists);