
let currentReading = [];

// Loads Google Charts
google.charts.load('current', { 'packages': ['corechart'] });


const getCardImagePath = (cardName) => {
    const fileName = cardName.toLowerCase().trim().split(' ').join('-');
    return `assets/images/cards/${fileName}.png`;
};

// Collapsible Navbar
const setupNavbar = () => {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const menuToggle = document.getElementById("navbarNav");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                const section = document.querySelector(targetId);

                if (section) {
                    e.preventDefault();

                    const isMobile = window.innerWidth < 992;
                    if (isMobile) {
                        const bsCollapse = bootstrap.Collapse.getInstance(menuToggle) || new bootstrap.Collapse(menuToggle);
                        bsCollapse.hide();
                    }

                    const navbarHeight = document.querySelector(".navbar").offsetHeight;
                    window.scrollTo({
                        top: section.offsetTop - navbarHeight,
                        behavior: "smooth",
                    });
                }
            }
        });
    });
};

// Tarot Reading Logic
function performReading() {
    const drawBtn = document.getElementById('draw-button');
    executeShuffle();
    if (drawBtn) drawBtn.innerText = "Try Again";
}

function executeShuffle() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    container.innerHTML = '';
    currentReading = [];

    const shuffled = [...majorArcanaData.cards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);

    selectedCards.forEach((card, index) => {
        currentReading.push(card.name);

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-item glassmorphic-card p-3 m-2 text-center animate-card cursor-pointer';
        cardDiv.style.width = '250px';
        cardDiv.style.animationDelay = `${index * 0.2}s`;
        cardDiv.style.cursor = 'pointer'; // indicate clickable cards

        // Add click event to show modal
        cardDiv.onclick = () => showCardDetails(card);

        cardDiv.innerHTML = `
        <img src="${getCardImagePath(card.name)}" alt="${card.name}" class="img-fluid rounded mb-3">
        <h4>${card.name}</h4>
        <p class="small fst-italic">"${card.tagline}"</p>
        <p class="small text-uppercase tracking-widest opacity-75" style="letter-spacing: 2px;">
        Aura: ${card.aura_theme}</p>
    `;
        container.appendChild(cardDiv);
    });

    //function to show modal with card details
    function showCardDetails(card) {
        document.getElementById('modalCardName').innerText = card.name;
        document.getElementById('modalCardImg').src = getCardImagePath(card.name);
        document.getElementById('modalCardTagline').innerText = `"${card.tagline}"`;
        document.getElementById('modalCardDescription').innerText = card.description || "Description coming soon to the stars...";

        const cardModal = new bootstrap.Modal(document.getElementById('cardModal'));
        cardModal.show();

    }
    // Draws the chart after cards are displayed
    if (typeof google !== 'undefined' && google.visualization) {
        drawAuraChart();

    }

}

// Chart Drawing Logic
function drawAuraChart() {
    const placeholder = document.getElementById('chart-placeholder');
    const chartDiv = document.getElementById('aura_element_chart');
    const chartContainer = document.getElementById('chart-container');
    const infoContainer = document.getElementById('info-container');

    if (!chartDiv) return;

    const elementCounts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    currentReading.forEach(cardName => {
        const foundCard = majorArcanaData.cards.find(item => item.name === cardName);
        if (foundCard) elementCounts[foundCard.element]++;
    });

    const dominantElement = Object.keys(elementCounts).reduce((a, b) =>
        elementCounts[a] > elementCounts[b] ? a : b
    );

    if (elementCounts[dominantElement] > 0) {
        if (placeholder) placeholder.style.display = 'none';

        if (window.innerWidth >= 992) {
            chartContainer.classList.remove('col-12');
            chartContainer.classList.add('col-lg-6');
            infoContainer.classList.remove('d-none');
        } else {
            infoContainer.classList.remove('d-none');
        }

        displayInterpretation(dominantElement);

        setTimeout(() => {
            const data = google.visualization.arrayToDataTable([
                ['Element', 'Presence'],
                ['Fire', elementCounts.Fire],
                ['Water', elementCounts.Water],
                ['Air', elementCounts.Air],
                ['Earth', elementCounts.Earth]
            ]);

            const options = {
                backgroundColor: 'transparent',
                colors: ['#ff4d4d', '#3399ff', '#d1d1d1', '#2e8b57'],
                pieSliceBorderColor: "rgba(255, 255, 255, 0.5)",
                legend: {
                    position: 'bottom',
                    textStyle: { color: '#ffffff', fontSize: 13 },
                },
                chartArea: { width: '100%', height: '80%' },
                width: '100%',
                height: 400
            };

            const chart = new google.visualization.PieChart(chartDiv);
            chart.draw(data, options);

            const shareArea = document.getElementById('share-area');
            if (shareArea) shareArea.style.display = 'block';
        }, 150);
    }
}

// Interpretation Display
function displayInterpretation(element) {
    const interpretationDiv = document.getElementById('element-interpretation');
    const messages = {
        Fire: "Your path is currently fueled by FIRE. Transformation is coming.",
        Water: "Deeply influenced by WATER. Listen to your inner voice.",
        Air: "AIR dominates. Clarity and communication are key.",
        Earth: "EARTH grounds you. Focus on stability."
    };
    interpretationDiv.innerHTML = `<p class="fade-in">${messages[element]}</p>`;
}

// Copy to Clipboard 
function copyReading() {
    const interpretation = document.getElementById('element-interpretation').innerText;
    const cards = currentReading.join(', ');
    const textToCopy = `✨ Aura Tarot Reading ✨\nCards: ${cards}\nInterpretation: ${interpretation}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copy-reading');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();

    const drawBtn = document.getElementById('draw-button');
    const copyBtn = document.getElementById('copy-reading');

    if (drawBtn) drawBtn.addEventListener('click', performReading);

    // Copy reading event
    if (copyBtn) copyBtn.addEventListener('click', copyReading);
});

// Redraw chart on window resize
window.addEventListener('resize', () => {
    if (currentReading.length > 0) drawAuraChart();
});