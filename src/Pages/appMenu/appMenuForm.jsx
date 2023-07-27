import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../Components/Forms/InputField.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages";
import { Form } from "antd";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import {
  postAppMenu,
  putAppMenu,
  getAppMenu,
  getApplication,
} from "../../features/appMenu/appMenu.js";
import { getCookieData } from "../../Services/others";
import { useNavigate, useLocation } from "react-router-dom";
const subDirectory = import.meta.env.BASE_URL;

const AppMenuForm = ({ formType }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;
  const editstate = state?.editstate;

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [appDropDown, setappDropDown] = useState([]);
  const [selectedAppData, setSelectedAppData] = useState(
    editstate ? editstate.AppId : null
  );
  const [selectedlevelOneData, setselectedlevelOneData] = useState(
    editstate ? (editstate.Level1Id != "0" ? editstate.Level1Id : null) : null
  );
  const [selectedlevelTwoData, setselectedlevelTwoData] = useState(
    editstate ? (editstate.Level2Id != "0" ? editstate.Level2Id : null) : null
  );


  const [menuDropDown, setMenuDropDown] = useState([]);
  const [selectRadioButtonValue, setselectRadioButtonValue] = useState(
    editstate ? editstate.Level : "1"
  );

  console.log(selectedlevelOneData,"selectedlevelOneDataselectedlevelOneData")

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "ApplicationMenu",
      link: `${subDirectory}setting/app-menu`,
    },
    {
      name: editstate ? "Edit" : "New",
      link: editstate
        ? `${subDirectory}setting/app-menu/update`
        : `${subDirectory}setting/app-menu/new`,
    },
  ];

  const onFinish = async (values) => {
    let postData = values;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    postData["AppId"] = values.AppName;
    postData["Level"] = selectRadioButtonValue;
    postData["Level1Id"] = values.LevelOne || 0;
    postData["Level2Id"] = values.LevelTwo || 0;

    let response = {};

    if (formType === "add") {
      response = await dispatch(postAppMenu(postData)).unwrap();
    } else if (formType === "edit") {
      if (editstate) {
        postData["MenuId"] = editstate?.MenuId;
      }
      postData["UpdatedBy"] = getCookieData("UserId") || 7;

      response = await dispatch(putAppMenu(postData)).unwrap();
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/app-menu/`, {
        state: {
          Notiffy: {
            messageType: "success",
            messageData: response.data.response,
          },
        },
      });
    } else {
      setMessageType("error");
      setMessageData(response.data.response);
    }
  };

  async function fetchData() {
    const gettingappDropDown = await dispatch(getApplication()).unwrap();
    if (gettingappDropDown.data.statusCode === 1) {
      let finalAppDropDowndata = gettingappDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setappDropDown(finalAppDropDowndata);
    }
  }

  useEffect(() => {
    try {
      fetchData();
      if (formType === "edit") {
        if (editstate) {
          appDropDownChange(editstate.AppId);
          formRef.current?.setFieldsValue({
            LevelOne: editstate.Level1Id!=0?editstate.Level1Id:null,
            LevelTwo: editstate.Level2Id!=0?editstate.Level2Id:null,
          });
        } else {
          navigate(`${subDirectory}setting/app-menu`);
        }
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);

  const appDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ AppName: e });
    await setSelectedAppData(e);
    const gettingMenuDropDown = await dispatch(getAppMenu(e)).unwrap();
    if (gettingMenuDropDown.data.statusCode === 1) {
      let finalMenuDropDown = gettingMenuDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setMenuDropDown(finalMenuDropDown);
    }
  };

  const leveloneDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ LevelOne: e });
    await setselectedlevelOneData(e);
  };
  const levelTwoDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ LevelTwo: e });
    await setselectedlevelTwoData(e);
  };

  const selectValue = async (e) => {
    setselectRadioButtonValue(e);
  };

  console.log(formRef.current?.getFieldsValue(),"selectedlevelOneDataselectedlevelOneData2")

  return (
    <div className="pageOverAll">
      <div className="userPage">
        <div className="userPageContent">
          <Messages messageType={messageType} messageData={messageData} />
          <div className="formName">
            <FormHeader title={"Application Menu"} />
          </div>

          <div className="formDiv">
            <Form
              ref={formRef}
              className="formDivAnt"
              onFinish={onFinish}
              initialValues={{ ...editstate }}
            >
              <div className="formDivS">
                <div className="inputForm">
                  <Form.Item
                    name="AppName"
                    
                    rules={[
                      {
                        required: true,
                        message: "Please Select App Name ",
                      },
                    ]}
                  >
                    <DropDowns
                      options={appDropDown?.map((option) => ({
                        value: option.AppId,
                        label: option.AppName,
                      }))}
                      label="App Name"
                      id="AppName"
                      field="AppName"
                      fieldState={true}
                      fieldApi={true}
                      onChangeFunction={(e) => appDropDownChange(e)}
                      isOnchanges={formType == "edit" ? true : false}
                      valueData={selectedAppData}
                      className="field-DropDown"
                    />
                  </Form.Item>

                  <RadioGrpButton
                    content={[
                      { value: "1", label: "Level one" },
                      { value: "2", label: "Level Two" },
                      { value: "3", label: "Level Three" },
                    ]}
                    fieldState={true}
                    defaultSelect={selectRadioButtonValue}
                    Header={"Select Level"}
                    onSelectFuntion={(e) => selectValue(e)}
                  />
                  {selectRadioButtonValue == 2 ||
                  selectRadioButtonValue == 3 ? (
                    <Form.Item
                      name="LevelOne"
                      
                      rules={[
                        {
                          required: true,
                          message: "Select Level One Menu Name ",
                        },
                      ]}
                    >
                      <DropDowns
                        options={menuDropDown?.map((option) => ({
                          value: option.MenuId,
                          label: option.MenuName,
                        }))}
                        label="Level One Menu"
                        id="LevelOne"
                        onChangeFunction={(e) => leveloneDropDownChange(e)}
                        optionsNames={{ value: "MenuId", label: "MenuName" }}
                        className="field-DropDown"
                        isOnchanges={(formType == "edit" || selectedlevelOneData) ? true : false}
                        valueData={selectedlevelOneData}
                        //   disabled={this.props?.editstate ? true : false}
                      />
                    </Form.Item>
                  ) : null}
                  {selectRadioButtonValue == 3 ? (
                    <Form.Item
                      name="LevelTwo"
                      
                      rules={[
                        {
                          required: true,
                          message: "Select Level Two Menu Name ",

                        },
                      ]}
                    >
                      <DropDowns
                        options={menuDropDown?.map((option) => ({
                          value: option.MenuId,
                          label: option.MenuName,
                        }))}
                        label="Level Two Menu"
                        id="LevelTwo"
                        onChangeFunction={(e) => levelTwoDropDownChange(e)}
                        isOnchanges={(formType == "edit" || selectedlevelOneData) ? true : false}
                        optionsNames={{ value: "MenuId", label: "MenuName" }}
                        className="field-DropDown"
                        valueData={selectedlevelTwoData}
                        //   disabled={this.props?.editstate ? true : false}
                      />
                    </Form.Item>
                  ) : null}

                  <Form.Item
                    name="MenuName"
                    
                    rules={[
                      {
                        required: true,
                        pattern: /^(?!\s*$).+/,
                        message: "Please Enter Menu Name ",
                      },
                    ]}
                  >
                    <InputField
                      field="MenuName"
                      name="MenuName"
                      label="Menu Name"
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
                  // handleSubmit={handleSubmit}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMenuForm;
