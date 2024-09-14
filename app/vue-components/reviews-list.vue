<template>
    <div class="reviews-list" ref="reviewsList" @scroll="handleScroll">
        <div v-if="!loading && !error && reviews.length === 0" class="no-reviews-state">
            <div class="no-reviews-icon">
                <img src="../assets/empty.png" alt="No reviews" />
            </div>
            <p class="no-reviews-message">No reviews found!</p>
            <p class="no-reviews-subtext">Try another search or wait for new reviews</p>
        </div>

        <ul v-if="reviews.length && !error">
            <li v-for="(review, index) in reviews" :key="index" class="review-item"
                :ref="index === reviews.length - 1 ? 'lastReview' : ''">
                <ReviewCard :review="review" />
            </li>
        </ul>
        <div v-if="loading && currentPage === 1 && !error">
            <div v-for="n in 10" :key="n" class="skeleton-loading">
                <SkeletonLoader />
            </div>
        </div>

        <div v-else-if="loading && currentPage > 1 && !error" class="skeleton-loading">
            <SkeletonLoader />
        </div>

        <!-- Error state -->
        <div v-if="error" class="error-state">
            <div class="error-icon">
                <img src="../assets/error.png" alt="Error" />
            </div>
            <p class="error-message">Something went wrong!</p>
            <a @click="$emit('reloadReviews')" class="reload-link">Reload</a>
        </div>
    </div>
</template>

<script>
import ReviewCard from './review-card.vue';
import SkeletonLoader from './skeleton-loader.vue';

export default {
    name: 'ReviewList',
    components: {
        ReviewCard,
        SkeletonLoader
    },
    props: {
        reviews: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: Boolean,
            default: false
        },
        currentPage: {
            type: Number,

        },
        hasNextPage:{
            type:Boolean,
            default:true
        },
        isFiltered:{
            type:Boolean,
            default:false
        }
    },
    methods: {
        handleScroll() {
            const element = this.$refs.reviewsList;
            const bottomOfElement =
                element.scrollTop + element.clientHeight >= element.scrollHeight - 10;

            if (bottomOfElement && this.hasNextPage && !this.isFiltered) {
                this.$emit('scrollToEnd');
            }
        }
    }
};
</script>

<style scoped></style>
<style lang="scss" scoped>
.reviews-list {
    width: 100%;
    max-height: 100%;
    overflow-y: auto;

    ul {
        list-style: none;
        padding: 0;
    }

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }

    .no-reviews-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;

        .no-reviews-icon {
            margin-bottom: 16px;
            width: 100px;
            height: 100px;
            box-shadow: 0px 0px 4px 2px #0000001A;
            margin-bottom: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
           
        }

        .no-reviews-message {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f1f1f;
            margin-bottom: 8px;
        }

        .no-reviews-subtext {
            font-size: 1rem;
            color: #888;
        }
    }

    /* Error state */
    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: #333;

        .error-icon {
            width: 100px;
            height: 100px;
            box-shadow: 0px 0px 4px 2px #0000001A;
            margin-bottom: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            
        }

        .error-message {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f1f1f;
            margin-bottom: 8px;
        }

        .reload-link {
            font-size: 1rem;
            color: #0066cc;
            text-decoration: underline;
            cursor: pointer;

            &:hover {
                color: #004da3;
            }
        }
    }

    .skeleton-loading {
        text-align: center;
        margin-top: 16px;
    }

    .review-item {
        margin-bottom: 16px;
    }
}
</style>
