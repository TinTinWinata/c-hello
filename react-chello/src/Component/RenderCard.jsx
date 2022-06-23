import {
  documentId,
  GeoPoint,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { createRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import {
  cardCollectionRef,
  checklistCollectionRef,
} from "../Library/firebase.collections";
import { deleteCard, updateCard } from "../Script/Card";
import { insertChecklist } from "../Script/Checklist";
import CheckListCard from "./CheckListCard";
import moment from "moment";
import "./RenderCard.css";
import CardMap from "../Layout/Map";
import InputComment from "./InputComment";
import { useUserAuth } from "../Library/UserAuthContext";
import GridList from "./CommentGridList";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/firebase-config";
import { TagIcon } from "@heroicons/react/solid";
import RenderCardChecklist from "./RenderCardChecklist";
import RenderCardLabelForm from "./RenderCardLabelForm";
import { toastError, toastSuccess } from "../Script/Toast";
import RenderLabelList from "./RenderCardLabelList";
import uuid from "react-uuid";
import { useQuill } from "react-quilljs";

export function RenderCard(props) {
  const { user } = useUserAuth();

  var titleInput = createRef();
  var descriptionInput = createRef();
  var newChecklist = createRef();
  var datePicker = createRef();
  var commentInput = createRef();
  const location = useLocation();

  const [checklist, setChecklist] = useState([]);
  const [date, setDate] = useState();
  const [cardClicked, setCardClicked] = useState(props.cardClicked);
  const [status, setStatus] = useState("");
  const [imageList, setImageList] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const [checklistForm, setChecklistForm] = useState(false);
  const [dateForm, setDateForm] = useState(false);
  const [locationForm, setLocationForm] = useState(false);
  const [labelForm, setLabelForm] = useState(false);

  const { quill, quillRef } = useQuill();

  function handleLabelForm() {
    labelForm ? setLabelForm(false) : setLabelForm(true);
  }

  function handleChecklistForm() {
    checklistForm ? setChecklistForm(false) : setChecklistForm(true);
  }

  function handleDateForm() {
    dateForm ? setDateForm(false) : setDateForm(true);
  }
  function handleLocationForm() {
    locationForm ? setLocationForm(false) : setLocationForm(true);
  }

  function refreshPage() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  
  useEffect(() => {
    if (quill && cardClicked.innerDesc) {
      quill.clipboard.dangerouslyPasteHTML(cardClicked.innerDesc);
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        const innerDesc = quill.root.innerHTML;
        const desc = quill.getText();
        cardClicked.description = desc;
        cardClicked.innerDesc = innerDesc;
        updateCard(cardClicked);
      });
    }
  }, [quill]);

  const uploadImage = (img) => {
    if (img == null) {
      return;
    }

    const link = cardClicked.id + "/" + img.name;
    const imageRef = ref(storage, link);
    uploadBytes(imageRef, img)
      .then(() => {
        setStatus("Success upload data!");
        refreshPage();
      })
      .catch((e) => {
        setStatus(e.message);
      });
  };

  function handleAttachChange(e) {
    setStatus("Uploading...");
    const img = e.target.files[0];
    uploadImage(img);
  }

  useEffect(() => {
    return () => {
      props.setClickedCard();
    };
  }, []);

  function handleOnSubmitComment() {
    const comment = commentInput.current.value;
    if (!comment) return;
    // Return

    // Submit
    const commentObj = {
      displayName: user.displayName,
      email: user.email,
      userId: user.uid,
      value: comment,
      date: new Date(),
    };
    if (!cardClicked.commentList) {
      cardClicked.commentList = [commentObj];
    } else {
      cardClicked.commentList = [...cardClicked.commentList, commentObj];
    }

    commentInput.current.value = "";
    updateCard(cardClicked);
  }

  function handleMapClick(e) {
    const latitude = e.latLng;
    cardClicked.latitude = new GeoPoint(latitude.lat(), latitude.lng());
    updateCard(cardClicked);
  }

  function getLatitude() {
    if (!cardClicked.latitude) {
      return "";
    }
    var latitude = cardClicked.latitude.latitude;
    var longitude = cardClicked.latitude.longitude;
    latitude = latitude.toFixed(2);
    longitude = longitude.toFixed(2);
    const tempString = "(" + latitude + " , " + longitude + ")";
    return tempString;
  }

  function getImg() {
    const link = cardClicked.id + "/";
    const imageRef = ref(storage, link);
    listAll(imageRef).then((resp) => {
      resp.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }

  useEffect(() => {
    const q2 = query(
      cardCollectionRef,
      where(documentId(), "==", props.cardClicked.id)
    );
    const unsubscribeCard = onSnapshot(q2, (snapshot) => {
      setCardClicked({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id });
    });

    getImg();

    return () => {
      unsubscribeCard();
      setImageList([]);
    };

    // Unmount get card data
  }, [location, refresh]);

  useEffect(
    () => {
      if (cardClicked.date) {
        setDate(moment(cardClicked.date.toDate()).format("MMM Do YYYY"));
      }

      const q = query(
        checklistCollectionRef,
        where("cardId", "==", props.cardClicked.id)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChecklist(
          snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
        );
      });
      return () => {
        unsubscribe();
        setDate();
      };
    },
    [location],
    [cardClicked]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      cardClicked.name = titleInput.current.value;
      updateCard(cardClicked);
    }
  };

  const handleOnChange = (e) => {
    cardClicked.description = descriptionInput.current.value;
    updateCard(cardClicked);
  };

  const handleDelete = () => {
    deleteCard(cardClicked);
    props.setTrigger(false);
  };

  function handleOffClick() {
    props.setTrigger(false);
  }

  function handleInsertLabelCard(props, text) {
    if (cardClicked) {
      const newLabel = {
        id: uuid(),
        color: props.value,
        text: text.current.value,
      };
      cardClicked.label = [...cardClicked.label, newLabel];
      console.log("card : ", cardClicked);
      updateCard(cardClicked)
        .then(() => {
          toastSuccess("Success update card");
          handleLabelForm();
        })
        .catch((e) => {
          toastError("error updating card ", e.message);
        });
    }
  }

  const handleAddChecklist = () => {
    const checklistName = newChecklist.current.value;

    const checklist = {
      value: false,
      name: checklistName,
    };

    newChecklist.current.value = "";
    insertChecklist(cardClicked.id, checklist);
  };

  const handleDateOnChange = (date) => {
    cardClicked.date = date;
    setDate(moment(date).format("MMM Do YYYY"));
    updateCard(cardClicked);
  };

  return (
    <>
      <div className="w-screen h-screen fixed top-0 left-0 bg-black opacity-70"></div>
      <div className="flex flex-row overflow-y-auto z-10 w-fit h-5/6 fixed bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* LEFT SIDE */}
        <div className="w-96 h-fit ">
          <svg
            onClick={handleOffClick}
            className="right-5 top-5 absolute h-8 w-8 text-gray-500 cursor-pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="18" y1="6" x2="6" y2="18" />{" "}
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <div className="z-20 ml-5 mt-5 text-2xl font-bold flex flex-col">
            <input
              ref={titleInput}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              onKeyDown={handleKeyDown}
              defaultValue={cardClicked ? cardClicked.name : "New Card"}
              aria-label="Full name"
            />
            <div className="pt-4 mt-4 w-5/6 space-y-2 border-t border-gray-200 dark:border-gray-700"></div>
            <p
              className="text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Full name"
            >
              Description
            </p>
            <div className="h-40">
              <div className="font-normal" ref={quillRef} />
            </div>
            <div className="w-10 h-24 "></div>
            {cardClicked.label.length > 0 ? (
              <p
                className="mt-5 text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                aria-label="Full name"
              >
                Label
              </p>
            ) : (
              ""
            )}

            {cardClicked.label.map((label, idx) => {
              const color = "bg-[" + label.color + "] ";

              return (
                <RenderLabelList
                  key={idx}
                  label={label}
                  cardClicked={cardClicked}
                ></RenderLabelList>
              );
            })}
            {/* CHECKLIST */}
            {checklistForm ? (
              <RenderCardChecklist
                checklist={checklist}
                newChecklist={newChecklist}
                handleAddChecklist={handleAddChecklist}
              ></RenderCardChecklist>
            ) : (
              ""
            )}
            {dateForm ? (
              <div className="mt-5">
                <div className="flex">
                  <p
                    className="mt-3 w-32 text-lg appearance-none bg-transparent border-none  text-gray-700 px-2 leading-tight focus:outline-none"
                    type="text"
                    aria-label="Full name"
                  >
                    Due Date
                  </p>
                  <DatePicker
                    ref={datePicker}
                    className="pb-2 border-2 fit-content rounded-xl text-sm font-normal cursor-pointer date-picker "
                    onChange={handleDateOnChange}
                  />
                </div>
                <p className="z-10 ml-2 font-normal italic text-gray-700 text-sm w-1/4">
                  {date}
                </p>
              </div>
            ) : (
              ""
            )}

            {locationForm ? (
              <div className="mt-8">
                <div className="flex">
                  <p
                    className="ml-2 mt-2 text-lg appearance-none bg-transparent border-none w-fit text-gray-700 leading-tight focus:outline-none"
                    type="text"
                    aria-label="Full name"
                  >
                    Location
                  </p>
                  <p
                    className="ml-2 location text-sm appearance-none bg-transparent border-none w-fit text-gray-700 font-normal italic leading-tight focus:outline-none"
                    type="text"
                    aria-label="Full name"
                  >
                    {getLatitude()}
                  </p>
                </div>
                <div className="ml-2 mt-1">
                  <CardMap onClick={handleMapClick} />
                </div>
              </div>
            ) : (
              ""
            )}

            <p
              className="ml-2 mt-4 text-lg appearance-none bg-transparent border-none w-fit text-gray-700 leading-tight focus:outline-none"
              type="text"
              aria-label="Full name"
            >
              {imageList.length > 0 ? "Attachment" : ""}
            </p>
            <div className="flex w-full flex-row flex-wrap mb-5 mt-5">
              {imageList.map((src) => {
                return (
                  <>
                    <img src={src} className="mt-2 ml-2 w-[100px] h-[100px]" />
                  </>
                );
              })}
            </div>
            {/* <p
              className="ml-2 text-lg appearance-none bg-transparent border-none w-fit text-gray-700 leading-tight focus:outline-none"
              type="text"
              aria-label="Full name"
            >
              Comment
            </p> */}
            <div className="ml-2 mt-2 mb-5 ">
              <GridList cardClicked={cardClicked}></GridList>
            </div>
            <div className="ml-2 mr-5 font-normal">
              <InputComment
                handle={handleOnSubmitComment}
                commentInput={commentInput}
              ></InputComment>
            </div>
            <div className="flex mt-3">
              <button
                onClick={handleDelete}
                className="w-1/6 mt-5 appearance-none bg-transparent border-mt-2  bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 rounded"
              >
                Delete
              </button>
              <label
                htmlFor="file-upload"
                className="ml-3 w-1/6 mt-5 appearance-none b  g-transparent border-mt-2  bg-sky-500 hover:bg-sky-700 text-white text-sm font-bold py-2 px-2  rounded"
              >
                <div className="text">Attach</div>
              </label>
              <input
                onChange={handleAttachChange}
                id="file-upload"
                type="file"
                className="hidden"
              />
            </div>
            <p className="font-normal text-xs mb-5 text-green-700">{status}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[16rem] mt-16 pr-8 ml-8">
          <div className="">
            <div
              onClick={handleLabelForm}
              className="hover:bg-gray-400 cursor-pointer flex w-full h-9 my-3 bg-gray-300 rounded-md"
            >
              <TagIcon className="scale-50 stroke-gray-800"></TagIcon>
              <p className="mt-[0.3rem] font-light">Labels</p>
            </div>
            {labelForm ? (
              <RenderCardLabelForm
                handleInsertLabelCard={handleInsertLabelCard}
                handle={handleLabelForm}
              ></RenderCardLabelForm>
            ) : (
              ""
            )}
            <div
              className="hover:bg-gray-400 cursor-pointer flex w-full h-9 my-3 bg-gray-300 rounded-md"
              onClick={handleChecklistForm}
            >
              <TagIcon className="scale-50 stroke-gray-800"></TagIcon>
              <p className="mt-[0.3rem] font-light">Checklist</p>
            </div>

            <div
              className="hover:bg-gray-400 cursor-pointer flex w-full h-9 my-3 bg-gray-300 rounded-md"
              onClick={handleDateForm}
            >
              <TagIcon className="scale-50 stroke-gray-800"></TagIcon>
              <p className="mt-[0.3rem] font-light">Due Date</p>
            </div>

            <div
              className="hover:bg-gray-400 cursor-pointer flex w-full h-9 my-3 bg-gray-300 rounded-md"
              onClick={handleLocationForm}
            >
              <TagIcon className="scale-50 stroke-gray-800"></TagIcon>
              <p className="mt-[0.3rem] font-light">Location</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
