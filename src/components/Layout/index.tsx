import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import classnames from "classnames";
import { useTheme } from "@mui/material/styles";

import testId from "../../utils/testId";

import styles from "./index.module.scss";

const Layout = (props: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) => {
  const { pathname } = useLocation();
  const layoutRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    layoutRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [layoutRef, pathname]);

  return (
    <div
      {...testId("aim-ahead-layout")}
      ref={layoutRef}
      className={classnames(
        {
          [styles.layout]: true,
          [styles.m]: window.innerWidth > 576,
        },
        props.className,
      )}
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};

export default Layout;
