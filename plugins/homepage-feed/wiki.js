const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const matter = require('gray-matter');
const {excerpt} = require('./excerpt');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(fullPath);
    }
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

function getFileDate(filePath) {
  try {
    const output = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    if (output) {
      return output;
    }
  } catch (error) {
    // sem histórico git disponível (ex: clone raso) — cai no fallback abaixo
  }
  return fs.statSync(filePath).mtime.toISOString();
}

function derivePermalink(filePath, frontmatter) {
  if (frontmatter.slug) {
    return frontmatter.slug.startsWith('/') ? frontmatter.slug : `/docs/${frontmatter.slug}`;
  }
  const relative = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
  let withoutExt = relative.replace(/\.md$/, '');
  if (withoutExt.endsWith('/index')) {
    withoutExt = withoutExt.slice(0, -'/index'.length);
  } else if (withoutExt === 'index') {
    withoutExt = '';
  }
  return `/docs/${withoutExt}`.replace(/\/$/, '') || '/docs';
}

function getTitle(frontmatter, content) {
  if (frontmatter.title) {
    return frontmatter.title;
  }
  const heading = content.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : 'Wiki';
}

function getWikiItems() {
  return listMarkdownFiles(DOCS_DIR).map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const {data: frontmatter, content} = matter(raw);
    return {
      type: 'wiki',
      title: getTitle(frontmatter, content),
      description: excerpt(content),
      date: getFileDate(filePath),
      permalink: derivePermalink(filePath, frontmatter),
      image: null,
    };
  });
}

module.exports = {getWikiItems};
