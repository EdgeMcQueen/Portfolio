/* eslint-disable prettier/prettier */
<template>
  <div class="dropdown">
    <!--   dropdown nav menu    -->
    <ul :class="dropClass"  v-if="menuHide" >
      <li
        :class="dropClass + '__item'"
        v-for="(navItem, index) in navList"
        :key="index">
        <a :class="dropClass + '__link'" :href="navItem.href">{{
          navItem.content
        }}</a>
      </li>
    </ul>
    <!-- dropdown toggle -->
    <div :class="dropToggle.class" @click="$emit('show-toggle')">
      <div :class="dropToggle.class + '__icon'">
        <svg
          :class="dropToggle.class + '__arrow'"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24">
          <path
            d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"
          ></path>
        </svg>
      </div>
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
      dropToggle: {
        class: "dropMenu-toggle",
      },
      dropClass: "dropdown-nav-menu",
    };
  },
};
</script>
