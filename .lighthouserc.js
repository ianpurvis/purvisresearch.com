module.exports = {
  ci: {
    collect: {
      extends: 'lighthouse:default',
      numberOfRuns: 1,
      settings: {
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo'
        ],
      },
      staticDistDir: 'dist/app',
    },
  }
}
