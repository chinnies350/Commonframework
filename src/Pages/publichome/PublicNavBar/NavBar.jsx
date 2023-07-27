import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {MenuOutlined} from "@ant-design/icons";

import Collapse from "./Collapse";
import { Popover } from "antd";
import NavBarCom from "../../NavBarComps/NavBarCom";
import {getCategoryData} from "../../../features/publicHome/publicHome";
import { useNavigate } from "react-router-dom";

import AppLogo from "../../../Images/payprelogo1.svg";
import { useDispatch } from "react-redux";
const subDirectory = import.meta.env.BASE_URL;



const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false); // State for toggle
  const [isSmallScreen, setIsSmallScreen] = useState(false); // State for small screen detection
  const [Category, setCategory] = useState([]);


  useEffect(() => {
    fetchConfigName();
  }, []);



 

  const fetchConfigName = async () => {
    const response = await dispatch(getCategoryData()).unwrap();
    // const data = await response.data.data;
    // setFeatureCategory(data);
    if (response.data.statusCode === 1) {
      let finalCategory = response.data.data;
      setCategory(finalCategory);
    }
  };

  const handleToggle = () => {
    setCollapsed(!collapsed); // Toggle the collapsed state
  };

  const handleClick = (e) => {
    // Dispatch an action to update the current selected menu item
  };

  const openSignInModal = () => {
    // setOpen(true);
    navigate(`${subDirectory}public-signin/`);
  };

  const openSignupModal = () => {
    // setOpen(true);
    navigate(`${subDirectory}public-signin/`);
  };



  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 900); // Adjust the breakpoint as per your requirement
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);
  console.log(Category,"CategoryCategoryCategory")

  return (
    <>
      <div className="Home-navbar ">
        <img
          src={AppLogo}
          alt="Logo"
          style={{ width: "4.5vw", height: "auto" }}
        />

        <div className="menu-container  ">
          {!isSmallScreen && (
            <Menu onClick={handleClick} selectedKeys={[]} mode="horizontal">
              {Category?.map((a,b)=>
              <Menu.Item key={a?.CateId}>
                <Popover content={<NavBarCom CateId={a?.CateId}/>} trigger="hover">
                  <div className="ant-menu-title-content nav-btn">{a?.CategoryName}</div>
                </Popover>
              </Menu.Item>
              )}
              
            </Menu>
          )}
        </div>

        <div className="menu-container">
          {!isSmallScreen && (
            <Menu onClick={handleClick} selectedKeys={[]} mode="horizontal">
              <Menu.Item key="Contact Sales">
                <div className="ant-menu-title-content nav-btn">
                  {" "}
                  Contact Sales{" "}
                </div>{" "}
              </Menu.Item>
              <Menu.Item key="Sign In">
                {/* <div> Sign In  </div> */}

                <div
                  className=" ant-menu-title-content nav-btn"
                  onClick={openSignInModal}
                >
                  {" "}
                  Sign in
                  {/* <DefaultModal
                  open={open}
                  title="Sign In"
                  footer={true} 
                  children={  <Loginform/> } 
                  handleCancel={handleCancel}
                  // handleSubmit={handleSubmit} 
                /> */}
                </div>
              </Menu.Item>
              <Menu.Item key="Entertainment">
                <div
                  className=" FreeAccBtn "
                  type="primary"
                  onClick={openSignupModal}
                >
                  Free Account
                </div>
              </Menu.Item>
              <div></div>
            </Menu>
          )}
        </div>
      </div>

      <div className="small_nav">
        {isSmallScreen && (
          <div className="toggle-container">
            <img
              src="fav.ico"
              alt="Logo"
              style={{ width: "7vh", height: "auto" }}
            />

            <div className="extra_small_nav">
              <div className="extra_small_div">
                {/* <img src={Retail}  alt="Retail" 
                style={{ width: '4vh', height: 'auto',  }} 
                  /> */}
                &nbsp; Retail
              </div>
              <div className="extra_small_div">
                {/* <img src={Restaunrant}  alt="Logo" 
                style={{ width: '4vh', height: 'auto',  }} 
                  /> */}
                &nbsp; Restaurant
              </div>
              <div className="extra_small_div">
                {/* <img src={Distribution}  alt="Logo" 
                style={{ width: '4vh', height: 'auto',  }} 
                  /> */}
                &nbsp; Distribution
              </div>
              <div className="extra_small_div">
                {/* <img src={Entertainment}  alt="Logo" 
                style={{ width: '4vh', height: 'auto',  }} 
                  /> */}
                &nbsp; Entertainment
              </div>
            </div>

            {/* <div className="sml_icons">
<div> fyidg </div>
<div> fyidg </div>
</div> */}

            <div className="toggle-button" onClick={handleToggle}>
              <MenuOutlined />
            </div>
          </div>
        )}

        {isSmallScreen && collapsed && (
          <div className="collapsed-menu">
            <Menu onClick={handleClick} selectedKeys={[]} mode="vertical">
              {/* <Menu.Item key="home" icon={<DownOutlined />}>
              Home 
            </Menu.Item>
            <Menu.Item key="about" icon={<DownOutlined />}>
              About
            </Menu.Item>
            <Menu.Item key="contact" icon={<DownOutlined />}>
              Contact
            </Menu.Item> 
            <Menu.Item key="Distribution" >Contact Sales</Menu.Item>
            <Menu.Item key="Entertainment" >Free Account</Menu.Item>   */}
              <Collapse />
            </Menu>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
