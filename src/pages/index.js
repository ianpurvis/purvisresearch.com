import Tight from 'vue-tight'
import ogImagePath from '~/assets/images/startup-technology-research-design-development-testing-devops-and-project-management.png'
import AutoscaledDiv from '~/components/autoscaled-div.vue'
import Unobfuscate from '~/directives/unobfuscate.js'
import { Organization } from '~/models/organization.js'

export default {
  components: {
    AutoscaledDiv,
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = Organization.default.url
    this.description = Organization.default.description
    this.experiments = [{
      title: '2020 Jul',
      description: 'A Banknote In Simplex Wind',
      route: '2020/jul.html'
    },{
      title: '2019 Apr',
      description: 'Surreal WebRTC Television',
      route: '2019/apr.html'
    }, {
      title: '2018 Oct',
      description: 'Screen Printing A 3D Scan',
      route: '2018/oct.html'
    }, {
      title: '2017 Nov',
      description: 'A 3D Character Exploder',
      route: '2017/nov.html'
    }, {
      title: '2017 Oct',
      description: 'A Bézier Moiré Generator',
      route: '2017/oct.html'
    }, {
      title: '2017 Sep',
      description: 'An Emoji Particle Flow',
      route: '2017/sept.html'
    }],
    this.jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'purvis research',
        'item': Organization.default.url
      }]
    }
    this.title = 'Startup Technology Research, Design, Development, Testing, DevOps, and Project Management | Purvis Research'
  },
  directives: {
    Tight,
    Unobfuscate
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content: this.title },
        { property:'og:url', content: this.canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: this.canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: this.jsonld }
      ],
    }
  },
  methods: {
    snake(value) {
      const { $options: { _scopeId } } = this
      return value.replace(/\s/g, `<span class="underscore" ${_scopeId}>&nbsp;</span>`)
    }
  }
}
