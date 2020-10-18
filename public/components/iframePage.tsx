import React from 'react';
import {useTopNav} from "../helpers/nav_header_helper";

export const IframePage = ({url}: { url: string }) => {

  useTopNav(false);

  return (
    <div id="iframe-wrapper">
      <iframe src={url} width="100%" height="100%"/>
    </div>
  );
};
