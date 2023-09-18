"use client";

import { useContext } from "react";

import { useRouter } from "next/navigation";
import AuthContext from "@/store/auth-context";
import classes from "./page.module.css";

export default function Home() {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  if (authCtx.user) {
    router.replace("/notes");
  }

  return (
    <div className={classes["landing-wrapper"]}>
      <div className={classes["page-content"]}>
        <h1 className={classes.heading}>Landing Page</h1>
        <button
          className={classes.button}
          onClick={() => {
            router.push("/signup");
          }}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
