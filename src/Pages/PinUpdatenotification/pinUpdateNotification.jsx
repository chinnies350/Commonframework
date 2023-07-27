import { useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../Components/Forms/InputField.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import {
  ArrowRightOutlined,
  EditFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages.jsx";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { Col, Form, Row } from "antd";
import { putPin } from "../../features/userAccount/userAccount.js";
import { useNavigate } from 'react-router-dom';

import "./pinUpdateNotification.scss";
import { getCookieData } from "../../Services/others";

const PinUpdateNotification = ({ formType,pinUpdate }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setopen] = useState(true);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  const onFinish = async (values) => {
    console.log(values, "value of data");
    let postData = values;

    let response = {};
    postData["Pin"] = values.NewPin;
    postData["UpdatedBy"] = getCookieData("UserId") || 7;
    postData["UserId"] = getCookieData("UserId");

    response = await dispatch(putPin(postData)).unwrap();

    if (response.data.statusCode == 1) {
      setMessageType("success");
      setMessageData("Your PIN has been activated successfully");

      setTimeout(() => {
        pinUpdate(false);
      }, 3000);

      
      // pinUpdate(false)
    } else {
      setMessageType("error");
      setMessageData(response.data.response);
    }
  };

  const ChangeStatus = async () => {
    setopen(true);
  };
  const CloseHandle = async () => {
    setopen(false);
  };

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);

  return (
    <div className="">
      <div className="userPage">
        <div className="userPageContent">
          <Messages
            messageType={messageType}
            messageData={messageData}
            onComplete={onComplete}
          />
          <div className="formedit">
            {/* <div className="backBtn">
              <FormHeader title={"PIN"} />
              {open ? (
                <div className="backBtn2" onClick={() => CloseHandle()}>
                  {" "}
                  <ArrowLeftOutlined /> Back{" "}
                </div>
              ) : null}
            </div> */}
          </div>
          {!open ? (
            <div className="ChangePW_Div">
              <Row>
                <Col flex="1 1 200px">
                  <p className="editBtn_text"> Set / Change PIN </p>
                </Col>

                <Col flex="1 1 100px">
                  <button className="edit_btn" onClick={() => ChangeStatus()}>
                    Edit <EditFilled />{" "}
                  </button>
                </Col>
              </Row>
            </div>
          ) : null}

          {open ? (
            <>

            <div className="formDiv">
              <Form ref={formRef} className="formDivAnt" onFinish={onFinish}>
                <div className="formDivS">
                  <div className="inputForm">
                    <Form.Item
                      name="NewPin"
                      
                      rules={[
                        {
                          required: true,
                          message: "Please Enter your New Pin!",
                        },
                        // { min: 4, message: "Pin must be minimum 4 Numbers." },
                        {
                          pattern: /^[0-9]{4}$/,
                          message: 'Pin must be minimum 4 Numbers',
                   
                        },
                      ]}
                    >
                      <InputField
                        field="NewPin"
                        name="NewPin"
                        label="New PIN"
                        fieldState={true}
                        fieldApi={true}
                        maxlength="4"
                        // minlength="4"
                        id="error2"
                        autocomplete="off"
                        isOnChange={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  </div>
                </div>

               
              
            
            
            <div className="submitButton">
                  <Buttons
                    buttonText="SUBMIT"
                    color="901D77"
                    icon={<ArrowRightOutlined />}
                    // handleSubmit={handleSubmit}
                  />
                </div>
                </Form>
                </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PinUpdateNotification;
