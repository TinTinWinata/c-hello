/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  CodeIcon,
  DotsVerticalIcon,
  FlagIcon,
  StarIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function GridListComponent(props) {
  const { displayName, value, date } = props.comment;

  function getDate() {
    if (date == null || date.toDate == null) return "";
    return moment(date.toDate()).format("MMM Do YYYY h:mm:ss");
  }

  return (
    <div className="bg-white px-4 py-5 mb-4 sm:px-6 border shadow-sm rounded mr-7">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            <a href="#" className="hover:underline">
              {displayName}
            </a>
          </p>
          <p className="text-xs text-gray-500">
            <a href="#" className="hover:underline">
              {getDate()}
            </a>
          </p>
          <p className="font-normal text-xs">{value}</p>
        </div>
        <div className="flex-shrink-0 self-center flex">
          <Menu as="div" className="relative z-30 inline-block text-left">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                    <span className="sr-only">Open options</span>
                    <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "flex px-4 py-2 text-sm"
                            )}
                          >
                            <FlagIcon
                              className="mr-3 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span>Report content</span>
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default function GridList(props) {
  const { cardClicked } = props;
  const commentList = cardClicked ? cardClicked.commentList : undefined;

  return (
    <>
      {commentList
        ? commentList.map((comment) => {
            return (
              <GridListComponent
                key={comment.id}
                comment={comment}
              ></GridListComponent>
            );
          })
        : ""}
    </>
  );
}
