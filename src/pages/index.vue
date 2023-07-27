<template>
  <main>
    <Stretch :max-scale=2.8>
      <div class="boxx">
        <h1>
          <nuxt-link to="/" class="inline-block">
            <img src="../assets/images/qr-logo-200x280.svg" alt="Purvis Research" class="qr-logo"/>
          </nuxt-link>
        </h1>
      </div>
      <div class="boxx">
        <h2>Ian Purvis</h2>
        <ul class="snake-list skills" v-tight>
          <li>Startup Technology</li>
          <li>Research</li>
          <li>Design</li>
          <li>Development</li>
          <li>Testing</li>
          <li>DevOps</li>
          <li>Project Management</li>
        </ul>
      </div>
      <div class="boxx" lang="ja">
        <!-- eslint-disable-next-line no-irregular-whitespace -->
        <h2>イアン&#x3000;パービス</h2>
        <ul class="snake-list skills" v-tight>
          <li>スタートアップテクノロジー</li>
          <li>リサーチ</li>
          <li>デザイン</li>
          <li>デベロップメント</li>
          <li>テスティング</li>
          <li>DevOps</li>
          <li>プロジェクトマネジメント</li>
        </ul>
      </div>
      <div class="boxx">
        <nav class="experiments snake-list" v-tight>
          <h2>Digital Art Experiments</h2>
          <ul class="snake-list" v-tight>
            <li v-for="(experiment, index) in experiments" :key="index">
              <span>{{ experiment.title }}&nbsp;</span>
              <nuxt-link :to="experiment.route">{{ experiment.description }}</nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="boxx">
        <p>I love working with startups, <em>creative</em> people, and <em>interesting</em> tech. Hit me up!</p>
        <address>
          <a v-unobfuscate:href="'mailto:ian@purvisresearch@@com'">ian@purvisresearch.c0m</a>
          <a href="https://github.com/ianpurvis">github.com/ianpurvis</a>
        </address>
      </div>
      <div class="boxx">
        <div class="kaomoji">ヾ(⌐■_■)ノ</div>
      </div>
    </Stretch>
  </main>
</template>

<script>
import { useHead } from '#imports'
import Tight from 'vue-tight'
import Stretch from '~/components/stretch.vue'
import Unobfuscate from '~/directives/unobfuscate.js'
import { Organization } from '~/models/organization.js'
import { snake } from '~/util/snake.js'

const org = Organization.default
export const canonicalUrl = org.url
export const title = 'Startup Technology Research, Design, Development, Testing, DevOps, and Project Management | Purvis Research'
export const description = org.description
export const ogImageUrl = `${org.url}/_/startup-technology-research-design-development-testing-devops-and-project-management.b47a0a17.png`
export const ogTitle = title
export const jsonld = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [{
    '@type': 'ListItem',
    'position': 1,
    'name': 'purvis research',
    'item': org.url
  }]
})

const experiments = [{
  title: '2020 Jul',
  description: 'A Banknote In Simplex Wind',
  route: '2020/jul/'
},{
  title: '2019 Apr',
  description: 'Surreal WebRTC Television',
  route: '2019/apr/'
}, {
  title: '2018 Oct',
  description: 'Screen Printing A 3D Scan',
  route: '2018/oct/'
}, {
  title: '2017 Nov',
  description: 'A 3D Character Exploder',
  route: '2017/nov/'
}, {
  title: '2017 Oct',
  description: 'A Bézier Moiré Generator',
  route: '2017/oct/'
}, {
  title: '2017 Sep',
  description: 'An Emoji Particle Flow',
  route: '2017/sept/'
}]

export default {
  components: {
    Stretch
  },
  directives: {
    Tight,
    Unobfuscate
  },
  setup() {
    useHead({
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: ogImageUrl },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content: ogTitle },
        { property:'og:url', content: canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', innerHTML: jsonld }
      ],
    })

    return { experiments, snake }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/stylesheets/courier-prime-code';
@import '~/assets/stylesheets/noto-sans-jp';
@import '~/assets/stylesheets/snake';

$font-family-en: 'Courier Prime Code Snake', sans-serif;
$font-family-jp: 'Noto Sans JP Snake', sans-serif;

address {
  font-style: inherit;

  a {
    display: block;
  }
}

main {
  font-family: $font-family-jp;
  letter-spacing: 0.2ch;
}

em {
  font-style: normal;
  letter-spacing: 0.06ch;
}

h2 {
  font-size: 2.6rem;
  font-weight: 500;
  letter-spacing: 0.1ch;
  line-height: 1;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

p {
  margin-bottom: 0.3rem;
}

.boxx {
  margin: 1rem;
  width: 22rem;
}

.experiments {
  font-size: 1.1rem;
  letter-spacing: 0.3ch;
  line-height: 1.5;
  max-width: 21.1rem;
  text-transform: uppercase;

  h2 {
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
  }
}

.inline-block {
  display: inline-block;
}

.kaomoji {
  font-size: 2.5rem;
}

.no-break {
  white-space: nowrap;
  word-break: keep-all;
}

.qr-logo {
  margin: 0.25rem;
  width: 8rem;
  /* filter == svg fill color #363636
   * transform prevents blur
   * See following for css filter color technique:
   * https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-styles-with-css
   * https://codepen.io/sosuke/pen/Pjoqqp
   */
  filter: brightness(0) saturate(100%) invert(14%) sepia(6%) saturate(29%) hue-rotate(315deg) brightness(97%) contrast(80%);
  transform: translateZ(0);
}

.skills {
  font-size: 2rem;
  letter-spacing: 0.08ch;
  line-height: 1;
  text-transform: uppercase;
  width: 21rem;
}

.snake-list {
  font-feature-settings: 'salt', 'dlig';
  list-style: none;
  overflow-wrap: break-word;
  padding-left: 0;
  word-break: break-all;

  >li {
    display: inline;
  }

  >li:not(:first-child):not(.no-underscore)::before {
    content: '_';
  }
}

.stretch {
  letter-spacing: 0.15ch;
}

[lang='ja'] {
  font-family: $font-family-jp;
  letter-spacing: 0;
  line-height: 1.5;
  text-align: justify;

  .skills {
    /* font-size: 1.7rem; */
    letter-spacing: 0;
    line-height: 1.25;
  }

  h2 {
    font-size: 2.5rem;
    letter-spacing: -0.05ch;
    margin-bottom: 1rem;
  }

  .snake-list {
    >li:not(:first-child):not(.no-underscore)::before {
      content: '_';
      content: '＿';
    }
  }
}
</style>
