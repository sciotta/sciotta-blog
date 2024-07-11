import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Project } from '.';
import { projects } from '../utils/data';

export const PersonalTabs = () => {
  return (
    <Tabs>
       <TabItem value="projects" label="PROJECTS" default>
        {projects.map((props, idx) => (
          <Project key={idx} {...props} />
        ))}
      </TabItem>
    </Tabs>
  );
};
