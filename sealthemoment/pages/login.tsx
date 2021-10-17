import React, { FormEvent, FormEventHandler, useRef, useState } from "react";
import { useLoginMutation } from "../generated/graphql";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [registerError, setRegisterError] = useState("");
  const [, login] = useLoginMutation();
  const username: React.LegacyRef<HTMLInputElement> = useRef(null);
  const password: React.LegacyRef<HTMLInputElement> = useRef(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    let loginRequest = await login({
      username: username.current?.value || "",
      password: password.current?.value || "",
    });
    console.log(loginRequest.data);
  };

  return (
    <form action="" className="form" onSubmit={handleSubmit}>
      <h2 className="formTitle">Sign In</h2>
      <label className="formLabel" htmlFor="username">
        Username
      </label>
      <input
        autoComplete="off"
        className="formInput"
        ref={username}
        type="text"
        name="username"
        id="username"
      />
      <label className="formLabel" htmlFor="password">
        Password
      </label>
      <input
        autoComplete="off"
        ref={password}
        className="formInput"
        type="password"
        name="password"
        id="password"
      />
      <input className="formLink" type="submit" value="Submit" />
      {registerError && <span className="formError">{registerError}</span>}
    </form>
  );
};

export default Login;
