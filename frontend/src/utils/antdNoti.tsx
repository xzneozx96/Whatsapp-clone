import { notification } from "antd";
import { chatActions } from "../redux/chat-slice";

let store: any;

export const injectStoreToUtils = (_store: any) => {
  store = _store;
};

export const openErrNotification = (err_msg: string) => {
  notification.error({
    message: "Error",
    description: err_msg,
    duration: 4,
  });
};

export const openInfoNotification = (info_msg: string) => {
  const key = `open${Date.now()}`;

  const scrollBottom = () => {
    store.dispatch(chatActions.manualScrollBottom());
    notification.close(key);
  };

  notification.info({
    message: "New Message",
    description: info_msg,
    duration: 4,
    btn: <button className="btn primary_btn">Open</button>,
    onClick: scrollBottom,
  });
};
