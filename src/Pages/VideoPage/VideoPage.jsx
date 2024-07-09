import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Hammer from "hammerjs";
import Comments from "../../Components/Comments/Comments";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";

function VideoPage() {
  const { vid } = useParams();
  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  };

  const handleViews = () => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  };

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();

    // Set up Hammer.js
    if (containerRef.current) {
      const hammer = new Hammer(containerRef.current);

      hammer.get("tap").set({ event: "tap", taps: 1, interval: 300 });
      hammer
        .get("doubletap")
        .set({ event: "doubletap", taps: 2, interval: 300 });
      hammer.get("press").set({ time: 500 });

      hammer.on("doubletap", handleDoubleTap);
      hammer.on("tap", handleTap);
      hammer.on("press", handlePress);
      hammer.on("pressup", handlePressUp);

      return () => {
        hammer.destroy();
      };
    }
  }, []);

  const handleDoubleTap = (e) => {
    const video = videoRef.current;
    if (!video) return;

    if (e.center.x > containerRef.current.offsetWidth / 2) {
      video.currentTime += 10;
    } else {
      video.currentTime -= 10;
    }
  };

  const handleTap = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    if (e.tapCount === 1) {
      if (
        e.center.x > containerWidth / 3 &&
        e.center.x < (containerWidth * 2) / 3
      ) {
        video.paused ? video.play() : video.pause();
      } else if (
        e.center.x > containerWidth * 0.8 &&
        e.center.y < containerHeight * 0.2
      ) {
        showLocationAndTemperature();
      }
    } else if (e.tapCount === 3) {
      if (
        e.center.x > containerWidth / 3 &&
        e.center.x < (containerWidth * 2) / 3
      ) {
        console.log("Move to next video");
        // Implement next video logic here
      } else if (e.center.x > (containerWidth * 2) / 3) {
        window.close();
      } else if (e.center.x < containerWidth / 3) {
        console.log("Show comment section");
        // Implement show comment section logic here
      }
    }
  };

  const handlePress = (e) => {
    const video = videoRef.current;
    if (!video) return;

    if (e.center.x > containerRef.current.offsetWidth / 2) {
      video.playbackRate = 2;
    } else {
      video.playbackRate = 0.5;
    }
  };

  const handlePressUp = () => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1;
    }
  };

  const showLocationAndTemperature = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Use a weather API to get temperature (example using OpenWeatherMap)
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=YOUR_API_KEY`
        )
          .then((response) => response.json())
          .then((data) => {
            const temp = data.main.temp;
            showNotification(
              `Location: ${lat.toFixed(2)}, ${lon.toFixed(
                2
              )}\nTemperature: ${temp}°C`
            );
          })
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );
      });
    } else {
      showNotification("Geolocation is not supported by this browser.");
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  };

  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage" ref={containerRef}>
            <video
              ref={videoRef}
              src={`https://youtube-backend-5h4f.onrender.com/${vv?.filePath}`}
              className={"video_ShowVideo_videoPage"}
              controls
              autoPlay
            ></video>
            <div className="video_details_videoPage">
              <div className="video_btns_title_VideoPage_cont">
                <p className="video_title_VideoPage"> {vv?.videoTitle}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.Views} views <div className="dot"></div>{" "}
                    {moment(vv?.createdAt).fromNow()}
                  </div>
                  <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
                </div>
              </div>
              <Link
                to={`/chanel/${vv?.videoChanel}`}
                className="chanel_details_videoPage"
              >
                <b className="chanel_logo_videoPage">
                  <p>{vv?.Uploder.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv?.Uploder}</p>
              </Link>
              <div className="comments_VideoPage">
                <h2>
                  <u>Comments</u>
                </h2>
                <Comments videoId={vv._id} />
              </div>
            </div>
          </div>
          <div className="moreVideoBar">More videos</div>
        </div>
      </div>
    </>
  );
}

export default VideoPage;
