import { useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../../Components/Forms/InputField.jsx";
import Buttons from "../../../Components/Forms/Buttons.jsx";
import {
  ArrowRightOutlined,
  EditFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Messages } from "../../../Components/Notifications/Messages";
import FormHeader from "../../pageComponents/FormHeader.jsx";
import { Col, Row, Form } from "antd";
import { putPassword } from "../../../features/userAccount/userAccount.js";
import "./passwordUpdate.scss";
import { getCookieData } from "../../../Services/others";



const PasswordUpdate = ({ formType }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const [open, setopen] = useState(false);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  const onFinish = async (values) => {
    console.log(values, "value of data");
    let postData = values;

    let response = {};
    postData["Password"] = values.NewPassword;
    postData["UpdatedBy"] = getCookieData("UserId") || 7;
    postData["UserId"] = getCookieData("UserId");

    response = await dispatch(putPassword(postData)).unwrap();

    if (response.data.statusCode == 1) {
      setMessageType("success");
      setMessageData("Password Updated Successfully");
      setopen(false);
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
    <div className="pageOverAllUser">
      <div className="userPage">
        <div className="userPageContent">
          <Messages
            messageType={messageType}
            messageData={messageData}
            onComplete={onComplete}
          />
          <div className="formedit">
            <div className="backBtn">
              <FormHeader title={"Password"} />
              {open ? (
                <div className="backBtn2" onClick={() => CloseHandle()}>
                  {" "}
                  <ArrowLeftOutlined /> Back{" "}
                </div>
              ) : null}
            </div>
          </div>
          {!open ? (
            <div className="ChangePW_Div">
              <Row>
                <Col flex="1 1 200px">
                  <p className="editBtn_text"> Set / Change Password </p>
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
            <div className="formDiv">
              <Form ref={formRef} className="formDivAnt" onFinish={onFinish}>
                <div className="formDivS">
                  <div className="inputForm">
                    {/* <Form.Item
                      name="CurrentPassword"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Current Password!",
                        },
                      ]}
                    >
                      <InputField
                        field="CurrentPassword"
                        name="CurrentPassword"
                        label="Current Password"
                        fieldState={true}
                        fieldApi={true}
                        id="error2"
                        autocomplete="off"
                        isOnChange={formType == "edit" ? true : false}
                      />
                    </Form.Item> */}

                    <Form.Item
                      name="NewPassword"
                      
                      rules={[
                        {
                          required: true,
                          message: "Please Enter New Password!",
                        },
                      ]}
                    >
                      <InputField
                        field="NewPassword"
                        name="NewPassword"
                        label="New Password"
                        fieldState={true}
                        fieldApi={true}
                        id="error2"
                        autocomplete="off"
                        isOnChange={formType == "edit" ? true : false}
                      />
                    </Form.Item>

                    <Form.Item
                      name="ConfirmPassword"
                      
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Confirm Password!",
                        },
                        {
                          validator: (_, value) => {
                            
                            if (
                              value ===
                              formRef.current?.getFieldsValue()?.NewPassword
                            ) {
                              return Promise.resolve();
                            } else if (value !=
                              formRef.current?.getFieldsValue()?.NewPassword && value !="") {

                              return Promise.reject("Passwords must be same");
                            }
                            else
                            {return Promise.reject("");}
                          },
                        },
                      ]}
                    >
                      <InputField
                        field="ConfirmPassword"
                        name="ConfirmPassword"
                        label="Confirm Password"
                        fieldState={true}
                        fieldApi={true}
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
                  />
                </div>
              </Form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
