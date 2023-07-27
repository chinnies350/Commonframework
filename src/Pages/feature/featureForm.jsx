import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Form } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages.jsx";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import { getConfigName } from "../../Services/CarouselService.js";
import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { getCookieData } from "../../Services/others";
import { useNavigate, useLocation } from "react-router-dom";
const subDirectory = import.meta.env.BASE_URL;

import {
  getFeatureCategory,
  getFeatureType,
  getFeature,
  postFeature,
  putFeature,
} from "../../features/feature/feature.js";


const FeatureForm = ({ formType }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;
  const editstate = state?.editstate;

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [options, setOptions] = useState([]);
  const [FeatureCategory, setFeatureCategory] = useState([]);
  const [FeatureType, setFeatureType] = useState([]);
  const [SelectedCoreAdd, setSelectedCoreAdd] = useState(editstate? (editstate.CoreAddon != 0 ? editstate.CoreAddon : "2"):"2");
  const [isOnchange, setIsOnchange] = useState(false);
  const [selectedFeatureType, setselectedFeatureType] = useState(
    editstate ? editstate.FeatType : null
  );
  const [selectedFeatureCategory, setselectedFeatureCategory] = useState(
    editstate ? (editstate.FeatCat != 0 ? editstate.FeatCat : null) : null
  );

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "Feature",
      link: `${subDirectory}setting/feature-master/`,
    },
    {
      name: editstate ? "Edit" : "New",
      link: editstate
        ? `${subDirectory}setting/feature-master/update`
        : `${subDirectory}setting/feature-master/new`,
    },
  ];

  const onFinish = async (values) => {
    console.log(values,"value of data",SelectedCoreAdd)
    let postData = values;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    

    let response = {};
    if (formType === "add") {
      postData["FeatId"] = values.FeatId;
      postData['CoreAddon']=values.CoreAddon?values.CoreAddon:SelectedCoreAdd
      response = await dispatch(postFeature(postData)).unwrap();
    } else if (formType === "edit") {
      if (editstate) {
        postData["FeatId"] = editstate.FeatId;
      }
      postData["UpdatedBy"] = getCookieData("UserId") || 7;

      response = await dispatch(putFeature(postData)).unwrap();
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/feature-master/`, {
        state: {
          Notiffy: {
            messageType: "success",
            messageData: response.data.response,
          },
        },
      });
    } 
    else {
      setMessageType("error");
      setMessageData(response.data.response);
    }
  };

  const fetchConfigName = async () => {
    const response = await dispatch(getFeatureCategory()).unwrap();
    // const data = await response.data.data;
    // setFeatureCategory(data);
    if (response.data.statusCode === 1) {
      let finalFeatureCategory = response.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setFeatureCategory(finalFeatureCategory);
    }
  };

  useEffect(() => {
    fetchConfigName();
    if (formType === "edit") {
      // 
      if (editstate) {
        
        console.log(editstate,"editstateeditstate")
        featurecatDropDownChange(editstate.FeatCat);
        featureTypeDropDownChange(editstate.FeatType)
        formRef.current?.setFieldsValue(
          editstate
        );
      } else {
        navigate(`${subDirectory}setting/feature-master/`);
      }
    }
    dispatch(changeBreadCrumb({ items: items }));
  }, []);

  

  const featurecatDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ FeatCat: e });
    setselectedFeatureCategory(e);

    const getFeatureTypeDropDown = await dispatch(getFeatureType()).unwrap();
    if (getFeatureTypeDropDown.data.statusCode === 1) {
      let finalFeatureTypeDropDown = getFeatureTypeDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );

      setFeatureType(finalFeatureTypeDropDown);
    }
  };

  const featureTypeDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ FeatType: e });
    setselectedFeatureType(e);
  };


  return (
    <div className="pageOverAll">
      <div className="userPage">
        <div className="userPageContent">
          <Messages messageType={messageType} messageData={messageData} />
          <div className="formName">
            <FormHeader title={"Feature"} />
            <p className="formdes"></p>
          </div>
          <div className="formDiv">
            <Form ref={formRef} className="formDivAnt" onFinish={onFinish}>
              <div className="formDivS">
                <div className="inputForm">
                  <Form.Item
                    name="FeatCat"
                    
                    rules={[
                      {
                        required: true,
                        message:"Please Select Feature Category"
                      },
                      
                    ]}
                  >
                    <DropDowns
                      options={FeatureCategory?.map((option) => ({
                        value: option.ConfigId,
                        label: option.ConfigName,
                      }))}
                      placeholder="FeatCat"
                      label="Feature Category"
                      optionsNames={{ value: "ConfigId", label: "ConfigName" }}
                      className="field-DropDown"
                      onChangeFunction={(e) => featurecatDropDownChange(e)}
                      isOnchanges={formType == "edit" ? true : false}
                      valueData={selectedFeatureCategory}
                      // onChangeFunction={handleDropDownChange}
                      // value={selectedOptionId}
                    />
                  </Form.Item>

                  <Form.Item
                    name="FeatName"
                    
                    rules={[
                      {
                        required: true,
                        pattern: /^(?!\s*$).+/,
                        message: "Please Enter Feature Name",
                      },
                    ]}
                  >
                    <InputField
                      field="FeatName"
                      name="test"
                      label="Feature Name"
                      fieldState={true}
                      fieldApi={true}
                      id="error2"
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="FeatType"
                    
                    rules={[
                      {
                        required: true,
                        message:"Please Select Feature Type"
                      },
                    ]}
                  >
                    <DropDowns
                      options={FeatureType?.map((option) => ({
                        value: option.ConfigId,
                        label: option.ConfigName,
                      }))}
                      placeholder="Feat Type"
                      label="Feature Type"
                      optionsNames={{ value: "ConfigId", label: "ConfigName" }}
                      className="field-DropDown"
                      onChangeFunction={(e) => featureTypeDropDownChange(e)}
                      isOnchanges={formType == "edit" ? true : false}
                      valueData={selectedFeatureType}
                      // onChangeFunction={handleDropDownChange}
                      // value={selectedOptionId}
                    />
                  </Form.Item>

                  {/* <Form.Item
                        name="FeatConstraint"
                        hasFeedback
                        >
                        <InputField
                            field="FeatConstraint"
                            name="test"
                            type="number"
                            label="Feature Constraint"
                            fieldState={true}
                            fieldApi={true}
                            id="error2"
                            autocomplete="off"
                        />
                        </Form.Item> */}

                  <Form.Item
                    name="FeatConstraint"
                    
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value >= 0) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              "Please Enter Valid Net Price"
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <InputField
                      field="FeatConstraint"
                      name="Feature Constraint"
                      type="number"
                      label="Feature Constraint"
                      fieldState={true}
                      fieldApi={true}
                      id="error2"
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="FeatDescription"
                  rules={[
                    {
                      required: true,
                      pattern: /^(?!\s*$).+/,
                      message:"Please Enter Description"
                    },
                  ]}>
                    <TextAreaInput
                      field="FeatDescription"
                      name="test"
                      label="Feature Description"
                      className="Input"
                      fieldState={true}
                      fieldApi={true}
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="CoreAddon">
                    <li className="drp_btn">
                      <RadioGrpButton
                        content={[
                          { value: "1", label: "Core" },
                          { value: "2", label: "Add-on" },
                        ]}
                        fieldState={true}
                        defaultSelect={SelectedCoreAdd}
                        Header={"Select CoreAddon"}
                        // onSelectFuntion={(e) => selectValue(e)}
                      />
                    </li>
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

export default FeatureForm;
