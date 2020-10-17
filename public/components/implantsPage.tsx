import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const ImplantsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="117dbba0-c6f5-11e8-a9c6-cd307b96b1ba"/>
    </>
  );
};
