import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useRef } from "react";
import "../PublicSignup/Signup.scss";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { RiSmartphoneLine } from "react-icons/ri";
import { Input, Tooltip } from "antd";
import { IoIosTimer } from "react-icons/io";
import { Collapse } from "antd";
import { InputField } from "../../Components/Forms/InputField";
import Buttons from "../../Components/Forms/Buttons";
import "../publicsignin/Signin.scss";
import logo from "../../Images/payprelogo1.svg";
import GlobeGif from "../../Images/globe-GIF-source.gif";
import Signupimg from "../../Images/userreg.jpg";
import { useNavigate } from "react-router-dom";
import { Messages } from "../../Components/Notifications/Messages";
import { useDispatch } from "react-redux";
import {
  sendOtpMobileNo,
  setUser,
} from "../../features/signInPage/signInPage";
import { getCookieData,storeCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL


const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);


  const [SendOtp, setSendOtp] = useState(false);
  const [OTP, setOTP] = useState("");
  const [otp1, setotp1] = useState("");
  const [otp2, setotp2] = useState("");
  const [otp3, setotp3] = useState("");
  const [otp4, setotp4] = useState("");
  const [otp5, setotp5] = useState("");
  const [otp6, setotp6] = useState("");
  const [PIN, setPIN] = useState(false);
  const [MobileNo, setMobileNo] = useState(false);
  const [disable, setDisable] = useState(false);
  const [Password, setPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [notification, setnotification] = useState(false);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [UserId, setUserId] = useState(null);
  const [Status, setStatus] = useState(false);
  const [Box, setBox] = useState(false);
  const [Mobiles, setMobile] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) {
      setDisable(false);

      setTimeLeft(null);
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    let otp = otp1 + "" + otp2 + "" + otp3 + "" + otp4 + "" + otp5 + "" + otp6;
    if (otp.length === 6) {
      if (parseInt(otp) === OTP) {
        handleSuccessUser(Mobiles);
      } else {
        setnotification(false);
        setMessageType("warning");
        setMessageData("please enter valid OTP");
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 3000);
      }
    }
  }, [otp1, otp2, otp3, otp4, otp5, otp6]);

  const handleSuccessUser = async (Mobiles) => {
    let MobileNo = Mobiles;
    const res = await dispatch(setUser({ MobileNo })).unwrap();

    if (res.data.statusCode === 1) {
      let UserId = res.data.UserId;
      storeCookieData("UserId", UserId)
      storeCookieData("UserType", 'Admin')
      // navigate("/landing-page/home");
      if(getCookieData('AppId')){
        navigate(`${subDirectory}invoice-detail`);
      }
      else{
        navigate(`${subDirectory}landing-page/apps`);
      }
      
    } else {
      setnotification(false);
      setMessageType("warning");
      setMessageData(res.data.response);
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 3000);
    }
  };

  const Sendotp = async (values) => {
    setotp1("");
    setotp2("");
    setotp3("");
    setotp4("");
    setotp5("");
    setotp6("");
    setTimeLeft(15);
    setDisable(true);
    setStatus(true);
    let MobileNo = values.MobileNo;
    setMobile(values.MobileNo);
    const res = await dispatch(sendOtpMobileNo({ MobileNo })).unwrap();

    if (res.data.statusCode === 1) {
      setBox(true);
      setnotification(false);
      setMessageType("success");
      setMessageData("OTP Sended Successfully");
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 3000);
      setSendOtp(true);
      setOTP(res.data.OTP);
      // setUserId(res.data.UserId)
    } else {
      setnotification(false);
      setDisable(false);
      setMessageType("warning");
      setMessageData("OTP Not Sended");
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 3000);
    }
  };
  const handleChange = async (value1, e) => {
    switch (value1) {
      case "setotp1":
        await setotp1(e.target.value);
        break;
      case "setotp2":
        setotp2(e.target.value);
        break;
      case "setotp3":
        setotp3(e.target.value);
        break;
      case "setotp4":
        setotp4(e.target.value);
        break;
      case "setotp5":
        setotp5(e.target.value);
        break;
      case "setotp6":
        await setotp6(e.target.value);
    }
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const { Panel } = Collapse;
  const MobileNo1 = async (e) => {
    
    setSendOtp(false);
    setBox(false);

    setOTP("");
    setotp1("");
    setotp2("");
    setotp3("");
    setotp4("");
    setPIN(false);
    setMobileNo(false);
    setDisable(false);
    setPassword(false);
    if (e.target.value.length === 10) {
      await getUserDataBasedOnMobile(e.target.value);
      await setSendOtp(true);
    }
  };
  const getUserDataBasedOnMobile = async () => {
    setMobileNo(true);
  };

  return (
    <>
      <div className="Signup_container">
        {notification ? (
          <Messages messageType={messageType} messageData={messageData} />
        ) : null}
        <div className="Signup_Card">
          <Row>
            <Col flex="1 1 100px">
              <div className="Signup_headtexts">
                <a onClick={() => navigate(`${subDirectory}`)}>
                  {" "}
                  <ArrowLeftOutlined /> &nbsp; Back to Home
                </a>
                <h5 className="Signuptxt1">Welcome to Our PayPre</h5>
                <p className="Signuptxt2">
                  Explore Free products{" "}
                  <a
                    style={{
                      fontWeight: "400",
                      fontSize: "14px",
                      color: "gray",
                    }}
                  >
                    with a new PayPre account...{" "}
                  </a>
                </p>

                <img src={GlobeGif} className="Globegif2" />
              </div>

              <div className="Signupimgdiv">
                {" "}
                <img src={Signupimg} className="Signupimg" />{" "}
              </div>
            </Col>

            <Col flex="1 1 200px">
              <div className="Signupbg">
                <Form ref={formRef} onFinish={Sendotp}>
                  <img src={logo} style={{ width: "7vh" }} />
                  <h5 className="Signuptxt1">Get Started for Free</h5>

                  <div className="inputfieldstyle">
                    <Form.Item
                      name="MobileNo"
                      
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField
                        // placeholder=" Enter Mobile Number"
                        fieldState={true}
                        fieldApi={true}
                        autocomplete="off"
                        type="numeric"
                        onChange={MobileNo1}
                        label="Mobile Number"
                        id="MobileNo"
                        field="MobileNo"
                        maxlength="10"
                        suffix={
                          <RiSmartphoneLine className="site-form-item-icon " />
                        }
                      />
                    </Form.Item>

                    {SendOtp === true && Box === true ? (
                      <Form>
                        <div className="otpContainer">
                          <h className="timersec">
                            {" "}
                            <IoIosTimer /> {timeLeft}{" "}
                          </h>

                          <input
                            name="otp1"
                            type="text"
                            autoComplete="off"
                            className="otpInput"
                            value={otp1}
                            onChange={(e) => handleChange("setotp1", e)}
                            tabIndex="1"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                          <input
                            name="otp2"
                            type="text"
                            autoComplete="none"
                            className="otpInput"
                            value={otp2}
                            onChange={(e) => handleChange("setotp2", e)}
                            tabIndex="2"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                          <input
                            name="otp3"
                            type="text"
                            autoComplete="none"
                            className="otpInput"
                            value={otp3}
                            onChange={(e) => handleChange("setotp3", e)}
                            tabIndex="3"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                          <input
                            name="otp4"
                            type="text"
                            autoComplete="none"
                            className="otpInput"
                            value={otp4}
                            onChange={(e) => handleChange("setotp4", e)}
                            tabIndex="4"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                          <input
                            name="otp5"
                            type="text"
                            autoComplete="none"
                            // autoComplete="nope"
                            className="otpInput"
                            value={otp5}
                            onChange={(e) => handleChange("setotp5", e)}
                            tabIndex="5"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                          <input
                            name="otp6"
                            type="text"
                            autoComplete="none"
                            className="otpInput"
                            value={otp6}
                            onChange={(e) => handleChange("setotp6", e)}
                            tabIndex="6"
                            maxLength="1"
                            onKeyUp={(e) => inputfocus(e)}
                          />
                        </div>
                      </Form>
                    ) : null}

                    {MobileNo != false ? (
                      <div>
                        <Buttons
                          type="submit"
                          buttonText={Status ? "Resend OTP" : "Send OTP"}
                          // "Send OTP"
                          disabled={disable}
                          // handleSubmit={() => Sendotp()}
                          icon={<ArrowRightOutlined />}
                        ></Buttons>
                      </div>
                    ) : null}
                  </div>
                </Form>
              </div>
            </Col>

            <div className="footertag">
              {" "}
              <a href="#!" className="small text-muted ftrtxt ">
                @2023, Paypre Pvt. Ltd. All Rights Reserved.
              </a>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Signup;
