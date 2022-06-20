import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function toastSuccess(title) {
  return toast.success(title, {
    position: toast.POSITION.BOTTOM_LEFT,
  });
}

export function toastError(title) {
  return toast.error(title, {
    position: toast.POSITION.BOTTOM_LEFT,
  });
}
