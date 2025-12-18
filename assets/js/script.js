// Load the Google Visualization API and the corechart package
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the API is loaded
google.charts.setOnLoadCallback(drawAuraChart);

function drawAuraChart() {
    // Data based on Tarot Suits / Elements
    const data = google.visualization.arrayToDataTable([
        ['Element', 'Presence'],
        ['Fire (Wands)', 3],
        ['Water (Cups)', 5],
        ['Air (Swords)', 2],
        ['Earth (Pentacles)', 4]
    ]);

    // Custom Options for Aura Tarot Theme
    const options = {
        title: 'Elemental Balance of Your Reading',
        titleTextStyle: { color: '#e0c068', fontSize: 20, bold: true }, // Gold color
        pieHole: 0.4, // Donut style
        backgroundColor: 'transparent',
        colors: ['red', 'blue', 'purple', 'green'], // Fire, Water, Air, Earth
        legend: {
            position: 'bottom',
            textStyle: { color: '#ffffff', fontSize: 13 }
        },
        chartArea: { width: '100%', height: '80%' },
        pieSliceBorderColor: "none"
    };

    // Instantiate and draw the chart
    const chart = new google.visualization.PieChart(document.getElementById('aura_element_chart'));
    chart.draw(data, options);

    // Make chart responsive on window resize
    window.addEventListener('resize', () => {
        chart.draw(data, options);
    });
}