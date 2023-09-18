"use client";

import { useContext } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from "@/store/auth-context";
import classes from "@/styles/Navbar.module.css";
import { BiArchiveIn } from "react-icons/bi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const pathname = usePathname();

  const logoutHandler = () => {
    authCtx.logout();
  };

  const homePageActions = (
    <>
      <div className={classes["navbar-right-container"]}>
        <Link
          href={"/notes"}
          className={
            pathname === "/notes"
              ? `${classes["navbar-action"]} ${classes.active}`
              : classes["navbar-action"]
          }
        >
          Home
        </Link>
        <Link
          href={"/archive"}
          className={
            pathname === "/archive"
              ? `${classes["navbar-action"]} ${classes.active}`
              : classes["navbar-action"]
          }
        >
          <BiArchiveIn className={classes["button-icon"]} />
          Archive
        </Link>
        <li className={`w3-dropdown-hover w3-right`}>
          <span
            style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}
          >
            <CgProfile className={classes["button-icon"]} />
            <RiArrowDropDownLine
              style={{ fontSize: "2.5rem", margin: "0px", padding: "0px" }}
            />
          </span>
          <div
            className="w3-dropdown-content w3-bar-block w3-border"
            style={{ right: 0 }}
          >
            <Link
              href="/login"
              className={`w3-bar-item w3-button`}
              onClick={logoutHandler}
            >
              Logout
            </Link>
          </div>
        </li>
      </div>
    </>
  );

  const landingPageActions = (
    <>
      <Link
        href={"/login"}
        className={
          pathname === "/login"
            ? `${classes["navbar-action"]} ${classes.active}`
            : classes["navbar-action"]
        }
      >
        Login
      </Link>
      <Link
        href={"/signup"}
        className={
          pathname === "/signup"
            ? `${classes["navbar-action"]} ${classes.active}`
            : classes["navbar-action"]
        }
      >
        Register
      </Link>
    </>
  );

  return (
    <header>
      <nav className={classes.navbar}>
        <Link
          className={classes["navbar-left"]}
          href={authCtx.user ? "/notes" : "/"}
        >
          <Image
            width={23}
            height={23}
            src="/favicon.ico"
            alt="App logo"
            priority
          />
          <div className={classes["app-title"]}>Notes App</div>
        </Link>
        <div className={classes["navbar-actions"]}>
          {authCtx.user ? homePageActions : landingPageActions}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
