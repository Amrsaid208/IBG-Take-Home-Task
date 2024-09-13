<template>
  <div class="main-container">
    <div class="header">
      <SearchAndFilter @filterReviews="filterReviews" />
    </div>

    <div class="content">
      <div class="rating">
        <OverallRating :reviews="filteredReviews" />
      </div>

      <div class="reviews-list-container">
        <ReviewList :reviews="filteredReviews" :loading="loading" :error="error" :currentPage="currentPage"
          :hasNextPage="hasNextPage" :isFiltered="isFiltered" @scrollToEnd="fetchReviews"
          @reloadReviews="fetchReviews" />
      </div>
    </div>
  </div>
</template>

<script>
import ReviewList from './reviews-list.vue';
import OverallRating from './overall-rating.vue';
import axios from 'axios';
import SearchAndFilter from './search-and-filter.vue';

export default {
  name: "HelloWorldComponent",
  components: {
    ReviewList,
    OverallRating,
    SearchAndFilter
  },
  data() {
    return {
      reviews: [],
      filteredReviews: [],
      loading: false,
      error: false,
      currentPage: 1,
      hasNextPage: true,
      isFiltered: false
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
        this.filteredReviews = this.reviews
        this.hasNextPage = has_next;
        this.currentPage += 1;
      } catch (err) {
        this.error = true;
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },
    filterReviews({ searchQuery, selectedRating }) {
      if (searchQuery === '' && selectedRating === 'all') {
        // Reset to all reviews when no filters are applied
        this.isFiltered = false
        this.filteredReviews = this.reviews
    } else {
        this.isFiltered = true;
        this.filteredReviews = this.reviews.filter(review => {
          const matchesSearchQuery = searchQuery === '' ||
            (review.user_id.split("-").join(" ").toLowerCase().startsWith(searchQuery.toLowerCase()) || review.content.toLowerCase().includes(searchQuery.toLowerCase()));

          // Filter by selected rating
          const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating);

          // Return true only if both search query and rating match
          return matchesSearchQuery && matchesRating;
        });
       
      }
    }
  },
  mounted() {
    this.fetchReviews();
  },
  
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

.reviews-list-container {
  width: 49.5%;
  display: flex;
}
</style>
