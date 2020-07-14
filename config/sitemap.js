export default () => ({
  modules: [
    [
      '@nuxtjs/sitemap',
      {
        exclude: [
          '/404',
        ],
        filter: ({ routes }) =>
          routes.map(({url, ...attributes}) =>
            ({
              url: (url === '/') ? String() : `${url}.html`,
              ...attributes
            })),
        hostname: 'https://purvisresearch.com',
        routes: [{
          url: '/',
          img: [{
            url: '/_/img/startup-technology-research-design-development-testing-devops-and-project-management.png',
            title: 'Startup Technology Research, Design, Development, Testing, DevOps, and Project Management | Purvis Research',
          }],
          priority: 1,
        }, {
          url: '/2017/sept',
          img: [{
            url: '/_/img/2017/sept/an-emoji-particle-flow-in-webgl.png',
            title: 'Sep 2017: An Emoji Particle Flow in WebGL | Purvis Research',
          }]
        }, {
          url: '/2017/oct',
          img: [{
            url: '/_/img/2017/oct/a-bezier-moire-generator-in-webgl.png',
            title: 'Oct 2017: A Bézier Moiré Generator in WebGL | Purvis Research',
          }]
        }, {
          url: '/2017/nov',
          img: [{
            url: '/_/img/2017/nov/a-3d-character-exploder-in-webgl.png',
            title: 'Nov 2017: A 3D Character Exploder in WebGL | Purvis Research',
          }]
        }, {
          url: '/2018/oct',
          img: [{
            url: '/_/img/2018/oct/screenprinting-a-3d-scan-with-webgl.png',
            title: 'Oct 2018: Screen Printing a 3D Scan With WebGL | Purvis Research',
          }]
        }, {
          url: '/2019/apr',
          img: [{
            url: '/_/img/2019/apr/surreal-television-with-webrtc-and-webgl.png',
            title: 'Apr 2019: Surreal Television With WebRTC and WebGL | Purvis Research',
          }]
        }, {
          url: '/2020/jul',
          img: [{
            url: '/_/img/2020/jul/a-banknote-in-simplex-wind.png',
            title: 'Jul 2020: A Banknote in Simplex Wind | Purvis Research',
          }]
        }]
      }
    ]
  ]
})
