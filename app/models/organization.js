import logoUrl from '~/assets/images/qr-logo-bw-256x256.png?as=file'

class Organization {
  constructor(attributes) {
    Object.assign(this, attributes, {
      '@context': 'https://schema.org',
      '@type': 'Organization'
    })
  }
}

Organization.default = new Organization({
  description: 'Startup Technology Research, Design, Development, Testing, DevOps, and Project Management',
  logo: `https://purvisresearch.com${logoUrl}`,
  name: 'Purvis Research, LLC',
  url: 'https://purvisresearch.com',
})
Object.freeze(Organization.default)

export { Organization }
