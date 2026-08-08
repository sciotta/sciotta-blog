const {getBlogItems} = require('./blog');
const {getWikiItems} = require('./wiki');

module.exports = function homepageFeedPlugin() {
  return {
    name: 'homepage-feed-plugin',
    async loadContent() {
      const items = [...getBlogItems(), ...getWikiItems()];
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return items;
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
};
