import { toast } from "react-toastify";

export default function ToastHandler(stat, mess) {
  /*capitalizing first letter of each word of the message*/
  const arr = mess.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const message = arr.join(" ");

  if (stat === "warn") {
    toast.warn(message);
  } else if (stat === "sus") {
    toast.success(message);
  } else if (stat === "dan") {
    toast.error(message);
  } else if (stat === "info") {
    toast.info(message);
  } else {
    toast.info(message);
  }
  return true;
}
