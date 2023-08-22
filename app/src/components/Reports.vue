<template>
  <div>
    <div>
      <canvas ref="barChartRef"></canvas>
    </div>
    <div>
      <canvas ref="pieChartRef"></canvas>
    </div>
    <div>
      <canvas ref="lineChartRef"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

import { Chart, BarController,PieController, CategoryScale, LinearScale, ArcElement, LineController, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

export default {
  setup() {
    const barChartRef = ref(null);
    const pieChartRef = ref(null);
    const lineChartRef = ref(null);

    const apiUrl = import.meta.env.VITE_API_HOST || "http://localhost:8080";

    onMounted(async () => {
      Chart.register(BarController,PieController, CategoryScale, LinearScale, BarElement, ArcElement, LineController, PointElement, LineElement, Title, Tooltip, Legend);
      try {
        const response = await fetch(`${apiUrl}/reports`);
        const data = await response.json();
        console.log(data);

        const labels = data.map((entry) => entry.industry);

        // Bar Chart
        new Chart(barChartRef.value, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Average Work Hours',
              data: data.map((entry) => entry.avg_work_hours),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          }
        });

        // Pie Chart
        new Chart(pieChartRef.value, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              label: 'Average Vacation Hours',
              data: data.map((entry) => entry.avg_vacation_hours),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }]
          }
        });

        // Line Chart
        new Chart(lineChartRef.value, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Average Overtime Hours',
              data: data.map((entry) => entry.avg_overtime_hours),
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1
            }]
          }
        });

      } catch (error) {
        console.error("Failed to fetch report data:", error);
      }
    });

    return { barChartRef, pieChartRef, lineChartRef };
  }
}
</script>

<style scoped>
/* customize styles here */
</style>
