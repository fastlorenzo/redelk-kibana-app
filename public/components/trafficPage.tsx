import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const TrafficPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="0f8626d0-c6f4-11e8-a9c6-cd307b96b1ba"/>
    </>
  );
};
