module.exports = {
  ci: {
    collect: {
      headful: true,
      numberOfRuns: 1,
      staticDistDir: 'dist/app',
      url: [
        'http://localhost/index.html',
        'http://localhost/2017/sept.html',
        'http://localhost/2017/oct.html',
        'http://localhost/2017/nov.html',
        'http://localhost/2018/oct.html',
        'http://localhost/2019/apr.html',
        'http://localhost/2020/jul.html',
        'http://localhost/404.html',
      ],
    },
  }
}
