import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ActionPanel(props) {
  const link = useRef();
  const navigate = useNavigate();

  function handleClick() {
    window.location.replace(link.current.value);
  }

  return (
    <div className="bg-white sm:rounded-lg w-full">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {props.title}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{props.description}</p>
        </div>
        <div className="mt-3 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              ref={link}
              type="text"
              name="email"
              id="email"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1 sm:text-sm border-gray-300 "
              placeholder={props.placeholder}
            />
          </div>
          <button
            onClick={handleClick}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-1.5 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {props.button}
          </button>
        </div>
      </div>
    </div>
  );
}
