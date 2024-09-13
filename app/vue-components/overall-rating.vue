<template>
  <div class="overall-rating">
    <h2>Overall Rating</h2>
    <div class="rating-header">
      <span class="rating-number">{{ averageRating }}</span>
      <div class="stars">
        <span v-for="n in 5" class="star">
          <img v-if="n < averageRating" src="../assets/filled-star.svg" alt="filled-star">
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
      <button class="rating-overtime-button">Rating overtime</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverallRating",
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // Calculate the total number of reviews
    totalReviews() {
      return this.reviews.length;
    },
    // Calculate the average rating
    averageRating() {
      const totalStars = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      return ((totalStars / this.totalReviews) || 0).toFixed(1);
    },
    // Generate the percentage of each rating category
    ratingCategories() {
      const ratingCounts = { excellent: 0, good: 0, fair: 0, poor: 0, unacceptable: 0 };

      this.reviews.forEach((review) => {
        if (review.rating === 5) ratingCounts.excellent++;
        else if (review.rating === 4) ratingCounts.good++;
        else if (review.rating === 3) ratingCounts.fair++;
        else if (review.rating === 2) ratingCounts.poor++;
        else ratingCounts.unacceptable++;
      });
      if (this.totalReviews) {

      }
      let rawPercentages = [
        (ratingCounts.excellent / this.totalReviews || 0) * 100,
        (ratingCounts.good / this.totalReviews || 0) * 100,
        (ratingCounts.fair / this.totalReviews || 0) * 100,
        (ratingCounts.poor / this.totalReviews || 0) * 100,
        (ratingCounts.unacceptable / this.totalReviews || 0) * 100
      ];

      // Round the raw percentages and calculate the total
      let roundedPercentages = rawPercentages.map(Math.round);
      let totalPercentage = roundedPercentages.reduce((acc, val) => acc + val, 0);

      // Adjust the largest or smallest value to make the sum equal to 100
      const diff = 100 - totalPercentage;
      if (diff !== 0 && diff != 100) {
        const indexToAdjust = rawPercentages.indexOf(Math.max(...rawPercentages)); // Adjust the largest percentage
        roundedPercentages[indexToAdjust] += diff;
      }

      return [
        { label: 'Excellent', percentage: roundedPercentages[0], class: 'excellent' },
        { label: 'Good', percentage: roundedPercentages[1], class: 'good' },
        { label: 'Fair', percentage: roundedPercentages[2], class: 'fair' },
        { label: 'Poor', percentage: roundedPercentages[3], class: 'poor' },
        { label: 'Unacceptable', percentage: roundedPercentages[4], class: 'unacceptable' },
      ];
    }
  },

};
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.overall-rating {
  border-radius: 10px;
  width: 100%;

  h2 {
    font-size: 32px;
    font-weight: 500;
    line-height: 48px;
    text-align: left;
    color: $dark-blue;
    margin: 0 0 16px;
  }
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
    color: #555555; 
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
      color: #555555;
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
</style>
