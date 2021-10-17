import React, { FormEvent, FormEventHandler, useLayoutEffect, useRef, useState } from 'react'
import validator from 'validator';
import { useRegisterMutation } from '../generated/graphql';
import {getDbErrors} from "../utils/getDbErrors";

React.useLayoutEffect = React.useEffect;

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation();

    const username: React.LegacyRef<HTMLInputElement> = useRef(null);
    const password: React.LegacyRef<HTMLInputElement> = useRef(null);
    const firstName: React.LegacyRef<HTMLInputElement> = useRef(null);
    const lastName: React.LegacyRef<HTMLInputElement> = useRef(null);
    const email: React.LegacyRef<HTMLInputElement> = useRef(null);

    const [registerError,setRegisterError] = useState("");
    const [error,setError] = useState("");

    useLayoutEffect(() => {
        const handleInput = () => {
            return email.current?.value === "" ? setError("") : 
            validator.isEmail(email.current?.value || "") ? setError("Correct!")
            : setError("This email is invalid!");
        }
        const {current} = email;
        current?.addEventListener('input' , handleInput);
    }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent ) => {
        event.preventDefault();
        const registerCall = await  register({
            username: username.current!.value,
            password: password.current!.value,
            firstName: firstName.current!.value,
            lastName: lastName.current!.value,
            email: email.current!.value
        });

        const errors = registerCall.data?.register.errors;
    }
    
    return (
        <form action="" className="register" onSubmit={handleSubmit}>
            <label className="register__label" htmlFor="username">Username</label>
            <input ref={username}
            autoComplete="off" className="register__input" type="text" name="username" id="username" />
            <label className="register__label" htmlFor="password">Password</label>
            <input ref={password} 
            autoComplete="off" className="register__input" type="password" name="password" id="password" />
            <label className="register__label" htmlFor="firstName">First Name</label>
            <input ref={firstName}
            autoComplete="off" className="register__input" type="text" name="firstName" id="firstName" />
            <label className="register__label" htmlFor="lastName">Last Name</label>
            <input ref={lastName}
            autoComplete="off" className="register__input" type="text" name="lastName" id="lastName" />
            <label className="register__label" htmlFor="email">Email</label>
            <input autoComplete="off" className="register__input" ref={email} type="text" name="email" id="email" />
            <span className={error === "Correct!" ? "register__correctEmail" 
            : "register__invalidEmail" }>{error}</span>
            <input className="register__submit" type="submit" value="Submit" />
            <span className="register__note"><i>*All fields are mandatory.</i></span>
           {registerError && <span className="register__error">{registerError}</span>}
        </form>
    );
}

export default Register;

 