// This file contains JavaScript specific to the about.html page.

const mainAboutContent = document.getElementById('about-main-content');
const visionSubPage = document.getElementById('about-vision');
const teamSubPage = document.getElementById('about-team');

const aboutMainCards = document.querySelectorAll('.about-main-card');
const backButtons = document.querySelectorAll('.back-button');

// Function to handle showing the correct sub-page based on hash
function showSubPage(hash) {
    // Hide all sub-pages first
    mainAboutContent.classList.remove('active');
    visionSubPage.classList.remove('active');
    teamSubPage.classList.remove('active');

    // Show the targeted sub-page
    if (hash === '#about-vision') {
        visionSubPage.classList.add('active');
    } else if (hash === '#about-team') {
        teamSubPage.classList.add('active');
    } else {
        // Default to the main content
        mainAboutContent.classList.add('active');
    }

    window.scrollTo(0, 0); // Scroll to top on page change
}

// Add event listeners to the main cards to change the URL hash
aboutMainCards.forEach(card => {
    card.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = card.getAttribute('href');
    });
});

// Add event listeners to the back buttons
backButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = button.getAttribute('href');
    });
});

// Listen for hash changes in the URL
window.addEventListener('hashchange', () => {
    showSubPage(window.location.hash);
});

// On initial page load, check the URL hash and show the correct page
document.addEventListener('DOMContentLoaded', () => {
    const currentHash = window.location.hash;
    showSubPage(currentHash);
});