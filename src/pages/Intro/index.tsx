import React, { useState } from "react";

import AuthenticationForm, { FormType } from "../../components/AuthenticationForm";
import Layout from "../../components/Layout";

import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import path from "../../routes/path";

const IntroPage = () => {
  const nav = useNavigate();
  const passwordRegex = /.*/;
  const [slot, setSlot] = useState<React.ReactNode>(null);

  return (
    <Layout>
      <div className={styles.app}>
        <div className={styles.titleContainer}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <span className={styles.title}>
            How Does AI Influence Clinical Decision-Making? <br />
            Join Our Study & Make an Impact!
          </span>
          <p className={styles.subtitle}>
            We are investigating how AI-based Clinical Decision Support (AI-CDS) tools affect clinician decision-making
            for colorectal cancer (CRC) screening. Your participation will help improve the design and implementation of
            AI in healthcare. <br />
          </p>
          <p className={styles.subtitle}>
            📝 How It Works: <br />
            🔹 Complete a short online form (~10 mins)
            <br />
            🔹 Receive login details for our experiment platform
            <br />
            🔹 Case Review & Decision-Making <br />
            🔹 Submit responses and receive payment
            <br />
          </p>
          <p className={styles.subtitle}>
            🎁 Compensation & Incentives: <br />
            🔹 $20 for completing all 12 cases <br />
            🔹 Earn up to $50 based on performance
            <br />
            🔹 Compensation is based on decision accuracy
          </p>
          <p className={styles.subtitle}>
            🔒 Confidentiality: <br />
            🔹 All responses are anonymous <br />
            🔹 Data will be used only for research purposes
            <br />
            🔹 Secure, encrypted servers store all information
          </p>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => nav("/login")}
          >
            🔙 Back to Log In Page
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default IntroPage;
