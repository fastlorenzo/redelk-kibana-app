import React from 'react';
import {useTopNav} from "../navHeaderHelper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const CredentialsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="82b865a0-d318-11ea-9301-a30a04251ae9"/>
    </>
  );
};