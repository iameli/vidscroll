import React, { useState, useEffect } from "react";
import styled from "styled-components";
import hash from "../lib/hash";
import { Link, Redirect } from "react-router-dom";
import useApi from "./api";
import { useUser } from "./user-context";
import { Button } from "./components";

const PageBox = styled.form`
  display: flex;
  width: 100%;
  padding: 1em;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid #999;
  background-color: 1px solid #ccc;
  font-size: 20px;
  padding: 20px 5px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 2em;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const TopRowTitle = styled.h4``;

const CreateText = styled(Link)`
  color: rgb(44, 124, 176);
  text-decoration: none;
  font-size: 1.2em;
  vertical-align: middle;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
`;

const TextField = ({ title, type = "text", value, onChange }) => (
  <StyledLabel>
    <span>{title}</span>
    <StyledInput type={type} value={value} onChange={onChange} />
  </StyledLabel>
);

export default ({ create = false, setUserContext }) => {
  const api = useApi();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [create]);

  const user = useUser();
  if (user) {
    return <Redirect to="/user" />;
  }

  let topRow;
  if (create) {
    topRow = (
      <TopRow>
        <h1>Create account</h1>
        <CreateText to="/user">
          <span>Login?</span>
        </CreateText>
      </TopRow>
    );
  } else {
    topRow = (
      <TopRow>
        <h1>Login</h1>
        <CreateText to="/user/create">
          <span>Create account?</span>
        </CreateText>
      </TopRow>
    );
  }

  return (
    <PageBox
      onSubmit={async e => {
        e.preventDefault();
        setError("");
        const [hashedPassword] = await hash(password, "FCC11D58FDBB7D84");
        try {
          if (create) {
            await api.createAccount(username, email, hashedPassword);
          }
          const response = await api.login(username, hashedPassword);
          setUserContext(response);
        } catch (e) {
          setError(e.message);
        }
      }}
    >
      {topRow}
      <TextField
        onChange={e => setUsername(e.target.value)}
        value={username}
        title="username"
      />
      {create && (
        <TextField
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          title="email"
        />
      )}
      <TextField
        onChange={e => setPassword(e.target.value)}
        value={password}
        type="password"
        title="password"
      />
      <div>{error}</div>
      <Button>{create ? "Create account" : "Login"}</Button>
    </PageBox>
  );
};
