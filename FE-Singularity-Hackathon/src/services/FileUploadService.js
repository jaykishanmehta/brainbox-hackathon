import http from "../http-common";

const upload = (file, floor, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);
  formData.append("floor", floor);

  return http.post("/api/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const analyse = () => {
  return http.get("/analyse");
};

const getFiles = () => {
  return http.get("/files");
};

const FileUploadService = {
  upload,
  getFiles,
  analyse,
};

export default FileUploadService;
