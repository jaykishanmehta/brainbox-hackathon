import React, { useState, useRef } from "react";
import UploadService from "../services/FileUploadService";
import SplineChart from "../components/SplineChart";

const UploadImages = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [progressInfos, setProgressInfos] = useState({ val: [] });
  const [message, setMessage] = useState([]);
  const [imageInfos, setImageInfos] = useState([]);
  const [analysisInfos, setAnalysisInfos] = useState({
    source: String,
    destination: String,
    source_count: Number,
    destination_vacancy: Number,
  });
  const progressInfosRef = useRef(null);
  const [selectedFloor, setSelectedFloor] = useState(String);

  // useEffect(() => {
  //   UploadService.getFiles().then((response) => {
  //     setImageInfos(response.data);
  //   });
  // }, []);

  const selectFiles = (event) => {
    let images = [];

    for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
    }

    setSelectedFiles(event.target.files);
    setImagePreviews(images);
    setProgressInfos({ val: [] });
    setMessage([]);
  };

  const selectFloor = (event) => {
    console.log("event-target==", event.target.value);
    setSelectedFloor(event.target.value);
  };

  const upload = (idx, file, floor) => {
    let _progressInfos = [...progressInfosRef.current.val];
    return UploadService.upload(file, floor, (event) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total
      );
      setProgressInfos({ val: _progressInfos });
    })
      .then(() => {
        setMessage((prevMessage) => [
          ...prevMessage,
          "Uploaded the image successfully: " + file.name,
        ]);
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        setProgressInfos({ val: _progressInfos });

        setMessage((prevMessage) => [
          ...prevMessage,
          "Could not upload the image: " + file.name,
        ]);
      });
  };

  const uploadImages = () => {
    const files = Array.from(selectedFiles);

    let _progressInfos = files.map((file) => ({
      percentage: 0,
      fileName: file.name,
    }));

    progressInfosRef.current = {
      val: _progressInfos,
    };

    const uploadPromises = files.map((file, i) =>
      upload(i, file, selectedFloor)
    );

    Promise.all(uploadPromises)
      .then(() => UploadService.getFiles())
      .then((files) => {
        setImageInfos(files.data);
      });

    setMessage([]);
  };

  const analyse = () => {
    return UploadService.analyse().then((obj) => {
      console.log("obj=-======", obj);
      setAnalysisInfos(obj.data);
    });
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <label className="btn btn-default p-0">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={selectFiles}
            />
          </label>
          <label className="btn btn-default p-0">
            Enter Floor No for image
            <input type="text" onChange={selectFloor} />
          </label>
          <button
            className="btn btn-success btn-sm"
            disabled={!selectedFiles}
            onClick={uploadImages}
          >
            Upload
          </button>
        </div>
        <div className="mt-5"></div>
        <div className="mt-5"></div>
        <div className="mt-5"></div>

        <div className="col-12">
          <div className="card">
            <button className="btn btn-success btn-sm" onClick={analyse}>
              Analyse
            </button>
          </div>
        </div>
      </div>

      {progressInfos &&
        progressInfos.val.length > 0 &&
        progressInfos.val.map((progressInfo, index) => (
          <div className="mb-2" key={index}>
            <span>{progressInfo.fileName}</span>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info"
                role="progressbar"
                aria-valuenow={progressInfo.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progressInfo.percentage + "%" }}
              >
                {progressInfo.percentage}%
              </div>
            </div>
          </div>
        ))}

      {imagePreviews && (
        <div>
          {imagePreviews.map((img, i) => {
            return (
              <img className="preview" src={img} alt={"image-" + i} key={i} />
            );
          })}
        </div>
      )}

      {message.length > 0 && (
        <div className="alert alert-secondary mt-2" role="alert">
          <ul>
            {message.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </div>
      )}

      {imageInfos.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">List of Images</div>
          <ul className="list-group list-group-flush">
            {imageInfos &&
              imageInfos.map((img, index) => (
                <li className="list-group-item" key={index}>
                  <p>
                    <a href={img.url}>{img.name}</a>
                  </p>
                  <img src={img.url} alt={img.name} height="80px" />
                </li>
              ))}
          </ul>
        </div>
      )}
      {analysisInfos.under_utilized && (
        <div className="card  mt-3">
          <div class="card-header text-white bg-info ">Inportant Notice</div>
          <div className="card-body ">
            <h6>
              Floor : {analysisInfos.source} people kindly move to Floor:{" "}
              {analysisInfos.destination}
            </h6>
          </div>
        </div>
      )}
      {!analysisInfos.under_utilized && (
        <div className="card mt-3">
          <span>No Floor under utilized</span>
        </div>
      )}

      <div class="col-12">
        {" "}
        <SplineChart
          actual_consumption={analysisInfos.actual_consumption}
          expected_consumption={analysisInfos.expected_consumption}
        />
      </div>
    </div>
  );
};

export default UploadImages;
