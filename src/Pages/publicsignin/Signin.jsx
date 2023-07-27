import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Col, Row } from "antd";
import "../publicsignin/Signin.scss";
import { ArrowRightOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { RiLockPasswordLine, RiSmartphoneLine } from "react-icons/ri";
import { IoIosTimer } from "react-icons/io";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup";
import { Collapse } from "antd";
import { InputField } from "../../Components/Forms/InputField";
import Buttons from "../../Components/Forms/Buttons";
import "../publicsignin/Signin.scss";
import logo from "../../Images/payprelogo1.svg";
import GlobeGif from "../../Images/globe-GIF-source.gif";
import ImgCarousel from "../../Pages/ImgCarousel/ImgCarousel";
import {
  getUserData,
  verifyUserLoginPin,
  verifyUserLoginPassword,
  sendOtp,
  getuserAppMap,
  sendOtpMobileNo,
  setUser,
  getAppAccess,
} from "../../features/signInPage/signInPage";
import { useDispatch } from "react-redux";
import { Messages } from "../../Components/Notifications/Messages";
import { useNavigate } from "react-router-dom";
import { storeCookieData, getCookieData } from "../../Services/others";
const subDirectory = import.meta.env.BASE_URL;

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [notification, setnotification] = useState(false);
  const [passwordType, setPasswordType] = useState("NULL");
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
  const [UserData, setUserData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [Box, setBox] = useState(false);
  const [Status, setStatus] = useState(false);
  const [UserType, setUserType] = useState("O");
  const [MobileNumber, setMobileNumber] = useState(null);

  let content = [
    PIN ? { value: "PIN", label: "PIN" } : null,
    Password ? { value: "Password", label: "Password" } : null,
    { value: "OTP", label: "OTP" },
  ];

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
        if (UserType === "N") {
          handleSuccessUser(MobileNumber);
        } else {
          storeCookieData(
            "userName",
            UserData[0]?.UserName ? UserData[0]?.UserName : null
          );
          storeCookieData("BranchName", UserData[0]?.BrName);
          storeCookieData("BranchId", UserData[0]?.BranchId);
          storeCookieData("UserId", UserData[0]?.UserId);
          storeCookieData("UserType", UserData[0]?.UserTypeName);
          storeCookieData("CompId", UserData[0]?.CompId);
          storeCookieData("CompName", UserData[0]?.CompName);

          if (
            UserData[0].UserTypeName === "Super Admin" ||
            UserData[0].UserTypeName === "Super Admin User"
          ) {
            // alert("hi")
            // if (UserData[0].RoleName === "Sadmin") {

            navigate(`${subDirectory}landing-page/home`);
            // } else if (UserData[0].RoleName === "Admin") {
            //   navigate("/landing-page/home");
            // }
          } else if (UserData[0].UserTypeName === "Admin") {
            let UserId = UserData[0].UserId;
            const res = getUserMapData(UserId);
          } else if (UserData[0].UserTypeName === "Employee") {
            console.log(UserData, "UserDataUserData");
            navigate(`${subDirectory}landing-page/home`);
          }
        }
      } else {
        setnotification(false);
        setMessageType("warning");
        setMessageData("please enter valid OTP");
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 5000);
      }
    }
  }, [otp1, otp2, otp3, otp4, otp5, otp6]);

  const getUserMapData = async (UserId) => {
    const res = await dispatch(getuserAppMap({ UserId })).unwrap();
    setMessageType("success");
        setMessageData("Login Successfully");
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 5000);
    if (res.data.statusCode === 1) {
      navigate(`${subDirectory}landing-page/home`);
    } else {
      navigate(`${subDirectory}landing-page/apps`);
    }
  };

  const getUserMapDataForEmp = async (UserId) => {
    const res = await dispatch(getAppAccess({ UserId })).unwrap();
    if (res.data.statusCode === 1) {
      setMessageType("success");
        setMessageData("Login Successfully");
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 5000);
      if (res.data.data.length === 1) {
        console.log((res.data.data[0]?.AppName).toLowerCase(), "datadata2");
        let nameOfRedirect = (res.data.data[0]?.AppName).toLowerCase();
        storeCookieData("BranchId", res.data.data[0]?.BranchId);
        storeCookieData("CompId", res.data.data[0]?.CompId);
        storeCookieData("AppId", res.data.data[0]?.AppId);
        navigate(`/${nameOfRedirect}`);
        window.location.reload();
      } else {
        navigate(`${subDirectory}landing-page/home`);
      }
    } else {
      setnotification(false);
      setMessageType("warning");
      setMessageData("Contact Admin For Access");
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
        navigate(`${subDirectory}public-signin/`);
        window.location.reload();
      }, 4000);

      // navigate(`${subDirectory}landing-page/home`);
    }
  };

  const Sendotp = async (values) => {
    setotp1("");
    setotp2("");
    setotp3("");
    setotp4("");
    setotp5("");
    setotp6("");
    setTimeLeft(30);
    setDisable(true);
    setStatus(true);
    let MobileNo = values.MobileNo;
    if (UserType === "N") {
      var res = await dispatch(sendOtpMobileNo({ MobileNo })).unwrap();
    } else {
      var res = await dispatch(sendOtp({ MobileNo })).unwrap();
    }

    if (res.data.statusCode === 1) {
      setMessageType("success");
      setMessageData("OTP Sended Successfully");
      setnotification(true);
      setBox(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 5000);

      setnotification(false);
      setSendOtp(true);
      setOTP(res.data.OTP);
    } else {
      setnotification(false);
      setMessageType("warning");
      setMessageData("OTP Not sent");
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 5000);
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
  const onSubmit = async (values) => {
    if (SendOtp) {
      Sendotp(values);
    } else {
      let MobileNo = values.MobileNo;
      let Password = values.password;
      if (passwordType === "PIN") {
        let Pin = Password;
        var res = await dispatch(
          verifyUserLoginPin({ MobileNo, Pin })
        ).unwrap();
      } else {
        var res = await dispatch(
          verifyUserLoginPassword({ MobileNo, Password })
        ).unwrap();
      }

      if (res.data.statusCode === 1) {
        
        let UserData = res.data.data;
        storeCookieData(
          "userName",
          UserData[0]?.UserName ? UserData[0]?.UserName : null
        );
        storeCookieData("BranchName", UserData[0]?.BrName);
        storeCookieData("BranchId", UserData[0]?.BranchId);
        storeCookieData("UserId", UserData[0]?.UserId);
        storeCookieData("UserType", UserData[0]?.UserTypeName);
        storeCookieData("CompId", UserData[0]?.CompId);
        storeCookieData("CompName", UserData[0]?.CompName);

        if (
          UserData[0].UserTypeName === "Super Admin" ||
          UserData[0].UserTypeName === "Super Admin User"
        ) {
          // if (UserData[0].RoleName === "Sadmin") {
            setMessageType("success");
            setMessageData("Login Successfully");
            setnotification(true);
            setTimeout(() => {
              setnotification(false);
              setMessageType(null);
              setMessageData(null);
            }, 5000);
          navigate(`${subDirectory}landing-page/home`);
          // } else if (UserData[0].RoleName === "Admin") {
          //   navigate("/landing-page/home");
          // }
        } else if (UserData[0].UserTypeName === "Admin") {
        
          getUserMapData(UserData[0].UserId);
        } else if (UserData[0].UserTypeName === "Employee") {
          console.log(UserData, "UserDataUserData", UserData.length);
          getUserMapDataForEmp(UserData[0].UserId);
        }
      } else {
        setnotification(false);
        setMessageType("warning");
        setMessageData("Enter Valid" + " " + passwordType);
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 5000);
      }
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
    setStatus(false);
    setPasswordType("NULL");
    setSendOtp(false);
    setBox(false);
    formRef.current?.setFieldsValue({ password: "" });

    setOTP("");
    setotp1("");
    setotp2("");
    setotp3("");
    setotp4("");
    setotp5("");
    setotp6("");
    setPIN(false);
    setMobileNo(false);
    setDisable(false);
    setPassword(false);
    // console.log("getting number",e.target.value)
    var z1 = /^[0-9]*$/;
    if (z1.test(e.target.value)) {
      if (e.target.value.length === 10) {
        setMobileNumber(e.target.value);
        await getUserDataBasedOnMobile(e.target.value);
        // await setSendOtp(false);
      } else {
        setMobileNo(false);
      }
    }
  };
  const handleSuccessUser = async (Mobiles) => {
    let MobileNo = Mobiles;
    const res = await dispatch(setUser({ MobileNo })).unwrap();

    if (res.data.statusCode != 0) {
      let UserId = res.data.UserId;
      storeCookieData("UserId", UserId);
      storeCookieData("UserType", "Admin");
      // navigate("/landing-page/home");
      if (getCookieData("AppId")) {
        navigate(`${subDirectory}invoice-detail`);
      } else {
        navigate(`${subDirectory}landing-page/apps`);
      }
    } else {
      setnotification(false);
      setMessageType("error");
      setMessageData(res.data.response);
      setnotification(true);
      setTimeout(() => {
        setnotification(false);
        setMessageType(null);
        setMessageData(null);
      }, 4000);
    }
  };
  const getUserDataBasedOnMobile = async (MobileNo) => {
    setPasswordType("NULL");
    setPIN(false);
    setPassword(true);
    const res = await dispatch(getUserData({ MobileNo })).unwrap();

    if (res.data.statusCode === 1) {
      if (res.data.data[0].ActiveStatus === "A") {
        const passType =
          res.data.data[0].Pin === "Y"
            ? "PIN"
            : res.data.data[0].Password === "Y"
            ? "Password"
            : "NULL";
        setPasswordType(passType);
        setMobileNo(true);
        const password = res.data.data[0].Password === "Y" ? true : false;
        const pin = res.data.data[0].Pin === "Y" ? true : false;
        setPassword(password);
        setPIN(pin);
        setUserData(res.data.data);
        if (passType === "NULL") {
          setSendOtp(true);
        } else {
          setSendOtp(false);
        }
      }
      else {
        setnotification(false);
        setMessageType("error");
        setMessageData("Access Denied Contact Your Administrator");
        setnotification(true);
        setTimeout(() => {
          setnotification(false);
          setMessageType(null);
          setMessageData(null);
        }, 5000);
      }
    } else {
      setPasswordType("NULL");
      setMobileNo(true);
      setUserType("N");
      // send otp set new
      // setnotification(false);
      // setMessageType("warning");
      // setMessageData("No User Found");
      // setnotification(true);
      // setTimeout(() => {
      //   setnotification(false);
      //   setMessageType(null);
      //   setMessageData(null);
      // }, 2000);
      setSendOtp(true);
    }
  };
  const onChange = (e) => {
    setPasswordType(e);
    if (e === "OTP") {
      setSendOtp(true);
    } else {
      setSendOtp(false);
    }
  };

  return (
    <>
      <div className="Sing_bg signinbody">
        <div className="Signin_cont">
          {notification ? (
            <Messages messageType={messageType} messageData={messageData} />
          ) : null}

          <div className="Card">
            <Row>
              <Col span={12}>
                <div className=" loginbg">
                  <img
                    src={logo}
                    onClick={() => navigate(`${subDirectory}`)}
                    style={{ width: "7vh" }}
                  />

                  <img src={GlobeGif} className="Globegif" />

                  <h5 className="logintxt1">Get Started for Free</h5>

                  <p className="logintxt2">
                    Explore Free products with a new PayPre account...
                  </p>

                  {/* <a
                  className="logintxt3"
                  onClick={() => navigate(`${subDirectory}public-signup`)}
                >
                  New to PayPre ? Create an account
                </a> */}

                  <Form ref={formRef} onFinish={onSubmit}>
                    <div className="inputfieldstyle">
                      {/* <Form.Item> */}
                      <Form.Item
                        name="MobileNo"
                        rules={[
                          {
                            required: true,
                            pattern: /^[0-9]{10}$/,
                            message: "Please Enter Mobile Number",
                            // type: 'number',
                          },
                        ]}
                      >
                        <InputField
                          // placeholder=" Enter Mobile Number"
                          fieldState={true}
                          fieldApi={true}
                          autocomplete="off"
                          // type="numeric"
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

                      {passwordType != "NULL" && passwordType != "OTP" ? (
                        <div>
                          <Form.Item
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter" + " " + passwordType,
                              },
                            ]}
                          >
                            <InputField
                              className="inputfieldstyle2"
                              // placeholder={"ENTER " + passwordType}
                              name="password"
                              fieldState={true}
                              fieldApi={true}
                              type="password"
                              label={"ENTER " + passwordType}
                              field="Password"
                              id="password"
                              suffix={
                                <RiLockPasswordLine className="site-form-item-icon " />
                              }
                            />
                          </Form.Item>
                        </div>
                      ) : null}
                      {SendOtp === true && Box === true ? (
                        <Form>
                          <div className="otpContainer">
                            {/* <h className="timersec">
                            {" "}
                            <IoIosTimer /> {timeLeft}{" "}
                          </h> */}

                            <input
                              name="otp1"
                              type="text"
                              autoComplete="off"
                              className="otpInput"
                              value={otp1}
                              // onKeyPress={keyPressed}
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

                      {SendOtp === false && passwordType != "NULL" ? (
                        <div className="Signinbtn">
                          <Buttons
                            type="submit"
                            buttonText="LOGIN"
                            // handleSubmit={onSubmit}
                            icon={<ArrowRightOutlined />}
                          ></Buttons>
                        </div>
                      ) : MobileNo != false ? (
                        <div className="timersecdiv">
                          {console.log("timeLeft", timeLeft)}
                          {Status && timeLeft != null ? (
                            <div className="timersecsubdiv">
                              <div>
                                <ClockCircleOutlined />
                              </div>
                              <div
                                style={{
                                  color: timeLeft <= 10 ? "red" : "green",
                                }}
                              >
                                0 : {timeLeft < 10 ? "0" + timeLeft : timeLeft}{" "}
                              </div>
                            </div>
                          ) : Status ? (
                            <Buttons
                              type="submit"
                              buttonText="Resend OTP"
                              icon={<ArrowRightOutlined />}
                            ></Buttons>
                          ) : (
                            ""
                          )}

                          {!Status && (
                            <Buttons
                              type="submit"
                              buttonText="Send OTP"
                              icon={<ArrowRightOutlined />}
                            ></Buttons>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </Form>

                  <a className="txt6">
                    {passwordType != "NULL" ? (
                      <Collapse>
                        <Panel header="Try Another Way" key="1">
                          <RadioGrpButton
                            content={content.filter((value) => value != null)}
                            fieldState={true}
                            defaultSelect={passwordType}
                            // Header={"Select Level"}
                            onSelectFuntion={(e) => onChange(e)}
                          />
                        </Panel>
                      </Collapse>
                    ) : null}
                  </a>

                  <p href="#!" className="txt5">
                    @2023, Paypre Pvt. Ltd. All Rights Reserved.
                  </p>
                </div>
              </Col>

              <Col span={12}>
                <div className="imgcrsl">
                  {" "}
                  <ImgCarousel />{" "}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
