const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {excerpt} = require('./excerpt');

const BLOG_DIR = path.resolve(__dirname, '..', '..', 'blog');
const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;
const FILENAME_DATE = /^(\d{4}-\d{2}-\d{2})-/;

function getBlogItems() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const filePath = path.join(BLOG_DIR, name);
      const raw = fs.readFileSync(filePath, 'utf8');
      const {data: frontmatter, content} = matter(raw);
      const dateMatch = name.match(FILENAME_DATE);
      const beforeTruncate = content.split(TRUNCATE_MARKER)[0];
      return {
        type: 'blog',
        title: frontmatter.title,
        description: excerpt(beforeTruncate),
        date: dateMatch ? new Date(dateMatch[1]).toISOString() : fs.statSync(filePath).mtime.toISOString(),
        permalink: `/blog/${frontmatter.slug}`,
        image: frontmatter.image ?? null,
      };
    });
}

module.exports = {getBlogItems};
