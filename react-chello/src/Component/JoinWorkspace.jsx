import ActionPanel from "../Layout/ActionPanel";

/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ]
  }
  ```
*/
export default function JoinWorkspace() {
  return (
    <>
      <div className="ml-3 mt-3 flex flex-col w-1/2">
        <ActionPanel
          title="Join a Workspace"
          description="Have a invited link ?"
          placeholder="/invite-link/example"
          button="Submit"
        ></ActionPanel>
        {/* <ActionPanel
          title="Join a Board"
          description="Have a invited link ?"
          placeholder="https://chello/invite-link/example"
          button="Submit"
          onClick={handleJoinBtn}
        ></ActionPanel> */}
      </div>
    </>
  );
}
