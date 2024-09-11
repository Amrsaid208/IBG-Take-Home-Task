<template>
  <div class="main-container">
    <div class="header">
      <input type="text" class="search-input" placeholder="Search by user name or description" />
      <select class="rating-filter">
        <option>All Ratings</option>
        <option>5 Stars</option>
        <option>4 Stars</option>
        <option>3 Stars</option>
        <option>2 Stars</option>
        <option>1 Star</option>
      </select>
    </div>

    <div class="content">
      <div class="rating">
        <OverallRating :reviews="reviews" />
      </div>

      <div class="reviews-list-container">
        <ReviewList :reviews="reviews" :loading="loading" :error="error" :currentPage="currentPage" :hasNextPage="hasNextPage"
          @scrollToEnd="fetchReviews" @reloadReviews="fetchReviews" />
      </div>
    </div>
  </div>
</template>

<script>
import ReviewList from './reviews-list.vue';
import OverallRating from './overall-rating.vue';
import axios from 'axios';

export default {
  name: "HelloWorldComponent",
  components: {
    ReviewList,
    OverallRating
  },
  data() {
    return {
      reviews: [],
      loading: false,
      error: false,
      currentPage: 1,
      hasNextPage: true,
    };
  },
  methods: {
    async fetchReviews() {
      if (this.loading || !this.hasNextPage) return;
      this.loading = true;
      this.error = false;
      try {
        const response = await axios.get(
          `https://frontend-task.instabug-dev.com/api/web/reviews?page=${this.currentPage}`
        );
        const { reviews, has_next } = response.data;
        this.reviews = [...this.reviews, ...reviews];
        this.hasNextPage = has_next;
        this.currentPage += 1;
      } catch (err) {
        this.error = true;
      } finally {
        setTimeout(() => {
          console.log("Setting loading to false after delay");
          this.loading = false;
        }, 1000);
      }
    }

  },
  mounted() {
    this.fetchReviews();
  }
};
</script>

<style scoped>
.main-container {
  width: 1440px;
  padding: 66px 68px 0;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 60%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.rating-filter {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.content {
  display: flex;
  justify-content: space-evenly;
  height: 80vh;
  margin-top: 40px;

}

.rating {
  width: 44.5%;
  border-radius: 10px;
}

.reviews-list-container{
  width: 49.5%;
  display: flex;
}
</style>
