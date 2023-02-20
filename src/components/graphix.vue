<template>
  <Snake class="label">
    <nuxt-link class="tighten inherit-color" to="/">
      <span class="stretch">Purvis </span>
      <span>Research</span>
    </nuxt-link>
    <h1>
      <span>{{ $attrs.edition }}</span>
      <span class="nomobile">: </span>
      <canvas ref="canvas">{{ $attrs.description }}</canvas>
    </h1>
    <address>
      <a v-unobfuscate:href="'mailto:ian@purvisresearch@@com'">ian@purv<span class="stretch">isresearch.c0m</span></a>
    </address>
  </Snake>
</template>

<script>
import Tight from 'vue-tight'
import Unobfuscate from '~/directives/unobfuscate.js'
import { snake } from '~/util/snake.js'

export default {
  directives: {
    Tight,
    Unobfuscate
  },
  setup() {
    return { snake }
  }
}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import 'bulma/sass/utilities/initial-variables';
@import 'bulma/sass/utilities/derived-variables';
@import 'bulma/sass/utilities/mixins';
@import '~/assets/stylesheets/libre-barcode-128-text-regular';
@import '~/assets/stylesheets/snake';

$mobile-width: 568px;

:deep(a) {
  font-style: normal;
}

:deep(address) {
  display: inline;
}

:deep(canvas) {
  bottom: 0;
  height: 100%;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
}

:deep(h1) {
  display: inline;

  @include from($mobile-width) {
    &::before {
      content: '_';
    }
  }
}

main {
  position: relative;
}

:deep(.inherit-color) {
  color: inherit;

  &:hover {
    color: inherit;
  }
}

:deep(.label) {
  font-family: 'Libre Barcode 128 Text', sans-serif;
  font-size: 96px;
  letter-spacing: 0.125ch;
  line-height: 1.125;
  max-width: 320px;

  @include from($mobile-width) {
    letter-spacing: 0.06ch;
    max-width: $mobile-width;
  }
}

:deep(.nomobile) {
  @include until($mobile-width) {
    display: none !important;
  }
}

:deep(.stretch) {
  @include until($mobile-width) {
    letter-spacing: 0.33ch;

    .underscore {
      // Margin equals characters replaced * -(1ch + letter spacing)
      margin-right: 1 * -(1ch + 0.33ch);
    }
  }
}

:deep(.tighten) {
  @include from($mobile-width) {
    letter-spacing: 0.125ch;

    .underscore {
      // Margin equals characters replaced * -(1ch + letter spacing)
      margin-right: 1 * -(1ch + 0.125ch);
    }
  }
}

</style>
