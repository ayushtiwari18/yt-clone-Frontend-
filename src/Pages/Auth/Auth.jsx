import React from "react";
import { googleLogout } from "@react-oauth/google";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import PropTypes from "prop-types";
import "./Auth.css";

function Auth({ User, setAuthBtn, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();

  const onLogOutSuccess = () => {
    dispatch(setCurrentUser(null));
    console.log("Log Out Successfully");
  };

  const handleLogout = () => {
    try {
      googleLogout();
      onLogOutSuccess();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If User is null, provide default values
  const userName = User?.name || "";
  const userEmail = User?.email || "";
  const userId = User?._id || "";

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2" onClick={(e) => e.stopPropagation()}>
        <div className="User_Details">
          <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {userName
                ? userName.charAt(0).toUpperCase()
                : userEmail.charAt(0).toUpperCase() || "?"}
            </p>
          </div>
          <div className="email_Auth">{userEmail || "No email"}</div>
        </div>
        <div className="btns_Auth">
          {userName ? (
            <Link to={`/chanel/${userId}`} className="btn_Auth">
              Your Channel
            </Link>
          ) : (
            <button
              className="btn_Auth"
              onClick={() => setEditCreateChanelBtn(true)}
            >
              Create Your Channel
            </button>
          )}
          <button onClick={handleLogout} className="btn_Auth">
            <BiLogOut />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

Auth.propTypes = {
  User: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    _id: PropTypes.string,
  }),
  setAuthBtn: PropTypes.func.isRequired,
  setEditCreateChanelBtn: PropTypes.func.isRequired,
};

Auth.defaultProps = {
  User: null,
};

export default Auth;
