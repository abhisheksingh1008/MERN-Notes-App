"use client";

import { useState, useContext, useEffect } from "react";

import Card from "@/components/Card";
import useInput from "@/hooks/useInput";
import classes from "@/styles/Form.module.css";
import buttonClasses from "@/styles/Button.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthContext from "@/store/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const Signup = () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formErrorMessage, setFormErroMessage] = useState(null);
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const { value: name, valueChangeHandler: nameChangeHandler } = useInput(
    (name) => {
      if (name.trim().length < 3)
        return "Name must be atleast 3 characters long";
      else return null;
    }
  );

  const { value: email, valueChangeHandler: emailChangeHandler } = useInput(
    (email) => {
      if (email.trim().includes("@")) return null;
      else return "Please enter a valid email.";
    }
  );

  const { value: password, valueChangeHandler: passwordChangeHandler } =
    useInput((password) => {
      if (password.trim().length < 6)
        return "Password must be atleast 6 characters long";
      else return null;
    });

  const {
    value: confirmedPassword,
    valueChangeHandler: confrimedPasswordChangeHandler,
  } = useInput((confirmedPassword) => {
    if (password !== confirmedPassword) return "Passwords did not match.";
    else return null;
  });

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (password.trim().length < 6) {
      setFormErroMessage("Password must be atleast 6 characters long.");
      return;
    }

    if (password !== confirmedPassword) {
      setFormErroMessage("Passwords did not match.");
      return;
    }

    setFormErroMessage(null);
    setFormIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      if (data.success) {
        authCtx.signup(data.user);
        router.replace("/notes");
        toast.success("Registration successful!");
      }
    } catch (error) {
      console.log(error);
      setFormErroMessage(error.message);
    }

    setFormIsSubmitting(false);
  };

  useEffect(() => {
    if (authCtx.user) {
      router.replace("/notes");
    }
  }, []);

  return (
    <Card className={classes["form-card"]}>
      <h1 className={classes.heading}>Register</h1>
      <form onSubmit={formSubmitHandler} autoComplete="on">
        <div className={classes["form-controls"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={nameChangeHandler}
              required
              autoFocus
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="email">Email : </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={emailChangeHandler}
              required
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={passwordChangeHandler}
              required
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="confirmedPassword">Confirm Password : </label>
            <input
              type="password"
              id="confirmedPassword"
              name="confirmedPassword"
              value={confirmedPassword}
              onChange={confrimedPasswordChangeHandler}
              required
            />
          </div>
          <div className={classes["form-actions"]}>
            <button
              type="submit"
              disabled={formIsSubmitting}
              className={`${classes["form-action"]} ${buttonClasses.button}`}
            >
              {formIsSubmitting ? <LoadingSpinner /> : "Register"}
            </button>
          </div>
          <div className={`${classes.login} ${classes["form-action"]}`}>
            Already a user?{" "}
            <Link className={classes.link} href="/login">
              Sign in
            </Link>
          </div>
          {formErrorMessage && (
            <div className={classes.error}>{formErrorMessage}</div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default Signup;
