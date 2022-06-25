import { onSnapshot, query, where } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  boardCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";

export default function HomeSearching() {
  const [boardOption, setBoardboardOption] = useState([]);
  const [workspaceoption, setWorkspaceOption] = useState([]);
  const [option, setOption] = useState([]);

  const [workspace, setWorkspace] = useState([]);
  const [board, setBoard] = useState([]);
  const [myWorkspace, setMyWorkspace] = useState([]);

  const ref = createRef();
  const navigate = useNavigate();
  const { userDb } = useUserAuth();

  function handleChange(opt) {
    console.log("selected ", opt);
    if (!opt.value) {
      return;
    }
    const link = opt.value;
    navigate(link);
  }

  useEffect(() => {
    setOption([...boardOption, ...workspaceoption]);

    return () => {
      setOption([]);
    };
  }, [boardOption, workspaceoption]);

  useEffect(() => {
    if (workspace) {
      let temp = [];
      workspace.map((bo) => {
        const opt = { value: "/workspace/" + bo.id, label: bo.name };
        temp = [...temp, opt];
      });
      setWorkspaceOption(temp);
    }

    return () => {
      setWorkspaceOption([]);
    };
  }, [workspace]);

  useEffect(() => {
    if (board) {
      let temp = [];
      board.map((bo) => {
        const opt = { value: "/board/" + bo.id, label: bo.name };
        temp = [...temp, opt];
      });
      setBoardboardOption(temp);
    }
    return () => {
      setBoardboardOption([]);
    };
  }, [board]);

  useEffect(() => {
    const q = query(
      workspaceCollectionRef,
      where("visibility", "==", "Public")
    );
    const unsub = onSnapshot(q, (doc) => {
      setWorkspace(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const q = query(boardCollectionRef, where("visibility", "==", "Public"));
    const unsub = onSnapshot(q, (doc) => {
      setBoard(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <div className="ml-11 mt-16">
        <h1 className="text-xl font-bold text-gray-700 mb-3">
          Search Public Workspace!
        </h1>
        <Select
          className="w-96 basic-single"
          classNamePrefix="select"
          name="color"
          options={option}
          ref={ref}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
