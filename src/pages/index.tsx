import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";

import Login from "./authentication/Login";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Skillman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
};

export default Index;
