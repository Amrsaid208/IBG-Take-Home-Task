<template>
    <div class="search-filter-container">
        <input v-model="searchQuery" @input="applyFilters" type="text" class="search-input"
            placeholder="Search by user name or description" />
        <div class="custom-select-wrapper">
            <select id="rating-select" v-model="selectedRating" @change="applyFilters" class="custom-select"
                aria-labelledby="rating-select-label">
                <option value="all" aria-label="All Ratings">All Ratings</option>
                <option value="5" aria-label="Excellent">Excellent</option>
                <option value="4" aria-label="Good">Good</option>
                <option value="3" aria-label="Fair">Fair</option>
                <option value="2" aria-label="Poor">Poor</option>
                <option value="1" aria-label="Unacceptable">Unacceptable</option>
            </select>

            <!-- Custom dropdown arrow -->
            <span class="custom-arrow"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchAndFilter',
    data() {
        return {
            searchQuery: '',
            selectedRating: 'all',

        };
    },
    methods: {
        applyFilters() {
            // Emit the search query and selected rating to the parent
            this.$emit('filterReviews', {
                searchQuery: this.searchQuery.trim(),
                selectedRating: this.selectedRating
            });
        }
    }
};
</script>

<style scoped>
.search-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.search-input {
    width: 82%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.custom-select-wrapper {
    position: relative;
    width: 12%;
    padding: 8px;
}

.custom-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    text-align: left;

}

.custom-select:hover {
    cursor: pointer;
}

.custom-arrow {
    position: absolute;
    top: 50%;
    right: 15px;
    pointer-events: none;
    /* Ensures the arrow doesn't interfere with clicks */
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #333;
}

/* Style for the dropdown options */
.custom-select option {
    padding: 10px;
    text-align: left;
}

.custom-select option:hover {
    background-color: #f0f0f0;
}
</style>