<template>
  <main v-once>
    <autoscaled-div :max-scale=2.8>
      <div class="boxx">
        <h1>
          <nuxt-link to="/" class="inline-block">
            <img src="~/assets/images/qr-logo-200x280.svg" alt="Purvis Research" class="qr-logo"/>
          </nuxt-link>
        </h1>
      </div>
      <div class="boxx">
        <h2>Ian Purvis</h2>
        <ul class="snake-list skills" v-tight>
          <li v-html="snake('Startup Technology')"></li>
          <li>Research</li>
          <li>Design</li>
          <li>Development</li>
          <li>Testing</li>
          <li>DevOps</li>
          <li v-html="snake('Project Management')"></li>
        </ul>
      </div>
      <div class="boxx" lang="ja">
        <!-- eslint-disable-next-line no-irregular-whitespace -->
        <h2>イアン　パービス</h2>
        <ul class="snake-list skills" v-tight>
          <li>スタートアップ<span class="underscore">&#x3000;</span>テクノロジー</li>
          <li>リサーチ</li>
          <li>デザイン</li>
          <li class="no-underscore">デベロップメント</li>
          <li v-tight>
            <span class="no-break">テス</span>
            <wbr>
            <span class="no-break">ティ</span>
            <span>ング</span>
          </li>
          <li class="romaji">DevOps</li>
          <li v-tight>
            <span class="no-break">プロ</span>
            <wbr>
            <span class="stretch">ジェクト</span>
            <span class="underscore">&#x3000;</span>
            <span class="stretch">マネジメント</span>
          </li>
        </ul>
      </div>
      <div class="boxx">
        <nav class="experiments snake-list" v-tight>
          <h2 v-html="snake('Digital Art Experiments')"></h2>
          <ul class="snake-list" v-tight>
            <li v-for="(experiment, index) in experiments" :key="index" v-tight>
              <span v-html="snake(experiment.title)"></span>
              <span class="underscore">&nbsp;</span>
              <nuxt-link :to="experiment.route" v-html="snake(experiment.description)"></nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="boxx">
        <p class="snake">I love working with startups, <em>creative</em> people, and <em>interesting</em> tech. Hit me up!</p>
        <address>
          <a v-unobfuscate:href="'mailto:ian@purvisresearch@@com'">ian@purvisresearch.c0m</a>
          <a href="https://github.com/ianpurvis">github.com/ianpurvis</a>
        </address>
      </div>
      <div class="boxx">
        <div class="kaomoji">ヾ(⌐■_■)ノ</div>
      </div>
    </autoscaled-div>
  </main>
</template>

<style src="./index.scss" lang="scss" scoped></style>
<script src="./index.js"></script>
