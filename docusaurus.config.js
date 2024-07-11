// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sciotta',
  tagline: 'Blog de tecnologia e programação',
  url: 'https://sciotta.com.br',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  
  favicon: 'img/favicon.ico',
  organizationName: 'thiagog3',
  projectName: 'sciotta-blog',
  themes: [
    'docusaurus-theme-github-codeblock'
  ],
  themeConfig: 
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  {
    metadata: [{name: 'twitter:card', content: 'summary'}],
    navbar: {
      title: 'sciotta.',
      items: [
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Wiki Pessoal',
        },
        {
          href: 'https://www.linkedin.com/in/sciotta/',
          label: 'Linkedin',
          position: 'right',
          'aria-label': 'Perfil do Linkedin',
        },
        {
          href: 'https://github.com/thiagog3',
          className: 'header-github-link',
          position: 'right',
          'aria-label': 'Repositório do Github',
        },
      ],
    },
    codeblock: {
      showGithubLink: true,
      githubLinkLabel: 'Abrir no Github',
      showRunmeLink: false,
      runmeLinkLabel: 'Checkout via Runme'
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
    prism: {
      theme: lightTheme,
      darkTheme: darkTheme,
      additionalLanguages: ['bash', 'diff', 'json'],
    },
  },
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          blogSidebarTitle: 'Postagens recentes',
          blogTitle: 'Docusaurus blog!',
          blogDescription: 'A docusaurus powered blog!',
          showReadingTime: true,
          editUrl:
            'https://github.com/thiagog3/sciotta-blog/edit/master/blog/',
          feedOptions: {
            type: 'all', // required. 'rss' | 'feed' | 'all'
            title: 'Sciotta', // default to siteConfig.title
            description: 'Sciotta blog', // default to  `${siteConfig.title} Blog`
            copyright: 'Sciotta 2023',
            language: 'pt-BR',
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'G-MPD14XHTFV',
        anonymizeIP: true,
      },
    ],
  ],
};

module.exports = config;
