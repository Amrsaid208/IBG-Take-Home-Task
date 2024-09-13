<template>
    <div class="review-card">
        <div class="review-header">
            <div class="user-info">
                <div class="avatar">
                    <template v-if="review.user_avatar">
                        <img width="36"  height="54"loading="lazy" :src="review.user_avatar" alt="author-avatar" />
                    </template>
                    <template v-else>
                        <div class="initials"
                            :style="{ backgroundColor: randomBgColor, color: getTextColorForBg(randomBgColor) }">
                            {{ initials }}
                        </div>
                    </template>
                </div>
                <div class="author-name">
                    <h3>{{ displayAuthorName }}</h3>
                </div>
            </div>
            <div class="review-date">{{ formattedDate }}</div>
        </div>
        <div class="rating">
            <span v-for="(star, index) in 5" :key="index" class="star">
                <img width="16" height="16" v-if="index < review.rating" src="../assets/filled-star.svg" alt="author-avatar" />
                <img width="16" height="16" v-else src="../assets/unfill-star.svg" alt="unfilled star" />
            </span>
        </div>
        <p class="review-content">{{ review.content }}</p>
    </div>
</template>

<script>
export default {
    name: "ReviewCard",
    props: {
        review: {
            type: Object,
            required: true,
        },
    },
    computed: {
        initials() {
            if (this.review.user_id) {
                const names = this.review.user_id.split("-");
                return names.length > 1 ? names[0][0] + names[1][0] : this.review.user_id.substring(0, 2);
            }
            return "";
        },
        displayAuthorName() {
            if (this.review.user_id) {
                const names = this.review.user_id.split("-");
                return names.length > 1 ? `${names[0]} ${names[1][0]}.` : this.review.user_id;
            }
            return "Anonymous";
        },
        randomBgColor() {
            return this.hexToRgba(this.randomColor(), 0.2);
        },
        formattedDate() {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(this.review.created_at).toLocaleDateString(undefined, options);
        },
    },
    methods: {
        randomColor() {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            return `#${randomColor.padStart(6, "0")}`;
        },
        hexToRgba(hex, alpha) {
            const bigint = parseInt(hex.substring(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },
        getTextColorForBg(bgColor) {
            const color = bgColor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
            let r = parseInt(color[0]) / 255;
            let g = parseInt(color[1]) / 255;
            let b = parseInt(color[2]) / 255;

            // Apply gamma correction (sRGB space)
            r = (r <= 0.03928) ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
            g = (g <= 0.03928) ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
            b = (b <= 0.03928) ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

            // Calculate relative luminance
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            // Define white and black luminance for comparison
            const whiteLuminance = 1;
            const blackLuminance = 0;

            // Calculate contrast ratio with black and white
            const contrastWithWhite = (whiteLuminance + 0.05) / (luminance + 0.05);
            const contrastWithBlack = (luminance + 0.05) / (blackLuminance + 0.05);

            // Return the color that provides the best contrast
            return contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#000000';
        }
    }

};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.review-card {
    background-color: #fff;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}

.review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.avatar {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ddd;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 8px;
}

.initials {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-family: "Inter";
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
}

.user-info {
    display: flex;
    align-items: center;
}

.author-name {
    h3 {
        color: $dark-blue;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        text-transform: capitalize;
    }

}

.rating {
    display: flex;

    img {
        margin-right: 8px;
    }
}

.review-date {
    font-family: $secondary-font;
    font-size: 12px;
    font-weight: 600;
    color: $dark-gray;
}

.review-content {
    font-size: 14px;
    font-weight: 400;
    color: $dark-blue;
}
</style>
