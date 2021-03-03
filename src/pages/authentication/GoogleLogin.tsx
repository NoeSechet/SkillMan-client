import React from "react";
import { GoogleLogin as GoogleButton } from "react-google-login";
import Cookies from "react-cookies";
import { useRouter } from "next/router";

const axios = require("axios");

interface GoogleLoginProps {}

const GoogleLogin: React.FC<GoogleLoginProps> = ({}) => {
  const router = useRouter();

  const loginRegisterRequest = async (url, response) => {
    const requestOptions = {
      method: "post",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        username: response.profileObj.name,
        email: response.profileObj.email,
        googleID: response.googleId,
      },
    };

    try {
      const res = await axios(requestOptions);
      let validRes = res && res.status === 200 && res.statusText === "OK";
      if (validRes) {
        Cookies.save("accessToken", res.data.accessToken, { path: "/" });
        Cookies.save("userID", res.data.id, { path: "/" });
        router.push("/dashboard/Dashboard");
      }
    } catch (err) {
      console.error("There was an error:", err.toString());
    }
  };

  const handleLoginSuccess = (response) => {
    console.log("Google response: ", response);

    Cookies.save("G_accessToken", response.accessToken, { path: "/" });

    loginRegisterRequest("http://localhost:8080/user/login/google", response);
  };

  const handleLoginFailure = (response) => {
    console.error(response.errorMessage);
  };

  return (
    <div>
      <GoogleButton
        clientId={
          process.env.CLIENT_ID ||
          "162703515380-5hcrbgd8r4sa09d463v6llaqq3quhljl.apps.googleusercontent.com"
        }
        buttonText="Login"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default GoogleLogin