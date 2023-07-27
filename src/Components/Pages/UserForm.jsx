import React, { Component, useEffect, useState } from "react";
import { InputField } from "../Forms/InputField.jsx";
import { Col, Divider, Row } from "antd";
import { Form } from "antd";
import Buttons from "../Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../Notifications/Messages";
import { RadioGrpButton } from "../Forms/RadioGroup.jsx";
import { Toggle } from "../Forms/Switch.jsx";

import Imageupload from "../Forms/Upload.jsx";

// import "./UserForm.scss"
import "../../fonts/Gilroy/stylesheet.css";
import { useDispatch } from "react-redux";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";

const style = {
  // background: '#0092ff',
  left: "-22rem",
  padding: "8px 10px",
  width: "1200px",
  display: "flex",
  flexwrap: "wrap",
  justifyContent: "center",
};

// const items= [
//     {
//       title: 'Home',
//     },
//     // {
//     //   title: <a href="">Application Center</a>,
//     // },
//     {
//       title: <a href="">User</a>,
//     },
//     {
//       title: 'Profile',
//     },
//   ]

const items = [
  {
    name: "Home",
    link: "/",
  },

  {
    name: "User",
    link: "user",
  },
  {
    name: "Profile",
    link: "user/profile",
  },
];

var props2 = [
  {
    value: "2",
    name: "test",
    label: "Male",
    className: "mohan",
    min: "21-04-2023",
    canSelectPast: false,
  },
  {
    value: "3",
    name: "test",
    label: "Female",
    className: "mohan",
    min: "21-04-2023",
    canSelectPast: false,
  },
];
var props = {
  value: "2",
  name: "test",
  label: "First Name",
  className: "mohan",
  min: "21-04-2023",
  canSelectPast: false,
};

var fieldState = true;
var fieldApi = [
  {
    setValue: "s",
    setTouched: true,
  },
];

export default function UserForm() {
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  const formRef = React.useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);

  const handleSubmit = () => {
    setMessageType("success");
    setMessageData("Data Added Successfully");
  };

  return (
    <div>
      <div className="formbg">
        <Messages messageType={messageType} messageData={messageData} />
        <div className="formName">
          {" "}
          Profile
          <p className="formdes">
            {" "}
            Fill out a few details to start receiving payment directly to your
            account.
          </p>
        </div>
        <div className="Userform">
          <Form ref={formRef} className="formcont">
            <ul class="grid-wrapper">
              <li>
                <Form.Item
                  name="Name"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please select your country!",
                    },
                  ]}
                >
                  <InputField
                    // props={props} fieldState={fieldState} fieldApi={fieldApi} required
                    field="Name"
                    name="test"
                    label="Name"
                    fieldState={true}
                    fieldApi={true}
                    id="error2"
                  />
                </Form.Item>
              </li>

              <li>
                <Form.Item
                  name="Age"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please select your country!",
                    },
                  ]}
                >
                  <InputField
                    // props={props} fieldState={fieldState} fieldApi={fieldApi} required
                    field="Age"
                    name="test"
                    label="Age"
                    fieldState={true}
                    fieldApi={true}
                    id="error2"
                  />
                </Form.Item>
              </li>

              <li>
                <Form.Item
                  name="Mobile Number"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please select your country!",
                    },
                  ]}
                >
                  <InputField
                    // props={props} fieldState={fieldState} fieldApi={fieldApi} required
                    field="Mobile Number"
                    name="test"
                    label="Mobile Number"
                    fieldState={true}
                    fieldApi={true}
                    id="error2"
                  />
                </Form.Item>
              </li>

              <li>
                <Form.Item
                  name="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Please select your country!",
                    },
                  ]}
                >
                  <li className="drp_btn">
                    <RadioGrpButton
                      props={props2}
                      fieldState={true}
                      fieldApi={fieldApi}
                      style={style}
                    />
                  </li>
                </Form.Item>
              </li>

              <li>
                <Form.Item
                  name="Mail Id"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please select your country!",
                    },
                  ]}
                >
                  <InputField
                    // props={props} fieldState={fieldState} fieldApi={fieldApi} required
                    field="Mail Id"
                    name="test"
                    label="Mail Id"
                    fieldState={true}
                    fieldApi={true}
                    id="error2"
                  />
                </Form.Item>
              </li>

              <div className="upload_btn">
                <p>Upload Profile Photo</p>
                <Imageupload />
                <p style={{ fontSize: "10px" }}>
                  Support for a single or bulk upload. <br />
                  Strictly prohibited from uploading company
                  <br /> data or other banned files.
                </p>
              </div>

              <li className="submit_btn">
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                  handleSubmit={handleSubmit}
                />
              </li>

              {/* <li>
                      <Toggle defaultChecked={true} functionName={handleSubmit} />

                      </li> */}

              <li className="extradetails">
                <Form.Item
                  name="Address"
                  
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <p> Extra Details</p>
                  <br />
                  <Toggle defaultChecked={true} functionName={handleSubmit} />
                </Form.Item>
              </li>
            </ul>
          </Form>
        </div>
      </div>
    </div>
  );
}
