import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShortcutList from "../Component/ShortcutList";

export function Shortcut({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((event) => {
    if (event.shiftKey === true) {
      if (event.key == "H") {
        navigate("/home");
      }
      if (event.key == "A") {
        setOpen((prev) => !prev);
      }
      if (event.key == "S") {
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
