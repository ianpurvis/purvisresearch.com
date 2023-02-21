<template>
  <div class="autoscaled-container">
    <div class="autoscaled-transformer" v-bind:style="style">
      <div class="autoscaled-content" ref="content">
         <slot></slot>
      </div>
    </div>
    <!--
      Chrome does not calculate container height correctly on first layout.
      As a workaround, trigger an additional layout after mount via conditional
      rendering of the following div:
    -->
    <div v-if="!isWatchingDOM"></div>
  </div>
</template>

<script src="./autoscaled-div.js"></script>
<style src="./autoscaled-div.scss" lang="scss"></style>
