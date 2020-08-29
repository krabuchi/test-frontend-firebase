import React from "react";

import { withFirebase } from "../Firebase";

import styles from "./styles.module.css";

const SignOutButton = ({ firebase }) => (
  <button
    type="button"
    className={styles.signOutBtn}
    onClick={firebase.doSignOut}
  >
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
