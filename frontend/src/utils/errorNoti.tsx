import { notification } from "antd";

export const openErrNotification = (err_msg: string) => {
  notification.error({
    message: "Error",
    description: err_msg,
    duration: 4,
  });
};
