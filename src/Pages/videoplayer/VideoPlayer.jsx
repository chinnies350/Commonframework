import React from "react";
// import { Player } from "video-react";
import Thumbnail from "../../Images/thumb.png";
import  MobileMockup from "../../Images/MobileMockup.mp4"
import "./PlayerTheme.scss"
const Video = () => {
  return (
    <div>
      <video
        id="my-video"
        class="video-js vjs-theme-forest"
        controls
        preload="auto"
        width="1366"
        height="574"
        poster={Thumbnail}
        data-setup="{}"
      >
        <source src={MobileMockup} type="video/mp4" /> 
        {/* <source src="MY_VIDEO.webm" type="video/webm" /> */}
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  );
};

export default Video;
