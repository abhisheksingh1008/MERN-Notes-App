"use client";

import { useState, useContext, useEffect } from "react";

import { useRouter } from "next/navigation";
import AuthContext from "@/store/auth-context";
import Card from "@/components/Card";
import classes from "@/styles/Form.module.css";
import buttonClasses from "@/styles/Button.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import Link from "next/link";

const initialFormData = {
  email: "",
  password: "",
  isSubmitting: false,
  errorMessage: null,
};

const Login = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const inputChangeHandler = (event) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setFormData((prev) => {
      return {
        ...prev,
        isSubmitting: true,
        errorMessage: null,
      };
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      if (data.success) {
        authCtx.login(data.user);
        router.replace("/notes");
        toast.success("Login successful.");
        toast.success(`Welcome back ${data.user.name}`);
      }
    } catch (error) {
      console.log(error);
      setFormData((prev) => {
        return {
          ...prev,
          errorMessage: error.message,
        };
      });
    }

    setFormData((prev) => {
      return {
        ...prev,
        isSubmitting: false,
      };
    });
  };

  useEffect(() => {
    if (authCtx.user) {
      router.replace("/notes");
    }
  }, []);

  return (
    <Card className={classes["form-card"]}>
      <h1 className={classes.heading}>Login</h1>
      <form onSubmit={formSubmitHandler} autoComplete="on">
        <div className={classes["form-controls"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="email">Email : </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={inputChangeHandler}
              required
              autoFocus
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="password">Password : </label>
            <div className={classes["password-field-wrapper"]}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={inputChangeHandler}
                style={{ paddingRight: "4rem" }}
                required
              />
              <button
                type="button"
                className={classes["toggle-pass-btn"]}
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className={classes["form-actions"]}>
            <button
              type="submit"
              disabled={formData.isSubmitting}
              className={`${classes["form-action"]} ${buttonClasses.button}`}
            >
              {formData.isSubmitting ? <LoadingSpinner /> : "Login"}
            </button>
            <button
              type="button"
              disabled={formData.isSubmitting}
              className={`${classes["form-action"]} ${buttonClasses.button}`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  email: "guestuser@example.com",
                  password: "12345678",
                }));
              }}
            >
              {formData.isSubmitting ? (
                <LoadingSpinner />
              ) : (
                "Get guest user credentials"
              )}
            </button>
          </div>
          <div className={`${classes.register} ${classes["form-action"]}`}>
            New to App?{" "}
            <Link className={classes.link} href={"/signup"}>
              Sign up
            </Link>
          </div>
          {formData.errorMessage && (
            <div className={classes.error}>{formData.errorMessage}</div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default Login;
