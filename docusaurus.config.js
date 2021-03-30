/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Sciotta',
  tagline: 'Blog de tecnologia e programação',
  url: 'https://blog.sciotta.com.br',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'thiagog3',
  projectName: 'sciotta-blog',
  themeConfig: {
    metadatas: [{name: 'twitter:card', content: 'summary'}],
    gtag: {
      trackingID: 'G-MPD14XHTFV',
    },
    navbar: {
      title: 'sciotta.',
      items: [
        {to: '/', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/thiagog3',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.linkedin.com/in/sciotta/',
          label: 'Linkedin',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Onde me encontrar?',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/thiagog3',
            },
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/in/sciotta/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/thiagosciotta',
            },
          ],
        },
        {
          title: 'Me dá um cafezinho?',
          items: [
            {
              html: `<a href="https://www.buymeacoffee.com/sciotta" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>`,
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Sciotta. Feito com Docusaurus.`,
    },
  },
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          blogSidebarTitle: 'Postagens recentes',
          blogTitle: 'Docusaurus blog!',
          blogDescription: 'A docusaurus powered blog!',
          routeBasePath: '/',
          showReadingTime: true,
          editUrl:
            'https://github.com/thiagog3/sciotta-blog/edit/master/blog/',
          feedOptions: {
            type: 'all', // required. 'rss' | 'feed' | 'all'
            title: 'Sciotta', // default to siteConfig.title
            description: 'Sciotta blog', // default to  `${siteConfig.title} Blog`
            copyright: 'Sciotta 2021',
            language: 'pt-BR',
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
