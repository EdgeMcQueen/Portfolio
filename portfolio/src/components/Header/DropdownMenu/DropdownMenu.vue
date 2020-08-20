<template>
    <div class="dropdown">
        <div :class="dropToggle.class + ` ${dropToggle.class}${dropToggle.state}`">
            <div :class="dropToggle.class+'__icon'">
            <svg :class="dropToggle.class+'__arrow'"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24">
                <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"></path>
            </svg>
            </div>
        </div>
    <!--   dropdown nav menu    -->
    <ul :class="dropClass">
      <li :class="dropClass+'__item'" v-for="(navItem, index) in navList" :key="index">
        <a :class="dropClass+'__link'" :href="navItem.href">{{ navItem.content }}</a>
      </li>
    </ul>
    </div>
</template>

<script>
export default {
    props: {
        navList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            dropToggle:{
                class: 'dropMenu-toggle',
                state: '--hide',
            },
            dropClass: 'dropdown-nav-menu',
            scrollValue: null
        }
    },
    methods: {
        updateScroll() {
            this.scrollValue = window.scrollY
            if (this.scrollValue <= 100) {
                this.dropToggle.state = '--hide'
            } else {
                this.dropToggle.state = '--show'
            }
        }
    },

    mounted() {
        window.addEventListener('scroll', this.updateScroll);
    },
    destroy() {
        window.removeEventListener('scroll', this.updateScroll)
    }
}
</script>