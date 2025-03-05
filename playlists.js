document.addEventListener("DOMContentLoaded", () => {
  const playlistForm = document.getElementById("playlist-form");
  const playlistInput = document.getElementById("playlist-name");
  const playlistsContainer = document.getElementById("playlists-container");
  const sortSelection = document.getElementById("sort");
  const searchBar = document.getElementById("search");

  // Get playlists from localStorage and set defaults
  let playlists = JSON.parse(localStorage.getItem("playlists")) || [
    { name: "My Favorite Songs", image: "/img/music-note.jpg" },
  ];

  // Set default sort to 'last-added'
  sortSelection.value = "last-added";

  // Render playlists
  function renderPlaylists() {
    playlistsContainer.innerHTML = "";
    
    const sortedPlaylists = sortPlaylist(); // Sort playlists by selected option

    // Filter search
    const searchValue = searchBar ? searchBar.value.toLowerCase() : "";
    const filteredPlaylists = sortedPlaylists.filter(playlist => 
      playlist.name.toLowerCase().includes(searchValue)
    );

    filteredPlaylists.forEach((playlist) => {
      // Create card
      const card = document.createElement("div");
      card.classList.add("playlist-card");

      // Clickable card
      card.addEventListener("click", () => {
        window.location.href = `playlist-songs.html?playlist=${encodeURIComponent(playlist.name)}`;
      });

      // Create image
      const img = document.createElement("img");
      img.src = playlist.image;
      img.alt = playlist.name;

      // Create name
      const name = document.createElement("h3");
      name.textContent = playlist.name;

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevention of click on card
        deletePlaylist(playlist.name);
      });
      
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(deleteButton);
      playlistsContainer.appendChild(card);
    });
  }

  // Sort playlists
  function sortPlaylist() {
    let sortedPlaylists = [...playlists];

    switch (sortSelection.value) {
      case "name-asc":
        return sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedPlaylists.sort((a, b) => b.name.localeCompare(a.name));
      case "last-added":
      default:
        return [...sortedPlaylists.reverse()];
    }
  }

  // Event listeners
  if (searchBar) searchBar.addEventListener("input", renderPlaylists); // Search when input is typed
  sortSelection.addEventListener("change", renderPlaylists); // Sort when option is selected

  // Delete playlist
  function deletePlaylist(playlistName) {
    playlists = playlists.filter(playlist => playlist.name !== playlistName); // Delete playlist from list
    localStorage.setItem("playlists", JSON.stringify(playlists)); // Update localStorage
    renderPlaylists(); // Show updated playlists
  }

  // Submit form
  playlistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const playlistName = playlistInput.value.trim();
    if (playlistName && !playlists.some(playlist => playlist.name === playlistName)) {
      playlists.push({ name: playlistName, image: "/img/music-note.jpg" });
      localStorage.setItem("playlists", JSON.stringify(playlists));
      renderPlaylists();
      playlistInput.value = "";
    }
  });

  // Hamburger menu
  function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }

  // Hamburger event listener
  document.getElementById("hamburger").addEventListener("click", toggleMenu);

  renderPlaylists();
})