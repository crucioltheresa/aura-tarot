// To ensure the Bootstrap mobile navbar collapses when navigating to in -page links
document.querySelectorAll(".navbar-collapse .nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        let section = document.querySelector(e.target.getAttribute("href"));
        if (section) {
            e.preventDefault(); // Prevent default anchor click behavior
            let navbarHeight = document.querySelector(".navbar-toggler").offsetHeight;
            window.scroll({
                top: section.offsetTop - navbarHeight, // Adjust for navbar height
                behavior: "smooth",
            });
            document.querySelector(".navbar-collapse").classList.remove("show"); // Collapse navbar
        }
    });
});
// Global variable to hold the current reading's card names
let currentReading = [];

// Load Google Charts and set callback
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawAuraChart);

// helper function to get image path
function getCardImagePath(cardName) {
    const fileName = cardName.toLowerCase().trim().split(' ').join('-');
    const path = `assets/images/cards/${fileName}.png`;
    return path;
}

function performReading() {
    const container = document.getElementById('cards-container');
    const drawBtn = document.getElementById('draw-button');

    // Se o botão já estiver no modo "Try Again", podemos resetar a página ou apenas rodar de novo
    if (drawBtn.innerText === "TRY AGAIN") {
        setTimeout(() => {
            executeShuffle(); // Função que faz o sorteio real
            container.style.opacity = "1";
        }, 300);
    } else {
        executeShuffle();
        // Transforma o botão
        drawBtn.innerText = "Try Again";
    }
}

function executeShuffle() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    currentReading = [];

    const shuffled = [...majorArcanaData.cards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);

    selectedCards.forEach((card, index) => {
        currentReading.push(card.name);

        const cardDiv = document.createElement('div');
        // Adicionando uma classe de animação (fade-in)
        cardDiv.className = 'card-item glassmorphic-card p-3 m-2 text-center animate-card';
        cardDiv.style.width = '250px';
        cardDiv.style.animationDelay = `${index * 0.2}s`; // Efeito cascata

        cardDiv.innerHTML = `
            <img src="${getCardImagePath(card.name)}" alt="${card.name}" class="img-fluid rounded mb-3">
            <h4 class="gold-text">${card.name}</h4>
            <p class="small fst-italic">"${card.tagline}"</p>
        `;

        container.appendChild(cardDiv);
    });

    drawAuraChart();
}

function drawAuraChart() {
    const chartDiv = document.getElementById('aura_element_chart');
    if (!chartDiv) return;

    const elementCounts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };

    currentReading.forEach(cardName => {
        const foundCard = majorArcanaData.cards.find(item => item.name === cardName);
        if (foundCard) elementCounts[foundCard.element]++;
    });

    const data = google.visualization.arrayToDataTable([
        ['Element', 'Presence'],
        ['Fire', elementCounts.Fire],
        ['Water', elementCounts.Water],
        ['Air', elementCounts.Air],
        ['Earth', elementCounts.Earth]
    ]);

    const options = {
        pieHole: 0.4,
        backgroundColor: 'transparent',
        colors: ['#ff4d4d', '#3399ff', '#b3b3b3', '#85664d'],
        legend: { position: 'bottom', textStyle: { color: '#ffffff' } },
        chartArea: { width: '100%', height: '80%' },
        pieSliceBorderColor: "none"
    };

    const chart = new google.visualization.PieChart(document.getElementById('aura_element_chart'));
    chart.draw(data, options);
}

// Await DOM load
// Aguarda o documento carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-button');

    if (drawBtn) {
        drawBtn.addEventListener('click', performReading);
        console.log("Aura Tarot: Reading page detected. Button ready.");
    } else {
        console.log("Aura Tarot: Home page detected. Skipping reading logic.");
    }
});

// Listener for window resize to redraw chart)
window.addEventListener('resize', () => {
    const chartDiv = document.getElementById('aura_element_chart');
    if (chartDiv && currentReading.length > 0) {
        drawAuraChart();
    }
});