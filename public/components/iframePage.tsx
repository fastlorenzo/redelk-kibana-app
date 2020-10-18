import React from 'react';
import {useTopNav} from "../navHeaderHelper";

export const IframePage = ({url}: {url: string}) => {

  useTopNav(false);

  return (
    <div id="iframe-wrapper">
      <iframe src={url} width="100%" height="100%"/>
    </div>
  );
};
