import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();
  
  return (
    <Giscus    
      repo="sciotta/sciotta-blog"
      repoId="MDEwOlJlcG9zaXRvcnkzNTIzNTc5MTA="
      category="General"
      categoryId="DIC_kwDOFQCOFs4CUjav"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={colorMode}
      lang="pt"
      loading="lazy"
    />
  );
}