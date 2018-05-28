export function loadState() {
  return (dispatch, getState) => {
    dispatch({
      type: "LOAD_STATE",
      state: getState()
    });
  };
}
