<template>
  <div class="overall-rating">
    <h2>Overall Rating</h2>
    <div class="rating-header">
      <span class="rating-number">{{ averageRating }}</span>
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star">
          <img v-if="n <= Math.round(averageRating)" src="../assets/filled-star.svg" alt="filled-star">
          <img v-else src="../assets/unfill-star.svg" alt="unfilled-star">
        </span>
      </div>

      <span class="reviews-count">Based on {{ totalReviews }} reviews</span>
    </div>

    <div class="rating-bars">
      <div class="rating-row" v-for="(rating, index) in ratingCategories" :key="index">
        <span class="grade">{{ rating.label }}</span>
        <div class="row-stats">
          <div class="bar">
            <div class="fill" :style="{ width: rating.percentage + '%' }" :class="rating.class"></div>
          </div>
          <span class="percentage">{{ rating.percentage }}%</span>
        </div>
      </div>
    </div>

    <div class="btn">
      <button class="rating-overtime-button" @click="showChart = !showChart">
        {{ showChart ? 'Hide Rating Overtime' : 'Show Rating Overtime' }}
      </button>
    </div>

    <!-- Modal overlay -->
    <div v-if="showChart" class="modal-overlay" @click="showChart = false"></div>

    <!-- Conditionally display the chart when showChart is true -->
    <div v-if="showChart" class="chart-modal">
      <div class="chart-content">
        <PerformanceChartComponent />
      </div>
    </div>
  </div>
</template>

<script>
import PerformanceChartComponent from './reviews-overtime-chart.vue'; // Import the chart component

export default {
  name: "OverallRating",
  components: {
    PerformanceChartComponent // Register the chart component
  },
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showChart: false, // Flag to control chart visibility
    };
  },
  computed: {
    totalReviews() {
      return this.reviews.length;
    },
    averageRating() {
      const totalStars = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      return ((totalStars / this.totalReviews) || 0).toFixed(1);
    },
    ratingCategories() {
      const ratingCounts = { excellent: 0, good: 0, fair: 0, poor: 0, unacceptable: 0 };

      this.reviews.forEach((review) => {
        if (review.rating === 5) ratingCounts.excellent++;
        else if (review.rating === 4) ratingCounts.good++;
        else if (review.rating === 3) ratingCounts.fair++;
        else if (review.rating === 2) ratingCounts.poor++;
        else ratingCounts.unacceptable++;
      });

      let rawPercentages = [
        (ratingCounts.excellent / this.totalReviews || 0) * 100,
        (ratingCounts.good / this.totalReviews || 0) * 100,
        (ratingCounts.fair / this.totalReviews || 0) * 100,
        (ratingCounts.poor / this.totalReviews || 0) * 100,
        (ratingCounts.unacceptable / this.totalReviews || 0) * 100,
      ];

      let roundedPercentages = rawPercentages.map(Math.round);
      let totalPercentage = roundedPercentages.reduce((acc, val) => acc + val, 0);

      const diff = 100 - totalPercentage;
      if (diff !== 0 && diff != 100) {
        const indexToAdjust = rawPercentages.indexOf(Math.max(...rawPercentages));
        roundedPercentages[indexToAdjust] += diff;
      }

      return [
        { label: 'Excellent', percentage: roundedPercentages[0], class: 'excellent' },
        { label: 'Good', percentage: roundedPercentages[1], class: 'good' },
        { label: 'Fair', percentage: roundedPercentages[2], class: 'fair' },
        { label: 'Poor', percentage: roundedPercentages[3], class: 'poor' },
        { label: 'Unacceptable', percentage: roundedPercentages[4], class: 'unacceptable' },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.overall-rating {
  border-radius: 10px;
  width: 100%;
}

.rating-header {
  display: flex;
  align-items: center;

  .rating-number {
    margin-right: 8px;
    font-size: 23px;
    font-weight: 500;
    line-height: 18px;
    text-align: left;
    color: #000;
  }

  .stars {
    display: flex;
    align-items: center;

    .star {
      margin-right: 8px;
    }
  }

  .reviews-count {
    color: #777777;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    text-align: left;
  }
}

.rating-bars {
  margin-top: 56px;

  .rating-row {
    display: flex;
    align-items: center;
    margin-bottom: 39px;
    justify-content: space-between;
    width: 547px;

    .grade {
      font-size: 23px;
      font-weight: 400;
      line-height: 18px;
      text-align: left;
      color: #000;
    }

    .percentage {
      font-size: 23px;
      font-weight: 500;
      line-height: 18px;
      text-align: left;
      // color: #777777;
      color:#555555;
      flex: 1;
    }
  }

  .row-stats {
    display: flex;
    width: 62.5%;
    justify-content: space-between;
    align-items: center;
    height: 18px;
  }

  .bar {
    height: 13px;
    background-color: #e0e0e0;
    margin-right: 16px;
    border-radius: 8px;
    position: relative;
    width: 82%;
  }

  .fill {
    height: 100%;
    border-radius: 5px;
  }

  .excellent {
    background-color: $excellent-rating;
  }

  .good {
    background-color: $good-rating;
  }

  .fair {
    background-color: $fair-rating;
  }

  .poor {
    background-color: $poor-rating;
  }

  .unacceptable {
    background-color: $unacceptable-rating;
  }
}

.btn {
  display: flex;
  justify-content: center;
  margin-top: 40px;

  .rating-overtime-button {
    background-color: $button-bg;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
}

/* Modal and Chart Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 999; /* Above everything else */
}

.chart-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Above overlay */
  height: 668px;
  width: 943px;
  padding: 51px 82px 38px;
}

.chart-content {
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #888;
}

.close-button:hover {
  color: #555;
}

.chart-container {
  margin-top: 30px;
  height: 300px;
}
</style>
