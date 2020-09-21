export const usePreventLeave = () => {
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () => window.addEventListener("beforeunload", listener);
  const disablePrevnet = () =>
    window.removeEventListener("beforeunload", listener);

  return { enablePrevent, disablePrevnet };
};
