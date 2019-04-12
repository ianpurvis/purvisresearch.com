<template>
  <div class="autoscaled-mask">
    <div class="autoscaled-container" v-bind:style="style">
      <div class="autoscaled-content" ref="content">
         <slot></slot>
      </div>
    </div>
  </div>
</template>

<script src="./autoscaled-div.js"></script>
<style src="./autoscaled-div.scss" lang="scss"></style>
