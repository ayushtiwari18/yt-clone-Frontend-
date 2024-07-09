import * as api from "../api";
import { setCurrentUser } from "./currentUser";

export const login = (authData) => async (dispatch) => {
  try {
    // If you need to make an API call, uncomment the next line
    // const { data } = await api.login(authData);

    // For now, we'll use the data directly from Google
    const data = {
      result: authData.result,
      token: authData.token,
    };

    dispatch({ type: "AUTH", data });
    localStorage.setItem("Profile", JSON.stringify(data));
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  } catch (error) {
    alert(error);
  }
};

// You can add other auth-related actions here, such as logout
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("Profile");
    dispatch(setCurrentUser(null));
  } catch (error) {
    console.log(error);
  }
};
