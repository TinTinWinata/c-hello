import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";
import { updateBoard } from "../Model/Board";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserDb } from "../Model/User";
import { removeArrayByIndex } from "../Model/Util";

export default function LeaveBoard({ board, role }) {
  const { userDb } = useUserAuth();
  const navigate = useNavigate();

  function handleClick() {
    if (!role) toastError("Too fast darling!");

    if (role == "Admin") {
      const adminList = board.adminId;
      let idx = 0;
      adminList.map((aId) => {
        if (aId == userDb.userId) {
          return;
        }
        idx += 1;
      });
      removeArrayByIndex(adminList, idx);
      board.adminId = adminList;
      updateBoard(board)
        .then(() => {
          userDb.board.map((userBoard) => {
            let idx = 0;
            if (userBoard.id == board.id) {
              return;
            }
            idx++;
          });
          removeArrayByIndex(userDb.board, idx);
          updateUserDb(userDb)
            .then(() => {
              toastSuccess("Success leaving board");
              navigate("/home");
            })
            .catch((e) => {
              toastError("Failed to remove board from user!", e.message);
            });
        })
        .catch((e) => {
          toastError("Failed to remove admin ", e.message);
        });
    }

    // navigate("/home")
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Want to leave this board ?
      </h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        <p>
          Once you delete leave your board, you will lose all data associated
          with it.
        </p>
      </div>
      <div className="mt-5">
        <button
          onClick={handleClick}
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
        >
          Leave Board
        </button>
      </div>
    </div>
  );
}
