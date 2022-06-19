import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function toastSuccess(title)
{
  toast.success(title, {
    position: toast.POSITION.BOTTOM_LEFT,
  });
}

export function toastError(title)
{
  toast.error(title, {
    position: toast.POSITION.BOTTOM_LsEFT,
  });
}
