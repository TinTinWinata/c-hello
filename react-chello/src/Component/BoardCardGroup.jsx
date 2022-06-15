import { BoardCard } from "./BoardCard";
import { CreateBoardCard } from "./CreateBoardCard";
import './BoardCardGroup.css'

export function BoardCardGroup()
{


  return(<>
      <div className="container">
      <BoardCard>
      </BoardCard>
      <CreateBoardCard name="Create Card">
      </CreateBoardCard>
      </div>
      

  </>)
}