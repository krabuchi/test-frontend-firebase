import React from "react";

import {
  withAuthorization,
  AuthUserContext,
  withEmailVerification,
} from "../Session";

import Notes from "./notes";
import { compose } from "recompose";

const HomePage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => <Notes authUser={authUser} />}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
