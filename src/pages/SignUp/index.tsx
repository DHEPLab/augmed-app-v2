import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthenticationForm, { FormType } from "../../components/AuthenticationForm";
import Layout from "../../components/Layout";
import { passwordPattern } from "../../utils/regexp";
import path from "../../routes/path";
import logo from "../../assets/images/logo.jpg";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSnackbar } from "notistack";

import styles from "./index.module.scss";
import { signup } from "../../services/userService";

const SignUpPage = () => {
  const nav = useNavigate();
  const [slot, setSlot] = useState<React.ReactNode>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [search] = useSearchParams();
  const urlEmail = search.get("email") ?? "";

  const handleSignUp = (email: string, password: string) =>
    signup(email, password)
      .then(() => {
        enqueueSnackbar("Sign up completed! Please log in.", {
          anchorOrigin: {
            horizontal: "center",
            vertical: "bottom",
          },
          variant: "success",
          autoHideDuration: 2000,
        });
        nav(path.login);
      })
      .catch((error) => {
        setSlot(
          <div className={styles.errorContainer}>
            <ErrorOutlineIcon />
            <span className={styles.errorMessage}>{error.message}</span>
          </div>,
        );
      });

  const handleFormChange = () => {
    setSlot(null);
  };

  return (
    <Layout>
      <div className={styles.app}>
        <div className={styles.titleContainer}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <span className={styles.title}>Sign Up</span>
          <p className={styles.subtitle}>
            Welcome to participate in our AugMed Clinical Decision Platform testing and shape the future of medical
            decision-making.
          </p>
        </div>
        <AuthenticationForm
          slot={slot}
          onChange={handleFormChange}
          pageType={FormType.SignUp}
          handelSubmit={handleSignUp}
          passwordRegex={passwordPattern}
          initialEmail={urlEmail}
        />
      </div>
    </Layout>
  );
};

export default SignUpPage;
