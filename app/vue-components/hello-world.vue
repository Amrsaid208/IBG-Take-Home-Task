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
      <div class="overall-rating">
        <h2>Overall Rating</h2>

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
import axios from 'axios';

export default {
  name: "HelloWorldComponent",
  components: {
    ReviewList
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
  width: 100%;
  padding: 20px;
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
}

.overall-rating {
  width: 40%;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

.rating-number {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rating-value {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 10px;
}

.stars {
  color: #fbc02d;
  margin-right: 10px;
}

.reviews-count {
  color: #777;
}

.rating-bars {
  margin-top: 20px;
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.bar {
  flex-grow: 1;
  height: 10px;
  background-color: #e0e0e0;
  margin: 0 10px;
  border-radius: 5px;
  position: relative;
}

.fill {
  height: 100%;
  border-radius: 5px;
}

.rating-overtime-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.rating-overtime-button:hover {
  background-color: #0056b3;
}

.reviews-list-container {
  width: 55%;
  margin-left: 5%;
}
</style>
