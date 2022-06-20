import { Link } from "react-router-dom";

function SidebarComponent(props) {
  return (
    <li>
      <Link
        to={props.link}
        replace
        className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="ml-3">{props.text}</span>
      </Link>
    </li>
  );
}

export default SidebarComponent;
