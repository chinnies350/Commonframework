import "../../styles/LandingPage/home.scss";
import HomePaymentHistory from "./HomePaymentHistory";
import HomeApp from "./homeApp";
import HomeNotification from "./HomeNotification";
import { getCookieData } from "../../Services/others";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PinUpdateNotification from "../../Pages/PinUpdatenotification/pinUpdateNotification";
import { getUserData } from "../../features/applications/applications";
import { DefaultModal } from "../../Components/Modal/DefaultModal";

const Home = () => {
  const dispatch = useDispatch();

  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );
  const [Showpin, setShowpin] = useState(false);
  useEffect(() => {
    async function getUserDataFun() {
      // alert("his")

      const userId = getCookieData("UserId") ?? 1;
      const res = await dispatch(getUserData({ userId })).unwrap();
      if (res.data.statusCode) {
        if (res.data.data[0])
          setShowpin(
            res?.data?.data[0]?.Password != "N" ||
              res?.data?.data[0]?.Pin != "N"
              ? false
              : true
          );
      }
    }
    getUserDataFun();
  }, []);

  const pinUpdate = async (e) => {
    setShowpin(e);
  };

  const handleCancel = () => {
    setShowpin(false);
  };

  return (
    <div className="homePageDiv">
      {Showpin && (
        <DefaultModal
          open={Showpin}
          title="Set PIN"
          footer={false}
          children={<PinUpdateNotification pinUpdate={pinUpdate} />}
          handleCancel={handleCancel}
          // handleSubmit={handleSubmit}
        />
      )}

      <div className="AppsCardParentDiv">
        <HomeApp />
      </div>
      <div className="homePageRightSideCards">
        {UserType === "Admin" || UserType === "Admin User" ? (
          <div className="homePageRightSideCard">
            <HomePaymentHistory />
          </div>
        ) : null}
        {UserType === "Admin" ||
        UserType === "Admin User" ||
        UserType === "Super Admin" ||
        UserType === "Super Admin User" ? (
          <div className="homePageRightSideCard">
            <HomeNotification />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
