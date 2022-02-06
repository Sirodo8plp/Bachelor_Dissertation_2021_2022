import React, {
  FormEvent,
  FormEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import validator from "validator";
import { useRegisterMutation } from "../generated/graphql";
import { getDbErrors } from "../utils/getDbErrors";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

React.useLayoutEffect = React.useEffect;

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  const username: React.LegacyRef<HTMLInputElement> = useRef(null);
  const password: React.LegacyRef<HTMLInputElement> = useRef(null);
  const firstName: React.LegacyRef<HTMLInputElement> = useRef(null);
  const lastName: React.LegacyRef<HTMLInputElement> = useRef(null);
  const email: React.LegacyRef<HTMLInputElement> = useRef(null);
  const [registerError, setRegisterError] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    if (!validator.isEmail(email.current?.value || ""))
      return setRegisterError("Please, provide a valid email!");

    const registerCall = await register({
      username: username.current!.value,
      password: password.current!.value,
      firstName: firstName.current!.value,
      lastName: lastName.current!.value,
      email: email.current!.value
    });

    const errors = getDbErrors(registerCall.data?.register.errors);
    if (Object.keys(errors).length > 0) setRegisterError(errors["error"]);
    else router.push("/user");
  };

  return (
    <form action="" className="form" onSubmit={handleSubmit}>
      <h2 className="formTitle">Register Now!</h2>
      <label className="formLabel" htmlFor="username">
        Username
      </label>
      <input
        ref={username}
        autoComplete="off"
        className="formInput"
        type="text"
        name="username"
        id="username"
      />
      <label className="formLabel" htmlFor="password">
        Password
      </label>
      <input
        ref={password}
        autoComplete="off"
        className="formInput"
        type="password"
        name="password"
        id="password"
      />
      <label className="formLabel" htmlFor="firstName">
        First Name
      </label>
      <input
        ref={firstName}
        autoComplete="off"
        className="formInput"
        type="text"
        name="firstName"
        id="firstName"
      />
      <label className="formLabel" htmlFor="lastName">
        Last Name
      </label>
      <input
        ref={lastName}
        autoComplete="off"
        className="formInput"
        type="text"
        name="lastName"
        id="lastName"
      />
      <label className="formLabel" htmlFor="email">
        Email
      </label>
      <input
        autoComplete="off"
        className="formInput"
        ref={email}
        type="text"
        name="email"
        id="email"
      />
      <input className="formLink" type="submit" value="Submit" />
      <span className="form__note">
        <i>*All fields are mandatory.</i>
      </span>
      {registerError && <span className="formError">{registerError}</span>}
    </form>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
