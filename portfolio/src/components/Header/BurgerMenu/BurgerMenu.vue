<template>
    <div class="burger">
        <!--burger nav menu-->
        <div class="burger-container" @click="$emit('show-toggle')">
          <div class="burger-icon">
            <div class="burger-icon__bar burger-icon__topBar"></div>
            <div class="burger-icon__bar burger-icon__cenBar"></div>
            <div class="burger-icon__bar burger-icon__botBar"></div>
          </div>
        </div>
        <!-- burger menu -->
        <div class="burger-menu">
          <ul :class="burgerClass" v-if="menuHide">
            <li :class="burgerClass+'__item'" v-for="(navItem, index) in navList" :key="index">
              <a :class="burgerClass+'__link'" :href="navItem.href">{{ navItem.content }}</a>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    navList: {
      type: Array,
      required: true
    },
    menuHide: {
        type: Boolean,
        required: true
    }
  },
  data() {
    return {
      burgerClass: 'nav-burger'
    }
  },
}
</script>