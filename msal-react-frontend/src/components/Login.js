import React, { useState } from "react";
import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest } from "../authConfig";

function Login() {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState(null);

  const activeAccount = instance.getActiveAccount();
  const handleSingIn = () => {
    instance
      .loginPopup(loginRequest)
      .then((r) => console.log(r.accessToken))
      .catch((error) => console.log(error));
  };

  const handleSingOut = () => {
    instance.logoutPopup().catch((error) => console.log(error));
  };
  const getData = async () => {
    const account = accounts[0];
    const request = {
      account: account,
      scopes: ["User.Read"],
    };
    try {
      const responseToken = await instance.acquireTokenSilent(request);
      const idToken = responseToken.idToken;

      const response = await fetch("http://localhost:5001/hello", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MsalProvider instance={instance}>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <div>
            <div>{activeAccount.name}</div>
            <button onClick={handleSingOut}>Sign Out</button>
            <button onClick={getData}>Accounts</button>
            <div>
              {data ? (
                <div>
                  <div>Data from Backend</div>
                  <div>{data.name}</div>
                  <div>{data.role}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleSingIn}>Sign In</button>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

export default Login;
