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
            url: '/_/img/index.png',
            title: 'Startup Technology Research, Design, Development, Testing, DevOps, and Project Management | Purvis Research',
          }],
          priority: 1,
        }, {
          url: '/2017/sept',
          img: [{
            url: '/_/img/2017/sept.png',
            title: 'Sep 2017: An emoji particle flow in WebGL | Purvis Research',
          }]
        }, {
          url: '/2017/oct',
          img: [{
            url: '/_/img/2017/oct.png',
            title: 'Oct 2017: A bézier moiré generator in WebGL | Purvis Research',
          }]
        }, {
          url: '/2017/nov',
          img: [{
            url: '/_/img/2017/nov.png',
            title: 'Nov 2017: A 3d character exploder in WebGL | Purvis Research',
          }]
        }, {
          url: '/2018/oct',
          img: [{
            url: '/_/img/2018/oct.png',
            title: 'Oct 2018: Screen printing a 3D scan with WebGL | Purvis Research',
          }]
        }, {
          url: '/2019/apr',
          img: [{
            url: '/_/img/2019/apr.png',
            title: 'Apr 2019: Surreal television with WebRTC and WebGL | Purvis Research',
          }]
        }, {
          url: '/2020/jul',
          img: [{
            url: '/_/img/2020/jul.png',
            title: 'Jul 2020: A Banknote in Simplex Wind | Purvis Research',
          }]
        }]
      }
    ]
  ]
})
