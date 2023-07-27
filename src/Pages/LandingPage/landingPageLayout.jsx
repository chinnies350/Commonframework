import { IoBagHandleOutline } from "react-icons/io5";
import { BiHomeSmile, BiCartAdd } from "react-icons/bi";
import { getItem, getsubItem } from "../../Components/Menu/SideMenu";
import { FiSettings } from "react-icons/fi";
import { RiUser3Line } from "react-icons/ri";
import SideMenu from "../../Components/Menu/SideMenu";
// import CenterPage from '../appPage/CenterPage'
import payprelogo from "../../Images/payprelogo.svg";
import { Outlet } from "react-router-dom";
import { getCookieData } from "../../Services/others";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getuserAppMap } from "../../features/signInPage/signInPage";

const subDirectory = import.meta.env.BASE_URL;

const LandignPageLayout = () => {
  const dispatch = useDispatch()
  const [application, setApplication] = useState([])
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  const UserId = getCookieData('UserId')

  useEffect(() => {
    if (UserType == 'Admin') {
      getAppData()
    }
    

    async function getAppData() {
      try{
        const res = await dispatch(getuserAppMap({UserId})).unwrap()
        console.log('getApp', res);
        if (res.data.statusCode) {
          setApplication(res.data.data)
        }
      } catch (e) {
        console.log('err', e)
      }
    }

  }, [])
  

  const SadminContent = [
    getItem("Home", `${subDirectory}landing-page/home`, <BiHomeSmile />),
    getItem("SETTING", `${subDirectory}setting`, <FiSettings />),
    getItem("USER", `${subDirectory}landing-page/user-account`, <RiUser3Line />),
  ];

  const EmployeeContent = [
    getItem("Home", `${subDirectory}landing-page/home`, <BiHomeSmile />),
    // getItem("Apps", `${subDirectory}landing-page/apps`, <IoBagHandleOutline />),
    getItem("USER", `${subDirectory}landing-page/user-account`, <RiUser3Line />),
  ];

  const AdminContent = application.length > 0 ? [
    getItem("Home", `${subDirectory}landing-page/home`, <BiHomeSmile />),
    getItem("Apps", `${subDirectory}landing-page/apps`, <IoBagHandleOutline />),
    getItem("SETTING", `${subDirectory}setting`, <FiSettings />),
    getItem("USER", `${subDirectory}landing-page/user-account`, <RiUser3Line />),
  ]: [
    getItem("Apps", `${subDirectory}landing-page/apps`, <IoBagHandleOutline />),
    getItem("USER", `${subDirectory}landing-page/user-account`, <RiUser3Line />),
  ];

  return (
    <div className="appPage">
      <div className="sideNaveParent">
        <div className="paypreLogoDiv">
          <img src={payprelogo} alt="paypre logo" />
        </div>
        <SideMenu
          items={
            UserType != "Employee" && UserType != "Admin"
              ? SadminContent
              : UserType === "Employee"
              ? EmployeeContent
              : AdminContent
          }
          mode={"vertical"}
          theme={"light"}
        />
      </div>
      <div className="centerPage">
        <Outlet />
      </div>
    </div>
  );
};

export default LandignPageLayout;
