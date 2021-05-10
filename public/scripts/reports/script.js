const reportsSelect = document.getElementById('reports');
const chartCanvas = document.getElementById('chart');

const ctx = chartCanvas.getContext('2d');

const datesSelect = document.querySelector('#dates');
const availableDates = [];

//Get available dates from server
fetch('http://localhost:3000/fetch-handlers/available-dates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    availableDates.push(...data);
    for(const date of availableDates) {
      const newOption = new Option(date, date);
      datesSelect.append(newOption);
    }
    changeDate();
  })
  .catch((error) => {
    console.error('Error:', error);
});

//Generating random color
const generateColor = function() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

const colors = [];

// const serverData = [];

// fetch('http://localhost:3000/fetch-handlers/votes', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// serverData.push()

function changeDate() {
  const selectedDate = datesSelect.value;
  if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
    drawDoughnutChart();
  }
  else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
    drawBarChart();
  }
}

datesSelect.addEventListener('change', changeDate);

let chart;

function drawDoughnutChart(data) {
  chart?.destroy();
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
          generateColor(),
          generateColor(),
          generateColor()
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 10
        }
      }
    }
  });
}

function drawBarChart(data) {
  chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Количество голосов',
          data: [3, 1, 3, 1, 2, 3,],
          backgroundColor: [
            generateColor(0.2),
            generateColor(0.2),
            generateColor(0.2),
            generateColor(0.2),
            generateColor(0.2),
            generateColor(0.2)
          ],
          borderColor: [
            generateColor(),
            generateColor(),
            generateColor(),
            generateColor(),
            generateColor(),
            generateColor()
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
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 10
          }
        }
      }
    });
}

reportsSelect.addEventListener('change', () => {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  if(reportsSelect.value === 'pie-chart' && chart?.type !== 'doughnut') {
    drawDoughnutChart();
  }
  else if(reportsSelect.value === 'graph' && chart?.type !== 'bar') {
    drawBarChart();
  }
});
