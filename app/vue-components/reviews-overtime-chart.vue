<template>
  <div class="c-chart__container">
    <!-- Date Range Inputs -->
    <div class="date-picker">
      <input type="date" id="start-date" v-model="startDate" @change="filterChartData" />
      <input type="date" id="end-date" v-model="endDate" @change="filterChartData" />
    </div>

    <!-- Loading Message -->
    <div v-if="loading" class="loading-message">
      Loading chart data...
    </div>

    <!-- No Data Found -->
    <div v-if="!loading && filteredData.length === 0" class="no-data-found">
      <p>No data available for the selected date range.</p>
    </div>

    <!-- Chart -->
    <v-chart   v-if="filteredData.length > 0 && !loading" ref="chart" :option="chartOptions" />

    <!-- Error Message -->
    <div v-if="error" class="error-message">Failed to load chart data.</div>
  </div>
</template>

<script>
import moment from "moment";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
]);

export default {
  name: "PerformanceChartComponent",
  components: {
    VChart,
  },
  data() {
    return {
      chartData: [], // Chart data fetched from the API
      filteredData: [], // Filtered chart data based on date range
      loading: true, // Loading state
      error: false, // Error state
      startDate: "", // Start date for filtering
      endDate: "", // End date for filtering
    };
  },

  computed: {
    chartOptions() {
      return {
        title: {
          left: 'center',
          top: 'bottom',
          text: 'Reviews Overtime'
        },
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0,
          confine: false,
          hideDelay: 0,
          padding: 0,
        },
        grid: {
          left: "30px",
          right: "12px",
          bottom: "60px",
          top: "6px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          showGrid: false,
          data: this.xAxisData,
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 11,
          },
        },
        yAxis: {
          axisLabel: { show: true },
          axisTick: { show: true },
          splitLine: { show: true },
        },
        series: [
          {
            data: this.yAxisData,
            type: "line",
            symbol: "circle",
            symbolSize: 2,
            cursor: "default",
            lineStyle: {
              width: 2,
            },
          },
        ],
        visualMap: {
          left: "right",
          top: "top",
          min: 0,
          max: 5,
          pieces: [
            {
              gte: 0,
              lt: 1,
              color: "#DE3842",
            },
            {
              gte: 1,
              lt: 2,
              color: "#F3B00A",
            },
            {
              gte: 2,
              lt: 3,
              color: "#FFDE48",
            },
            {
              gte: 3,
              lt: 4,
              color: "#25C55B",
            },
            {
              gte: 4,
              lt: 5,
              color: "#219B51",
            },
          ],
        },
      };
    },

    xAxisData() {
      return this.filteredData.map((item) => this.formatDate(item.date_ms));
    },

    yAxisData() {
      return this.filteredData.map((item) => item.value);
    },
  },

  methods: {
    formatDate(dateInMs) {
      return moment(dateInMs).format("DD MMM YYYY");
    },

    async fetchChartData() {
      try {
        const response = await fetch("https://frontend-task.instabug-dev.com/api/web/reviews_overall");
        const data = await response.json();
        this.chartData = data.data;
        this.filteredData = this.chartData; // Initially, the filtered data is the same as the full dataset
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = true;
        console.error("Failed to fetch chart data:", error);
      }
    },

    filterChartData() {
      if (this.startDate && this.endDate) {
        // Filter data based on the selected date range
        const start = new Date(this.startDate).getTime();
        const end = new Date(this.endDate).getTime();

        this.filteredData = this.chartData.filter(item => {
          const date = item.date_ms;
          return date >= start && date <= end;
        });
      } else {
        // If no date range is selected, show the full dataset
        this.filteredData = this.chartData;
      }
    }
  },

  mounted() {
    this.fetchChartData(); // Fetch data when the component is mounted
  },
};
</script>

<style lang="scss" scoped>
.c-chart__container {
  
  width: 100%;
  height: 480px;
  
}
.date-picker {
  margin:0 auto 63px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
  height: 36px;
  width: 50%;
  input{
    border: 0;
  }
}

.date-picker label {
  margin-right: 10px;
}

.date-picker input {
  margin: 0 10px;
}

.loading-message {
  text-align: center;
  font-size: 16px;
  color: #888;
}

.no-data-found {
  text-align: center;
  font-size: 18px;
  color: #777;
}

.error-message {
  text-align: center;
  font-size: 16px;
  color: red;
}
</style>
