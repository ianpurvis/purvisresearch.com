<template>
  <main>
    <autoscaled-div :max-scale=2.8>
      <div class="boxx">
        <h1>
          <nuxt-link to="/" class="inline-block">
            <img src="~/assets/images/qr-logo-200x280.svg" alt="Purvis Research" class="qr-logo"/>
          </nuxt-link>
        </h1>
      </div>
      <div class="boxx">
        <h2>IAN PURVIS</h2>
        <ul class="snake-list">
          <li>STARTUP<span class="underscore">&nbsp;</span>TECHNOLOGY</li>
          <li>RESEARCH</li>
          <li>DESIGN</li>
          <li>DEVELOPMENT</li>
          <li>TESTING</li>
          <li>DEVOPS</li>
          <li>PROJECT<span class="underscore">&nbsp;</span>MANAGEMENT</li>
        </ul>
      </div>
      <div class="boxx" lang="ja">
        <h2>イアン　パービス</h2>
        <ul class="snake-list">
          <li>スタートアップ<span class="underscore"></span>テクノロジー</li>
          <li class="stretch">リサーチ</li>
          <li>デザイン</li>
          <li class="no-underscore">デベロップメント</li>
          <li><span class="no-break">テス</span><wbr><span class="no-break">ティ</span>ング</li>
          <li class="romaji">DEVOPS</li>
          <li><span class="no-break">プロ</span><wbr><span class="stretch">ジェクト</span><span class="underscore"></span><span class="stretch">マネジメント</span></li>
        </ul>
      </div>
      <div class="boxx">
        <div class="snake experiments">DIGITAL_ART_EXPERIMENTS_2019_APR_<nuxt-link to="2019/apr.html">SURREAL_WEBRTC_TELEVISION</nuxt-link>_2018_OCT_<nuxt-link to="2018/oct.html">SCREEN_PRINTING_A_3D_SCAN</nuxt-link>_2017_NOV_<nuxt-link to="2017/nov.html">A_3D_CHARACTER_EXPLODER</nuxt-link>_2017_OCT_<nuxt-link to="2017/oct.html">A_BÉZIER_MOIRÉ_GENERATOR</nuxt-link>_2017_SEP_<nuxt-link to="2017/sept.html">AN_EMOJI_PARTICLE_FLOW</nuxt-link></div>
      </div>
      <div class="boxx">
        <p class="snake">I love working with startups, <em>creative</em> people, and <em>interesting</em> tech. Hit me up!</p>
        <address>
          <obfuscated-mailto></obfuscated-mailto>
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
