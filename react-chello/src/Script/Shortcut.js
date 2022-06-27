import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShortcutList from "../Component/ShortcutList";

export function Shortcut({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((event) => {
    console.log(event.altKey);
    if (event.altKey === true) {
      if (event.key == "h") {
        navigate("/home");
      }
      if (event.key == "a") {
        setOpen((prev) => !prev);
      }
      if (event.key == "s") {
        navigate("/profile");
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <React.Fragment>
      {setOpen ? (
        <ShortcutList open={open} setOpen={setOpen}></ShortcutList>
      ) : (
        ""
      )}
      {children}
    </React.Fragment>
  );
}
