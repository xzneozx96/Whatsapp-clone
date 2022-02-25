import { Upload } from "antd";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { ReactComponent as EmptyUploadIcon } from "../images/empty-upload.svg";
import { Conversation } from "../interfaces";
import { sendFiles } from "../redux/chat-slice";
import { AssetsUploadStyles } from "../styles";

export const AssetsUpload: React.FC<{
  currentConversation: Conversation | null;
  uploadFileType: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  onClose: () => void;
}> = (props) => {
  const dispatch = useAppDispatch();
  const socket = useSelector((state: RootState) => state.chatReducers.socket);

  const [newMsg, setNewMsg] = useState("");
  const [sendingFiles, setSendingFiles] = useState(false);

  const [uploadState, setUploadState] = useState<{
    previewFile: string | undefined;
    previewFileType: string | undefined;
    previewTitle: string | undefined;
    fileList: any;
  }>({
    previewFile: undefined,
    previewFileType: undefined,
    previewTitle: undefined,
    fileList: [],
  });

  const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        return resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const getFileType = (file: File) => {
    const mimeType = file.type.split("/");
    return mimeType[0]; // result might be: image/video/docx/pdf...
  };

  // A callback function, will be executed when preview icon is clicked
  const handlePreview = async (file: any) => {
    const file_type = getFileType(file);

    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploadState({
      ...uploadState,
      previewFileType: file_type,
      previewFile: file.preview,
      previewTitle: file.name,
    });
  };

  // beforeUpload() is used to set preview file to the first selected file
  const beforeUpload = async (file: File, fileList: File[]) => {
    // fileList holds array of selected files
    const first_selected_file = fileList[0];

    const file_type = getFileType(first_selected_file);

    const preview_base64 = (await getBase64(first_selected_file)) as string;

    setUploadState({
      ...uploadState,
      previewFileType: file_type,
      previewFile: preview_base64,
      previewTitle: first_selected_file.name,
      fileList: [...uploadState.fileList, ...fileList],
    });

    return true;
  };

  const removeUploadedFile = async (file: any) => {
    const fileList_length = uploadState.fileList.length;

    const removed_file_index = uploadState.fileList
      .map((uploadedFile: any) => uploadedFile.uid)
      .indexOf(file.uid);

    const remain_files = uploadState.fileList.filter(
      (uploaded_file: any) => file.uid !== uploaded_file.uid
    );

    // only run into this if block code when user removes the one that is on preview
    if (uploadState.previewTitle === file.originFileObj.name) {
      // reset state when user remove the last selected file - no file remain
      if (!remain_files.length) {
        setUploadState({
          ...uploadState,
          fileList: [],
          previewFile: undefined,
          previewTitle: undefined,
        });

        return true;
      }

      // set preview file to the first file from the remain_files array if user remove the first selected file
      if (removed_file_index === 0) {
        const file_type = getFileType(remain_files[0]);
        const preview_base64 = (await getBase64(remain_files[0])) as string;

        setUploadState({
          ...uploadState,
          previewFileType: file_type,
          previewFile: preview_base64,
          previewTitle: remain_files[0].name,
          fileList: remain_files,
        });

        return true;
      }

      // set preview file to the last file from the remain_files array if user removes the last selected file
      if (removed_file_index === fileList_length - 1) {
        const remain_files_length = remain_files.length;
        const file_type = getFileType(remain_files[remain_files_length - 1]);
        const preview_base64 = (await getBase64(
          remain_files[remain_files_length - 1]
        )) as string;

        setUploadState({
          ...uploadState,
          previewFileType: file_type,
          previewFile: preview_base64,
          previewTitle: remain_files[remain_files_length - 1].name,
          fileList: remain_files,
        });

        return true;
      }

      // set preview file the one right in front of the removed file - if none of the above condition matches, code will reach here
      const file_type = getFileType(remain_files[removed_file_index - 1]);
      const preview_base64 = (await getBase64(
        remain_files[removed_file_index - 1]
      )) as string;

      setUploadState({
        ...uploadState,
        previewFileType: file_type,
        previewFile: preview_base64,
        previewTitle: remain_files[removed_file_index - 1].name,
        fileList: remain_files,
      });

      return true;
    }

    setUploadState({
      ...uploadState,
      fileList: remain_files,
    });

    return true;
  };

  const customRequest = (data: any) => {
    data.onSuccess("ok");
  };

  const onSendFiles = async () => {
    const formData = new FormData();

    formData.append("conversationId", props.conversationId as string | Blob);
    formData.append("senderId", props.senderId as string | Blob);
    formData.append("message", newMsg);

    console.log(uploadState.fileList);

    for (let i = 0; i < uploadState.fileList.length; i++) {
      formData.append("files", uploadState.fileList[i]!);
    }

    setSendingFiles(true);
    const result = await dispatch(sendFiles(formData)).unwrap();

    // notify the socket server every time new message sent
    socket?.emit("sendMsg", {
      ...result.new_msg,
      receiverId: props.receiverId,
    });

    setSendingFiles(false);
    setNewMsg("");

    // close the upload component by calling a method on its parent that will set showUploadComponent to false
    props.onClose();
  };

  return (
    <AssetsUploadStyles>
      {!uploadState.previewFile && (
        <div className="empty_assets_placeholder">
          <EmptyUploadIcon />
          <h4 style={{ marginTop: 20 }}>
            You can preview uploaded files here here
          </h4>
        </div>
      )}

      {uploadState.previewFile && (
        <Fragment>
          <div className="preview_img">
            <h5>{uploadState.previewTitle}</h5>

            {/* show preview for images only */}
            {uploadState.previewFileType === "image" && (
              <img src={uploadState.previewFile} alt="preview" />
            )}

            {/* show preview for videos only */}
            {uploadState.previewFileType === "video" && (
              <video width={"100%"} controls src={uploadState.previewFile} />
            )}

            {/* show preview for documents only */}
            {uploadState.previewFileType === "application" && (
              <div className="empty_assets_placeholder">
                <EmptyUploadIcon />
                <h4 style={{ marginTop: 20 }}>Preview is not supported</h4>
              </div>
            )}
          </div>

          <div className="msg_input">
            <div className="input_field">
              <input
                onChange={(event: any) => {
                  setNewMsg(event.target.value);
                }}
                value={newMsg}
                type="text"
                placeholder="Enter your message"
                className="form-control"
              />
            </div>

            {!sendingFiles && (
              <div className="send_msg_btn" onClick={onSendFiles}>
                <i className="bx bx-send"></i>
                <span>{uploadState.fileList.length}</span>
              </div>
            )}

            {sendingFiles && (
              <i
                style={{
                  color: "#00a884",
                  fontSize: "2rem",
                }}
                className="bx bx-loader-alt bx-spin"
              ></i>
            )}
          </div>
        </Fragment>
      )}

      <Upload
        multiple
        listType="picture-card"
        accept={props.uploadFileType}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={removeUploadedFile}
      >
        <div>
          <i className="bx bx-plus"></i>
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </AssetsUploadStyles>
  );
};
