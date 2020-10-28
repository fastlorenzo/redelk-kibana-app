import React, { memo } from 'react';
import {useTopNav} from "../helpers/nav_header_helper";

const Iframe = memo(() => <iframe src='/plugins/redelk/assets/attack-navigator/' width="100%" height="100%"/>)

export const AttackNavigatorPage = () => {

  useTopNav(false);

  return (
    <div id="iframe-wrapper">
      <Iframe/>
    </div>
  );
};
