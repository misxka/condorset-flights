const reportsSelect = document.getElementById('reports');
const chartCanvas = document.getElementById('chart');

const ctx = chartCanvas.getContext('2d');

let chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
      labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [3, 1, 2],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

reportsSelect.addEventListener('change', () => {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  if(reportsSelect.value === 'pie-chart' && chart.type !== 'doughnut') {
    chart.destroy();
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [3, 1, 2],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  else if(reportsSelect.value === 'graph' && chart.type !== 'bar') {
    chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Количество голосов',
          data: [3, 1, 3, 1, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,        
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
});
