import React, { FormEvent, FormEventHandler, useRef, useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [registerError, setRegisterError] = useState("");
  const [, login] = useLoginMutation();
  const username: React.LegacyRef<HTMLInputElement> = useRef(null);
  const password: React.LegacyRef<HTMLInputElement> = useRef(null);
  const buttonElement = useRef<HTMLButtonElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    buttonElement.current!.innerHTML = "";
    buttonElement.current!.classList.add("loading");
    let loginRequest = await login({
      username: username.current?.value || "",
      password: password.current?.value || "",
    });
    if (loginRequest.data?.login.errors) {
      setRegisterError(loginRequest.data.login.errors[0].message);
      buttonElement.current!.innerHTML = "Submit";
      buttonElement.current!.classList.remove("loading");
      return;
    }
    router.push("/user");
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
      <button className="formLink" ref={buttonElement} type="submit">
        Submit
      </button>
      {registerError && <span className="formError">{registerError}</span>}
    </form>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
