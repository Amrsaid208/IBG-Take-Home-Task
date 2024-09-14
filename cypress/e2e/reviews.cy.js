describe('ReviewCard Component', () => {
    beforeEach(() => {
        // Intercept the API call to the reviews endpoint and mock it with fixture data
        cy.intercept('GET', '**/reviews.json?page=1', { fixture: 'reviews.json' }).as('getReviews');
    });

    it('should display the first review card correctly', () => {
        // Visit the page where the ReviewCard component is rendered
        cy.visit('http://localhost:8081/');

        // Wait for the API call to complete
        cy.wait('@getReviews');

        // Assert the first review is displayed correctly
        cy.get('.review-item').first().within(() => {
            // Check for the user's name or initials
            cy.contains('dante l'); // Assuming 'dante l' is the user name from the fixture

            // Check that the correct number of stars are displayed
            cy.get('.star img').should('have.length', 5); // Ensure that 5 stars are rendered total
            // Uncomment if the star images have specific paths
            // cy.get('.star img[src*="../assets/filled-star.svg"]').should('have.length', 4); // 4 filled stars
            // cy.get('img[src*="../assets/unfill-star.svg"]').should('have.length', 1); // 1 unfilled star

            // Check for the review content
            cy.get('.review-content').should('contain', 'A bit pricey, but the quality justifies the cost. Very comfortable.');

            // Check the review date is displayed
            cy.get('.review-date').should('contain', 'Apr 22, 2024'); // Example date, adjust based on fixture
        });
    });

    it('should display correct aggregations based on the mock reviews', () => {
        // Visit the homepage
        cy.visit('http://localhost:8081/');

        // Wait for the API to be called and intercepted
        cy.wait('@getReviews');

        // Assert the overall rating is calculated correctly
        cy.get('.overall-rating .rating-number').should('contain', '4.2'); // The average rating should be 4.2

        // Assert the number of reviews
        cy.get('.overall-rating .reviews-count').should('contain', 'Based on 5 reviews');

        // Assert the percentages for each rating category
        cy.get('.rating-bars .rating-row').eq(0).within(() => {
            cy.contains('Excellent');
            cy.get('.percentage').should('contain', '40%'); // 2 out of 5 reviews were 5 stars
        });

        cy.get('.rating-bars .rating-row').eq(1).within(() => {
            cy.contains('Good');
            cy.get('.percentage').should('contain', '40%'); // 2 out of 5 reviews were 4 stars
        });

        cy.get('.rating-bars .rating-row').eq(2).within(() => {
            cy.contains('Fair');
            cy.get('.percentage').should('contain', '20%'); // 1 out of 5 reviews was 3 stars
        });

        cy.get('.rating-bars .rating-row').eq(3).within(() => {
            cy.contains('Poor');
            cy.get('.percentage').should('contain', '0%'); // No 2-star reviews
        });

        cy.get('.rating-bars .rating-row').eq(4).within(() => {
            cy.contains('Unacceptable');
            cy.get('.percentage').should('contain', '0%'); // No 1-star reviews
        });
    });
});

describe('Reviews Page - Skeleton Loader', () => {
    beforeEach(() => {
        // Intercept the API call to mock/stub reviews request
        cy.intercept('GET', '**/reviews.json?page=1', { fixture: 'reviews.json' }).as('getReviews');
    });

    it('should display skeleton loader while reviews are loading', () => {
        // Visit the homepage
        cy.visit('http://localhost:8081/');

        // Assert that skeleton loaders are displayed before reviews are loaded
        cy.get('.skeleton-card').should('be.visible'); // Ensure the skeleton loader is visible

        // Wait for the API to respond and reviews to be loaded
        cy.wait('@getReviews');

        // Assert the skeleton loader is no longer visible after loading the reviews
        cy.get('.skeleton-card').should('not.exist'); // Ensure the skeleton loader is gone after loading
    });

    it('should display skeleton loader when loading more reviews after scrolling', () => {
        // Intercept the initial and second page reviews
        cy.intercept('GET', '**/reviews.json?page=2', { fixture: 'reviews_page_2.json' }).as('getMoreReviews');

        // Visit the homepage
        cy.visit('http://localhost:8081/');

        // Wait for the initial reviews load
        cy.wait('@getReviews');

        // Scroll down to load more reviews (simulating infinite scroll)
        cy.get('.reviews-list').scrollTo('bottom');

        // Assert that skeleton loaders appear again when more reviews are loading
        cy.get('.skeleton-loading').should('be.visible');

        // Wait for the additional reviews to load
        cy.wait('@getMoreReviews');

        // Assert that the skeleton loaders disappear once reviews are loaded
        cy.get('.skeleton-loading').should('not.exist');
    });
});
