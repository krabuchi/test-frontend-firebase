import React from "react";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

import styles from "./styles.module.css";
import { compose } from "recompose";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div className={styles.accountPage}>
        <h1>Hello {authUser.username}</h1>
        <span>Email: {authUser.email}</span>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
