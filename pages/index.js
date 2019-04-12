import AutoscaledDiv from '~/components/autoscaled-div.vue'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import organization from '~/structured_data/organization.js'

export default {
  components: {
    AutoscaledDiv,
    ObfuscatedMailto,
  },
  data() {
    return {
      canonicalUrl: organization.url,
      description: organization.description,
      title: "purvis research",
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${organization.url}${require("~/assets/images/2019/apr.png")}` },
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
}
