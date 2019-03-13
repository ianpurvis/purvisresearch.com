<template>
  <main class="Y2019 jan">
    purvis_research<span class="nomobile">_</span>jan_2019<span class="nomobile">_</span><obfuscated-mailto/>
    <video
      ref="video"
      :src="video_url || String()"
      :key="video_url"
      autoplay=true
      loop=true
      muted=true
      playsinline=true
      width=512
      height=512>
    </video>
  </main>
</template>

<script src="./jan.js"></script>
