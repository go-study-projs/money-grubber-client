<template>
  <div class="layout-wrapper">
    <div class="content" :class="classPrefix && `${classPrefix}-content`">
      <slot/>
    </div>
    <div v-if="notMoney">
      <Nav/>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: ['classPrefix','notMoney'],
    name: 'Layout'
  };
</script>

<style scoped lang="scss">
  .layout-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .content {
    overflow: hidden;
    flex-grow: 1;
  }
</style>