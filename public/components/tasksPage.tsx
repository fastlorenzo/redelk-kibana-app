import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const TasksPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="0523c8a0-d025-11ea-9301-a30a04251ae9"/>
    </>
  );
};