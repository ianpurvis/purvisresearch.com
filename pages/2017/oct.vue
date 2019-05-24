<template>
  <main>
    <div class="snake label">
      <nuxt-link class="tighten inherit-color" to="/"><!--
      ----><span class="stretch" v-html="snake('Purvis ')"></span><!--
      ----><span>Research</span><!--
      --></nuxt-link><!--
      --><h1><!--
      ----><span v-html="snake('Oct 2017')"></span><!--
      ----><span class="underscore replace-2 nomobile">: </span><!--
      ----><canvas ref="canvas">{{ description }}</canvas><!--
      --></h1><!--
      --><address><!--
      ----><a v-unobfuscate:href="'mailto:ian@purvisresearch@@com'">ian@purv<span class="stretch">isresearch.c0m</span></a><!--
      --></address>
    </div>
  </main>
</template>

<style src="./oct.scss" lang="scss" scoped></style>
<script src="./oct.js"></script>
