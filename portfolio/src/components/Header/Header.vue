<template>
  <div class="container">
    <header id="home" class="main-header">
    <!-- Header Nav -->
    <HeaderNav  :navClass="navClass" :navList="navList" />
      <!-- header content -->
      <div class="header-content">
        <p class="author__name">Муталов Сардор</p>
        <p class="author__description">
          Фронтенд-разработчик
          <br />
          <span class="author__age">28</span>
          лет, Липецк
        </p>
        <div class="author-photo">
          <img
            src="https://images.unsplash.com/photo-1547093349-65cdba98369a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
            alt=""
            class="author-photo__img"
          />
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import HeaderNav from './HeaderNav/HeaderNav.vue';
export default {
  props: {
    navClass: {
      type: String,
      required: true
    },
    navList: {
      type: Array,
      required: true
    }
  },
  components: {
    HeaderNav,

    }
};
</script>

<style lang="scss"></style>
