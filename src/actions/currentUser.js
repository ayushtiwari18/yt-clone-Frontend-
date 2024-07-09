export const setCurrentUser = (user) => {
  return {
    type: "FETCH_CURRENT_USER",
    payload: user,
  };
};
