import React from "react";

import { withAuthorization, AuthUserContext } from "../Session";

import Notes from "./notes";

const HomePage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => <Notes authUser={authUser} />}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(HomePage);
