import ActionPanel from "../Layout/ActionPanel";

export default function JoinWorkspace() {
  return (
    <>
      <div className="ml-6 mt-5 flex flex-col w-full">
        <ActionPanel
          title="Join a Workspace"
          description="Have a invited link ?"
          placeholder="/invite-link/example"
          button="Submit"
        ></ActionPanel>
      </div>
    </>
  );
}
("");
