import React, { useState } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import Auth from "../../Pages/Auth/Auth";
import { jwtDecode } from "jwt-decode";

function Navbar({ toggleDrawer, setEditCreateChanelBtn }) {
  const [AuthBtn, setAuthBtn] = useState(false);
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();

  const onSuccess = (credentialResponse) => {
    console.log("Google Sign-In Successful", credentialResponse);
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Full decoded credential:", decoded);
      dispatch(
        login({
          result: {
            _id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
          },
          token: credentialResponse.credential,
        })
      );
    } else {
      console.error("No credential received from Google");
    }
  };

  const onError = (error) => {
    console.error("Google Sign-In Error", error);
    if (error.error) console.error("Error code:", error.error);
    if (error.details) console.error("Error details:", error.details);
  };

  return (
    <GoogleOAuthProvider clientId="407262567178-vg3abvkrfldvh8lbra2s7dt7t5858iuq.apps.googleusercontent.com">
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggleDrawer}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to="/" className="logo_div_Navbar">
            <img src={logo} alt="YouTube Logo" />
            <p className="logo_title_navbar">YouTube</p>
          </Link>
        </div>
        <SearchBar />
        <RiVideoAddLine size={22} className="vid_bell_Navbar" />
        <div className="apps_Box">
          {[...Array(9)].map((_, index) => (
            <p key={index} className="appBox"></p>
          ))}
        </div>
        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
        <div className="Auth_cont_Navbar">
          {CurrentUser?.result ? (
            <div className="Chanel_logo_App" onClick={() => setAuthBtn(true)}>
              <p className="fstChar_logo_App">
                {CurrentUser.result.name
                  ? CurrentUser.result.name.charAt(0).toUpperCase()
                  : CurrentUser.result.email.charAt(0).toUpperCase()}
              </p>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              useOneTap
              scope="email profile"
              render={({ onClick }) => (
                <button onClick={onClick} className="Auth_Btn">
                  <BiUserCircle size={22} />
                  <b>Sign in with Google</b>
                </button>
              )}
            />
          )}
        </div>
      </div>
      {AuthBtn && (
        <Auth
          setEditCreateChanelBtn={setEditCreateChanelBtn}
          setAuthBtn={setAuthBtn}
          User={CurrentUser}
        />
      )}
    </GoogleOAuthProvider>
  );
}

export default Navbar;
