import AutoscaledDiv from '~/components/autoscaled-div.vue'
import Graphix from '~/mixins/graphix.js'
import organization from '~/structured_data/organization.js'

export default {
  components: {
    AutoscaledDiv,
  },
  data() {
    return {
      canonicalUrl: organization.url,
      description: organization.description,
      experiments: [{
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
      skills: [
        'Startup Technology',
        'Research',
        'Design',
        'Development',
        'Testing',
        'DevOps',
        'Project Management'
      ],
      title: "purvis research",
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${organization.url}${require("~/assets/images/index.png")}` },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content: this.title },
        { property:"og:url", content: this.canonicalUrl },
        { name:"twitter:card", content:"summary_large_image" },
      ],
      link: [
        { rel: "canonical", href: this.canonicalUrl }
      ],
    }
  },
  jsonld() {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "purvis research",
        "item": organization.url
      }]
    }
  },
  mixins: [
    Graphix
  ],
}
