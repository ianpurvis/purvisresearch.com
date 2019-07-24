<template>
  <main>
    <div class="snake label" v-tight>
      <nuxt-link class="tighten inherit-color" to="/" v-tight>
        <span class="stretch" v-html="snake('Purvis ')"></span>
        <span>Research</span>
      </nuxt-link>
      <h1 v-tight>
        <span v-html="snake('Nov 2017')"></span>
        <span class="underscore replace-2 nomobile">: </span>
        <canvas ref="canvas">{{ description }}</canvas>
      </h1>
      <address>
        <a v-unobfuscate:href="'mailto:ian@purvisresearch@@com'">ian@purv<span class="stretch">isresearch.c0m</span></a>
      </address>
    </div>
  </main>
</template>

<style src="./nov.scss" lang="scss" scoped></style>
<script src="./nov.js"></script>
