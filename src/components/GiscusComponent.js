import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();
  
  return (
    <Giscus    
      repo="thiagog3/sciotta-blog"
      repoId="MDEwOlJlcG9zaXRvcnkzNTIzNTc5MTA="
      category="General"
      categoryId="DIC_kwDOFQCOFs4CUjav"
      mapping="url"                        // Important! To map comments to URL
      term="Welcome to @giscus/react component!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="pt"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}