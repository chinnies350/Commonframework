
import React from "react";
import HomeNav from "../publichome/PublicNavBar/NavBar";
import "./HomePage.scss";
import LeftImg from "../../Images/girl3d.png";
import RightImg from "../../Images/rocket.png";
import { Col, Row } from "antd";
import PlayStore from "../../Images/playstore.svg";
import AppStore from "../../Images/appstore.svg";
import Bot from "../../Images/bot.svg";

import Inventory from "../../Images/inventory.png";
import Bill from "../../Images/bill.png";
import Calc from "../../Images/calc.png";
import Qr from "../../Images/qr.png";

import Bighand from "../../Images/bighand.png";
import Handemoji from "../../Images/handemoji.png";
import Secure from "../../Images/secure.png";
import Wifibill from "../../Images/bill wifi.png";
import Whatsapp from "../../Images/wp.png";
import AutoBackup from "../../Images/autobk.png";
import Noads from "../../Images/ads.png";
import MultiPay from "../../Images/multiple payt.png";
import Status from "../../Images/status.png";
import OnlineOrder from "../../Images/onlineorders.png";

import Retail from "../../Images/Icons/retail.svg";

import PhoneMoc from "../../Images/phone mockup.png";

import { ArrowRightOutlined } from "@ant-design/icons";

import ExtraNav from "../publichome/PublicNavBar/ExtraNav";
import "../../fonts/Gilroy/stylesheet.css";


import SupportImg from "../../Images/support.png";
import PhoneImg from "../../Images/phone.png";
import MailImg from "../../Images/mail.png";
import { BsArrowRight } from "react-icons/bs";
import VideoPlayer from "../videoplayer/VideoPlayer";
import { BsTwitter, BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import AOS from "aos";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCategoryData,
  getSubCategoryData,
  getApplicationData,
} from "../../features/publicHome/publicHome";
import { storeCookieData } from "../../Services/others";
const subDirectory = import.meta.env.BASE_URL;

// export class PublicHome extends Component {
const PublicHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [AppCategory, setAppCategory] = useState([]);


  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchConfigName();
    AOS.init({
      // initialise with other settings
      duration: 2000,
    });
  }, []);

  const getAppData = async (subcatId) => {
    const response = await dispatch(getApplicationData(subcatId)).unwrap();
    setIsActive(true);
    if (response.data.statusCode === 1) {
      let finalsubCategory = response.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setAppCategory(finalsubCategory);
    }
  };

  const getSubCategory = async (cateId) => {
    setAppCategory([])
    const response = await dispatch(getSubCategoryData(cateId)).unwrap();
    if (response.data.statusCode === 1) {
      let finalsubCategory = response.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setSubCategory(finalsubCategory);
    }navigate
  };

  const fetchConfigName = async () => {
    setSubCategory([])
    setAppCategory([])
    const response = await dispatch(getCategoryData()).unwrap();
    // const data = await response.data.data;
    // setFeatureCategory(data);
    if (response.data.statusCode === 1) {
      let finalCategory = response.data.data;
      setCategory(finalCategory);
    }
  };
  const getSignIn = async (AppId,AppName) => {
    storeCookieData('AppId', AppId)
    // navigate(`/public-signup`)
    navigate(`/${AppName?.toLowerCase()}`);
    window.location.reload()

  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="Public_Overall_Body">
      <ExtraNav />
      <HomeNav />
      {/* <HomeNav2/> */}


      <div className="Home_Style">
        <div data-aos="zoom-out-up">
          <div className="content_container">

            <div className="Public_home_Texts">

              <p className="firsttxt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-check2-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                </svg>{" "}
                &nbsp; 100% SIMPLE | SPEED | SMART | SECURE
              </p>
              <h4 className="secondtxt">
                {" "}
                We Elevate Your Business & <br />
              </h4>
              <span className="secondtxt2">
                {" "}
                Expand Your&nbsp;<h1 class="header"> Horizons </h1>{" "}
              </span>
              <p className="thirdtxt">
                {" "}
                Get started now with pay-as-you-go pricing. There’s no upfront
                commitment—cancel <br /> anytime.Or try PayPre free for up to 30
                days.{" "}
              </p>

              <div class="StartBtn_container ">
                <div>
                  <Link to={`${subDirectory}public-signin`} className="btn btn-primary">
                    <button className="startbtn">
                      <p> PayPre Free</p>
                      <BsArrowRight />{" "}
                    </button>{" "}
                  </Link>
                </div>
              </div>

              <div class="appContainer">
                <div data-aos="zoom-out-up">
                  <Row>
                    <Col>
                      <div className="playstorebtn" type="button">
                        {" "}
                        <img src={PlayStore} alt="BusinessImg" /> Download App
                        from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                    <Col>
                      <div className="playstorebtn" type="button">
                        {" "}
                        <img src={AppStore} alt="BusinessImg" /> Download App from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                    <Col>
                      <div className="playstorebtn" type="button">
                        {" "}
                        <img src={PlayStore} alt="BusinessImg" /> Download App
                        from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              <p className="app_head"> Get Paypre app from </p>

            </div>
            <div>
              {" "}
              <img className="rightImg" src={RightImg} alt="BusinessImg" />
            </div>
            <div>
              {" "}
              <img className="leftImg" src={LeftImg} alt="BusinessImg" />
            </div>
          </div>
        </div>

        <div className="chatBOT">  <img src={Bot} alt="BotImg" />  </div>

        <div data-aos="fade-up" data-aos-anchor-placement="center-bottom">
          <div className="Spec_container">
            <h4 className="forthtxt"> Track your overall business data </h4>
            <p className="fifthtxt">
              {" "}
              Inventory Management, Billing / GST Invoices ,e- Way Bills,
              Accounts Management and <br /> more in single dashboard
            </p>

            <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
              <div class="cards-list">
                <div class="card 1">
                  <div class="card_image">
                    {" "}
                    <img src={Inventory} alt="BusinessImg" />{" "}
                  </div>
                  <div class="card_title title-black">
                    <p>Inventory Management</p>
                    <p className="card_description">
                      {" "}
                      Manage your stock high accuracy with our Inventory
                      management{" "}
                    </p>
                    <a className="card_link"> Read More </a>
                  </div>
                </div>

                <div class="card 2">
                  <div class="card_image">
                    <img src={Bill} alt="BusinessImg" />
                  </div>
                  <div class="card_title title-white">
                    <p>Billing / GST </p>
                    <p className="card_description">
                      {" "}
                      Manage your stock high accuracy with our Inventory
                      management{" "}
                    </p>
                    <a className="card_link"> Read More </a>
                  </div>
                </div>

                <div class="card 3">
                  <div class="card_image">
                    <img src={Qr} alt="BusinessImg" />
                  </div>
                  <div class="card_title">
                    <p>e- Way Bills</p>
                    <p className="card_description">
                      {" "}
                      Manage your stock high accuracy with our Inventory
                      management{" "}
                    </p>
                    <a className="card_link"> Read More </a>
                  </div>
                </div>

                <div class="card 4">
                  <div class="card_image">
                    <img src={Calc} alt="BusinessImg" />
                  </div>
                  <div class="card_title title-white">
                    <p>Accounts Management</p>
                    <p className="card_description">
                      {" "}
                      Manage your stock high accuracy with our Inventory
                      management{" "}
                    </p>
                    <a className="card_link"> Read More </a>
                  </div>
                </div>
              </div>
            </div>

            <p className="showmore_link" style={{ marginTop: "12rem" }}>
              {" "}
              See More Features &nbsp; <ArrowRightOutlined />{" "}
            </p>
          </div>
        </div>

        <div data-aos="fade-right">
          <div className="floatHand">
            {" "}
            <img
              className="floatHandImg"
              src={Bighand}
              alt="BusinessImg"
            />{" "}
          </div>
        </div>

        <div className="Benifits_container">
          <h4 className="forthtxt"> Benefits of using paypre </h4>
          <p className="fifthtxt">
            {" "}
            Inventory Management, Billing / GST Invoices ,e- Way Bills, Accounts
            Management and <br /> more in single dashboard
          </p>

          <div data-aos="fade-up" data-aos-duration="3000">
            <ul class="smol-flexbox-grid">
              <li className="benifits_box">
                <p className="Benifits">
                  {" "}
                  <img src={Handemoji} alt="BusinessImg" />
                  We promise don't sell <br /> & owning your data &nbsp;{" "}
                  <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li>
                <p className="Benifits">
                  {" "}
                  <img src={Secure} alt="BusinessImg" />
                  We protect your data &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li>
                <p className="Benifits">
                  {" "}
                  <img src={Wifibill} alt="BusinessImg" />
                  Online / Offline BIlling &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>
            </ul>

            <ul class="smol-flexbox-grid">
              <li className="benifits_box">
                <p className="Benifits">
                  {" "}
                  <img src={AutoBackup} alt="BusinessImg" />
                  Auto Data Backup &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li>
                <p className="Benifits">
                  {" "}
                  <img src={Noads} alt="BusinessImg" />
                  Never runs ads here &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li>
                <p className="Benifits">
                  {" "}
                  <img src={MultiPay} alt="BusinessImg" />
                  Provide multiple <br />
                  payment options &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>
            </ul>

            <ul class="smol-flexbox-grid">
              <li>
                <p className="Benifits">
                  {" "}
                  <img src={OnlineOrder} alt="BusinessImg" />
                  Get Orders Online &nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li>
                <p className="Benifits">
                  {" "}
                  <img src={Whatsapp} alt="BusinessImg" />
                  Whatsapp Support&nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>

              <li className="benifits_box">
                <p className="Benifits">
                  {" "}
                  <img src={Status} alt="BusinessImg" />
                  Track your business status&nbsp; <ArrowRightOutlined />{" "}
                </p>
              </li>
            </ul>
          </div>

          <p className="showmore_link">
            {" "}
            See More Features &nbsp; <ArrowRightOutlined />{" "}
          </p>
        </div>

        <div className="Apps_container" id='Products'>
          <h4 className="forthtxt"> All Paypre Apps </h4>
          <p className="fifthtxt">
            {" "}
            Paypre’s Overall applications here Inventory Management, Billing /
            GST Invoices <br /> e- Way Bills, Accounts Management and more in
            single dashboard
          </p>

          {Category.length > 0 ? (
            <div data-aos="fade-up">
              <div class="tab_container">
                <div class="tabapps">
                  {Category.map((a) => (
                    <div
                      className="tab_cont"
                      onClick={() => getSubCategory(a?.CateId)}
                    >
                      <img
                        src={a.CategoryImage != "" && a.CategoryImage !=null ? a?.CategoryImage:"http://saveme.live/paypre-image-api/upload?fileId=64b536df06bfb6b6b9922bbc.webp"}
                        // alt="AppImg"
                        style={{ maxWidth: "100px" }}
                      />
                      <p> {a?.CategoryName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div data-aos="fade-up">
            {SubCategory.length > 0 ? (
              <div class="tabapps">
                {SubCategory?.map((a) => (
                  <button
                    // className="sub_tab_cont"
                    className="sub_tab_cont"
                    onClick={() => getAppData(a?.SubCateId)}
                  >
                    <p>   {a?.SubCategoryName} </p>
                  </button>
                ))}
              </div>
            ) : null}
            {AppCategory.length > 0 ? (
              <div class="tabapps">
                {AppCategory?.map(a =>
                  <div className="tab_cont" onClick={() => getSignIn(a?.AppId,a?.AppName)}>
                    <p className="tab_conetent">
                      {" "}
                      <img src={a ? a.AppLogo : Retail} alt="AppImg" style={{ maxWidth: "100px" }} /> {a.AppName}{" "}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div id="Video">
          <div data-aos="zoom-out">
            {" "}
            <VideoPlayer/>{" "}
          </div>
        </div>

        <div className="Subs_container">
          <div className="Subs_Sub_container">
            <p className="Subs_Sub_Left_cont">
              Ready to enter the PayPre - let's set up your PayPre free account.
            </p>
          </div>

          <div className="Subs_Sub_Right_cont">
            <div data-aos="zoom-out">
              <Link
                to={`${subDirectory}public-signin`}
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                <button className="try_btn">
                  <p>Try PayPre for Free</p>{" "}
                </button>
              </Link>
            </div>
            <a style={{ fontSize: "14px", margin: "0.5vw 0vh" }}>
              {" "}
              No credit card required{" "}
            </a>
          </div>
        </div>

        <div className="Video_container">
          <div className="Video_Sub_container">
            <p className="Video_Sub_Left_cont">
              {" "}
              Download our <br />{" "}
              <a style={{ fontSize: "26px" }}> PayPre Mobile App </a>
              <div data-aos="zoom-out-up">
                <div class="appContainer2">
                  <Row>
                    <Col>
                      <div className="playstorebtns" type="button">
                        {" "}
                        <img src={PlayStore} alt="BusinessImg" /> Download App
                        from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                    <Col>
                      <div className="playstorebtns" type="button">
                        {" "}
                        <img src={AppStore} alt="BusinessImg" /> Download App
                        from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                    <Col>
                      <div className="playstorebtns" type="button">
                        {" "}
                        <img src={PlayStore} alt="BusinessImg" /> Download App
                        from
                        <br /> Playstore{" "}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </p>
          </div>

          <div id='Support'>
            <div data-aos="zoom-out-left">
              <img src={PhoneMoc} className="img_moc_cont" alt="BusinessImg" />
            </div>
          </div>
        </div>

        <div data-aos="zoom-out">
          <div className="Support_container">
            <div>
              <img
                src={SupportImg}
                className="img_moc_cont"
                alt="BusinessImg"
              />
            </div>

            <div className="Support_Sub_container">
              <img src={PhoneImg} className="phone-btn" />{" "}
              <p className="Support_Sub_Left_cont">
                {" "}
                Toll-free 1921681254 <br />{" "}
                <a style={{ fontSize: "14px" }}> For App queries </a>
              </p>
              <img src={MailImg} className="phone-btn" />{" "}
              <p className="Support_Sub_Left_cont">
                {" "}
                info@paypre.in <br />{" "}
                <a style={{ fontSize: "14px" }}> For App queries </a>
              </p>
            </div>
          </div>
        </div>
        <footer className="footer_container">
          <div>
            <p>Explore</p>
            <ul class="footer-links">
              <li>
                <a onClick={()=>scrollToSection('Video')}>What is PayPre ?</a>
              </li>
              <li>
                <a href="#">Want Access</a>
              </li>
            </ul>
          </div>

          <div>
            <p>Products</p>
            <ul class="footer-links">
              <li>
                <a onClick={()=>scrollToSection('Products')}>Products</a>
              </li>
              <li>
                <a onClick={()=>scrollToSection('Products')}>Free PayPre Apps</a>
              </li>
            </ul>
          </div>

          <div>
            <p>Pricing & Support</p>
            <ul class="footer-links">
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a onClick={()=>scrollToSection('Support')}>Support</a>
              </li>
            </ul>
          </div>

          <div>
            <p>Resources for PayPre</p>
            <ul class="footer-links">
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">Updates</a>
              </li>
              <li>
                <a href="#">Videos</a>
              </li>
            </ul>
          </div>

          <div>
            <p>Join the conversation</p>
            <ul class="social-icons">
              <li>
                <a class="facebook" href="#">
                  {" "}
                  <BsFacebook />{" "}
                </a>
              </li>
              <li>
                <a class="twitter" href="#">
                  {" "}
                  <BsTwitter />{" "}
                </a>
              </li>
              <li>
                <a class="dribbble" href="#">
                  <BsInstagram />
                </a>
              </li>
              <li>
                <a class="linkedin" href="#">
                  <BsYoutube />
                </a>
              </li>
            </ul>
          </div>

          <div class="ft_sub_container">
            <div className="privacycol">
              {" "}
              <a>
                Privacy & Cookies &nbsp; | <a> Data Protection Notice</a> &nbsp;
                | <a>Terms of use</a> &nbsp; | <a>Privacy Data Management</a>{" "}
              </a>{" "}
            </div>
            <div className="copyright-text">
              {" "}
              <a>
                Contact us &nbsp; <a> Feedback</a> &nbsp; <a>Sitemap</a> &nbsp;{" "}
                <a>© Prematix 2023</a>{" "}
              </a>{" "}
            </div>
          </div>
        </footer>

        <div class="area">
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
  // }
};

export default PublicHome;
