<template>
    <div class="skeleton-card">
      <div class="skeleton-avatar"></div>
  
      <div class="skeleton-content">
        <div class="skeleton-header">
          <div class="skeleton-text short"></div>
          <div class="skeleton-text date"></div>
        </div>
  
        <div  class="skeleton-stars">
            
            <img v-for="star in 6" src="../assets/unfill-star.svg" alt="author-avatar" />
        </div>
  
        <div class="skeleton-lines">
          <div class="skeleton-text long"></div>
          <div class="skeleton-text long"></div>
          <div class="skeleton-text medium"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SkeletonLoader",
  };
  </script>
  
  <style lang="scss" scoped>
  .skeleton-card {
    display: flex;
    padding: 16px;
    background-color: #fff;
    margin-bottom: 16px;
  }
  
  .skeleton-avatar {
    width: 50px;
    height: 50px;
    background-color: #e0e0e0;
    border-radius: 50%;
    margin-right: 16px;
  }
  
  .skeleton-content {
    flex-grow: 1;
  }
  
  .skeleton-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .skeleton-text {
    height: 12px;
    background-color: #e0e0e0;
    border-radius: 4px;
  }
  
  .skeleton-text.short {
    width: 100px;
  }
  
  .skeleton-text.date {
    width: 80px;
  }
  
  .skeleton-stars {
    display: flex;
    margin-bottom: 16px;
    img{
        margin-right: 8px;
    }
  }
  
  .skeleton-star {
    width: 20px;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 50%;
    margin-right: 4px;
   
  }
  
  .skeleton-lines .skeleton-text {
    margin-bottom: 8px;
  }
  
  .skeleton-text.long {
    width: 100%;
  }
  
  .skeleton-text.medium {
    width: 75%;
  }
  
  
  </style>
  