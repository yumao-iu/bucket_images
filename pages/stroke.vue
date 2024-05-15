<template>
  <div>
    <svg width="224" height="224" viewBox="0 0 48 48" fill="none">
      <path
        d="M10 24L20 34L40 14"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
<script setup>
</script>

<style lang="less">
div {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 202px;
    path {
      stroke: green;
      width: 200px;
      stroke-dasharray: 45;
      stroke-dashoffset: 45;
      animation: path 1s ease infinite;
    }
  }
  @keyframes path {
    0% {
      stroke-dashoffset: 45;
    }

    100% {
      stroke-dashoffset: 0;
    }
  }
}
</style>