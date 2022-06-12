export const showTopProgress = (state = false, action) => {
  switch (action.type) {
    case "SHOW_PROGRESS":
      return true;
    case "HIDE_PROGRESS":
      return false;
    default:
      return state;
  }
};
