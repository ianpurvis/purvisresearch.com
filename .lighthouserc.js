const baseUrl = 'https://purvisresearch.com'
const paths = [
  '/',
  '/2017/sept.html',
  '/2017/oct.html',
  '/2017/nov.html',
  '/2018/oct.html',
  '/2019/apr.html',
  '/2020/jul.html',
  '/404.html',
]

const config = {
  ci: {
    collect: {
      url: paths.map(path => baseUrl + path)
    },
  }
}

module.exports = config
