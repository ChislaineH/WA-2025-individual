// Wait unttil DOM (web page) fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Hamburger toggle menu
  function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }

  // Hamburger event listener
  document.getElementById("hamburger").addEventListener("click", toggleMenu);
});