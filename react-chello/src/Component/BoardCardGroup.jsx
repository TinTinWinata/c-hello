import { CreateBoardCard } from "./CreateBoardCard";
import './BoardCardGroup.css'
import RealtimeBoard from "./RealtimeBoard";

export function BoardCardGroup()
{


  return(<>
      <div className="container">
      <RealtimeBoard></RealtimeBoard>
      <CreateBoardCard name="Create Card">
      </CreateBoardCard>
      </div>
      

  </>)
}