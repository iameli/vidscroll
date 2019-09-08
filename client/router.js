import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import App from "./app";
import React, { useEffect, useState } from "react";
import Upload from "./upload";
import Login from "./login";
import UserPage from "./user-page";
import { UserContext } from "./user-context";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html, body, main {
    width: 100%;
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: red;
    color: white;
    user-select: none;
  }
  main {
    background-color: black;
    -webkit-overflow-scrolling: auto;
  }
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`;

const PageBox = styled.article`
  width: 100%;
  background-color: white;
  z-index: 1000;
  color: black;
  display: flex;
  flex-grow: 1;
`;

const BottomBar = styled.div`
  width: 100%;
  height: 75px;
  color: white;
  display: flex;
  margin-top: auto;
  z-index: 2000;
  background-color: black;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
`;

const NavIconBox = styled(NavLink)`
  display: block;
  color: white;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10px;
  text-decoration: none;
  opacity: 0.6;

  &.active {
    opacity: 1;
  }
`;

const NavIconIcon = styled.span`
  font-size: 16px;
  padding-bottom: 5px;
`;

const NavIconText = styled.span`
  font-size: 10px;
`;

const RefreshButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
  font-size: 40px;
  opacity: 0;
`;

export const NavIcon = props => (
  <NavIconBox activeClassName="active" {...props}>
    <NavIconIcon {...props}>⚪️</NavIconIcon>
    <NavIconText {...props}>{props.children}</NavIconText>
  </NavIconBox>
);

let serializedContext = null;
if (typeof localStorage === "object") {
  try {
    const userContext = JSON.parse(localStorage.getItem("USER_CONTEXT"));
    if (userContext && userContext.token) {
      serializedContext = userContext;
    }
  } catch (e) {
    // Dumping context, no problem here.
  }
}

export default () => {
  const [userContext, setUserContext] = useState(serializedContext);

  const serializeUserContext = newContext => {
    setUserContext(newContext);
    if (typeof localStorage !== "object") {
      return;
    }
    localStorage.setItem("USER_CONTEXT", JSON.stringify(newContext));
  };

  return (
    <UserContext.Provider value={userContext}>
      <Router>
        <MainBox>
          <GlobalStyle />
          <Switch>
            <Route path="/home">
              <App />
            </Route>
            <Route path="/upload">
              <PageBox>
                <Upload />
              </PageBox>
            </Route>
            <Route path="/user/create">
              <PageBox>
                <Login setUserContext={serializeUserContext} create={true} />
              </PageBox>
            </Route>
            <Route path="/user/login">
              <PageBox>
                <Login setUserContext={serializeUserContext} create={false} />
              </PageBox>
            </Route>
            <Route path="/user/:username">
              <PageBox>
                <UserPage setUserContext={serializeUserContext} />
              </PageBox>
            </Route>
            <Route path="/user">
              <PageBox>
                <UserPage setUserContext={serializeUserContext} />
              </PageBox>
            </Route>
            <Redirect from="/" to="/home" />
          </Switch>
          {/* <App /> */}
          <RefreshButton
            onClick={() => {
              document.location.href = document.location.href;
            }}
          >
            ↪️
          </RefreshButton>
          <BottomBar>
            <NavIcon to={"/home"}>Home</NavIcon>
            <NavIcon to={"/nothing"}>nothing</NavIcon>
            <NavIcon to={"/unused"}>unused</NavIcon>
            <NavIcon to={"/upload"}>Upload</NavIcon>
            <NavIcon to={"/user"}>User</NavIcon>
          </BottomBar>
        </MainBox>
      </Router>
    </UserContext.Provider>
  );
};
