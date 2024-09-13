<template>
  <div class="not-found-container">
    <div class="error-code">404</div>
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/" class="home-button">Go back home</a>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage'
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f9f9f9;
}

.error-code {
  color: #4D74F4;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 40px;
  font-weight: 500;
  line-height: 60px;
  text-align: center;

}

h1 {
  margin: 8px 0 10px;
  color: #0D0C22;
  font-size: 50px;
  font-weight: 500;
  line-height: 75px;
  text-align: center;

}

p {
  font-size: 19px;
  font-weight: 400;
  line-height: 28.5px;
  text-align: center;

}

.home-button {
  display: inline-block;
  padding:16px;
  background-color: #4D74F4;
  color: white;
  text-decoration: none;
  font-size: 16px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  text-align: left;
  cursor: pointer;


}
</style>
