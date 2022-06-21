import { CreateBoardCard } from "./CreateBoardCard";
import "./BoardCardGroup.css";
import RealtimeBoard from "./RealtimeBoard";

export function BoardCardGroup({ role }) {
  return (
    <>
      <div className="container">
        <RealtimeBoard role={role}></RealtimeBoard>
        {role ? <CreateBoardCard name="Create Card"></CreateBoardCard> : ""}
      </div>
    </>
  );
}
