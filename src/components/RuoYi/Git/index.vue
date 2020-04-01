<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiGit',
  data() {
    return {
      // url: 'https://gitee.com/y_project/RuoYi-Vue'
      url: 'https://github.com/lurenha/blogSpringBoot'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>