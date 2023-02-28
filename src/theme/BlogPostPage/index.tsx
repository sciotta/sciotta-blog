/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import type {Props} from '@theme/BlogPostPage';
import BlogSidebar from '@theme/BlogSidebar';
import TOC from '@theme/TOC';
import EditThisPage from '@theme/EditThisPage';

function BlogPostPage(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {frontMatter, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem, editUrl} = metadata;
  const {hide_table_of_contents: hideTableOfContents} = frontMatter;

  return (
    <Layout
      title={title}
      description={description}
      wrapperClassName="blog-wrapper">
      {BlogPostContents && (
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--3">
              <BlogSidebar sidebar={sidebar} />
            </div>
            <main className="col col--7">
              <BlogPostItem
                frontMatter={frontMatter}
                metadata={metadata}
                isBlogPostPage>
                <BlogPostContents />
              </BlogPostItem>

              <script src="https://giscus.app/client.js"
                data-repo="thiagog3/sciotta-blog"
                data-repo-id="MDEwOlJlcG9zaXRvcnkzNTIzNTc5MTA="
                data-category="Announcements"
                data-category-id="DIC_kwDOFQCOFs4CUjat"
                data-mapping="pathname"
                data-strict="0"
                data-reactions-enabled="1"
                data-emit-metadata="0"
                data-input-position="top"
                data-theme="preferred_color_scheme"
                data-lang="pt"
                crossorigin="anonymous"
                async>
              </script>
              <div class="giscus"></div>

              <div>{editUrl && <EditThisPage editUrl={editUrl} />}</div>
              {(nextItem || prevItem) && (
                <div className="margin-vert--xl">
                  <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
                </div>
              )}
            </main>
            {!hideTableOfContents && BlogPostContents.toc && (
              <div className="col col--2">
                <TOC toc={BlogPostContents.toc} />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
