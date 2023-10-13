import { useEffect } from "react";

export default function Timer({ dispatch, remainingSeconds }) {
  useEffect(() => {
    const id = setInterval(function () {
      dispatch({ type: "tick" });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds & 60;
  return (
    <>
      <div className="timer">
        {mins < 10 && "0"}
        {mins}:{secs < 10 && "0"}
        {secs}
      </div>
    </>
  );
}
