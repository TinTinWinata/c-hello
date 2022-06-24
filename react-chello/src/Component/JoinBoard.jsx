import ActionPanel from "../Layout/ActionPanel";

export default function JoinBoard() {
  return (
    <>
      <div className="ml-6 mt-5 flex flex-col w-full">
        <ActionPanel
          title="Join a Board"
          description="Have a invited link ?"
          placeholder="/board-invite-link/example"
          button="Submit"
        ></ActionPanel>
      </div>
    </>
  );
}
