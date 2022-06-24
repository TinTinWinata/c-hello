import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";
import { insertClosedBoard, updateBoard } from "../Model/Board";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserDb } from "../Model/User";
import { removeArrayByIndex } from "../Model/Util";

export default function CloseBoard({ board, role }) {
  const { userDb } = useUserAuth();
  const navigate = useNavigate();

  function handleClick() {
    if (!role || !board) toastError("Too fast darling!");
    board.closed = true;
    updateBoard(board).then(() => {
      insertClosedBoard(board.id, board.adminId);
      toastSuccess("Succesfully closing some board!");
    });

    navigate("/home");
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Are you sure want to close this board ?
      </h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        <p>You can open it again later</p>
      </div>
      <div className="mt-5">
        <button
          onClick={handleClick}
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
        >
          Close Board
        </button>
      </div>
    </div>
  );
}
