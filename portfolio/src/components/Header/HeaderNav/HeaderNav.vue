<template>
  <nav class="nav">
    <!-- HeaderNav -->
    <ul :class="nav.navClass">
      <li :class="nav.navClass+'__item'" v-for="(navItem, index) in nav.navList" :key="index">
        <a :class="nav.navClass+'__link'" :href="navItem.href">{{ navItem.content }}</a>
      </li>
    </ul>
    <!-- DropdownMenu -->
    <DropdownMenu :navList="nav.navList"/>
    <!-- BurgerMenu -->
    <BurgerMenu :navList="nav.navList"/>
  </nav>
</template>

<script>
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue';
import BurgerMenu from '../BurgerMenu/BurgerMenu.vue';
export default {
  components: {
    BurgerMenu,
    DropdownMenu
  },
  data() {
    return {
      nav: {
        navClass: 'nav-menu',
        navList: [
          {href: '#home', content: 'Главная'},
          {href: '#aboutMe', content: 'О себе'},
          {href: '#skills', content: 'Навыки'},
          {href: '#portfolio', content: 'Портфолио'},
          {href: '#contacts', content: 'Контакты'},
        ]
      }
    }
  },
};
</script>

<style lang="scss">
  @import './HeaderNav.scss';
</style>