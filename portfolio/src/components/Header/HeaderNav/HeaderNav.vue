<template>
  <nav class="nav">
    <!-- HeaderNav -->
    <ul :class="navClass">
      <li
        :class="navClass + '__item'"
        v-for="(navItem, index) in navList"
        :key="index"
      >
        <a :class="navClass + '__link'" :href="navItem.href">{{
          navItem.content
        }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
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
  components: {},
  data() {
    return {};
  }
};
</script>
