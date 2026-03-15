/* ==========================================================
 * Chart.js Integration for Admin Dashboard
 * Uses Dark Theme tokens and smooth animations
 * ========================================================== */

// Global Chart configs
Chart.defaults.color = '#A0A0B8';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = 'rgba(42, 42, 56, 0.5)';

let invChartInstance = null;
let reqChartInstance = null;

window.renderInventoryChart = function(aggregatedData) {
    const ctx = document.getElementById('inventoryBarChart');
    if(!ctx) return;

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    if (invChartInstance) invChartInstance.destroy();

    invChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Units Available',
                data: data,
                backgroundColor: 'rgba(192, 21, 42, 0.8)', // Primary brand color
                borderColor: '#C0152A',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: '#E8192C' // Primary hover
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(42, 42, 56, 0.5)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
};

window.renderRequestChart = function(statusData) {
    const ctx = document.getElementById('requestDonutChart');
    if(!ctx) return;

    const labels = ['Pending', 'Matched', 'Fulfilled', 'Rejected'];
    const data = [
        statusData['Pending'] || 0,
        statusData['Matched'] || 0,
        statusData['Fulfilled'] || 0,
        statusData['Rejected'] || 0
    ];

    if (reqChartInstance) reqChartInstance.destroy();

    reqChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#F59E0B', // Pending (Amber)
                    '#3B82F6', // Matched (Blue)
                    '#10B981', // Fulfilled (Green)
                    '#EF4444'  // Rejected (Red)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, padding: 20 }
                }
            }
        }
    });
};
