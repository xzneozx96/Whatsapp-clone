import { Fragment, useState } from "react";
import { Upload } from "antd";
import { AssetsUploadStyles } from "../styles";
import { UploadFile } from "antd/lib/upload/interface";
import { Conversation } from "../interfaces";
import { ReactComponent as EmptyUploadIcon } from "../images/empty-upload.svg";
import { useAppDispatch } from "../app/hooks";
import { sendFiles } from "../redux/chat-slice";

export const AssetsUpload: React.FC<{
  currentConversation: Conversation | null;
}> = (props) => {
  const dispatch = useAppDispatch();

  const [uploadState, setUploadState] = useState<{
    previewImage: string | undefined;
    previewTitle: string | undefined;
    fileList: UploadFile[];
    componentVisible: boolean;
  }>({
    previewImage: undefined,
    previewTitle: undefined,
    fileList: [],
    componentVisible: true,
  });

  const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // A callback function, will be executed when preview icon is clicked
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploadState({
      ...uploadState,
      previewImage: file.url || file.preview,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  // A callback function, can be executed when uploading state is changing
  const handleChange = async (data: any) => {
    const { fileList } = data;

    const first_uploaded_item = fileList[0];

    if (first_uploaded_item) {
      const preview_image_base64 = (await getBase64(
        first_uploaded_item.originFileObj
      )) as string;

      // set preview image as the first selected file
      setUploadState({
        ...uploadState,
        fileList,
        previewImage: preview_image_base64 || "",
        previewTitle: first_uploaded_item.name,
      });
    } else {
      setUploadState({
        ...uploadState,
        fileList,
        previewImage: undefined,
        previewTitle: undefined,
      });
    }
  };

  const customRequest = (data: any) => {
    console.log(data.file);

    setTimeout(() => {
      data.onSuccess("ok");
    }, 0);
  };

  const handleSendFiles = () => {
    const formData = new FormData();

    for (let i = 0; i < uploadState.fileList.length; i++) {
      formData.append("files", uploadState.fileList[i].originFileObj!);
    }
    dispatch(sendFiles(formData));
  };

  return (
    <Fragment>
      {uploadState.componentVisible && (
        <AssetsUploadStyles>
          {!uploadState.previewImage && (
            <div className="empty_assets_placeholder">
              <EmptyUploadIcon />
              <h4 style={{ marginTop: 20 }}>
                You can preview uploaded files here here
              </h4>
            </div>
          )}

          {uploadState.previewImage && (
            <Fragment>
              <div className="preview_img">
                <h5>{uploadState.previewTitle}</h5>
                <img src={uploadState.previewImage} alt="preview" />
              </div>

              <div className="msg_input">
                <div className="input_field">
                  <input
                    type="text"
                    placeholder="Enter your message"
                    className="form-control"
                  />
                </div>

                <div className="send_msg_btn" onClick={handleSendFiles}>
                  <i className="bx bx-send"></i>
                  <span>{uploadState.fileList.length}</span>
                </div>
              </div>
            </Fragment>
          )}

          <Upload
            listType="picture-card"
            onPreview={handlePreview}
            onChange={handleChange}
            customRequest={customRequest}
            multiple
            accept="image/*, video/*"
          >
            <div>
              <i className="bx bx-plus"></i>
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </AssetsUploadStyles>
      )}
    </Fragment>
  );
};
