import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const TTPPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="3ed7a630-d051-11ea-9301-a30a04251ae9"/>
    </>
  );
};
