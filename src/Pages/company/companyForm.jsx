import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DropDowns } from "../../Components/Forms/DropDown";
import { Form, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { Toggle } from "../../Components/Forms/Switch.jsx";
import Imageupload from "../../Components/Forms/Upload.jsx";
import MapView from "../../Components/MapView/MapView.jsx";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";

import {
  postCompanyData,
  putCompanyData,
  getAdminNames,
  AdminNamesSelector,
  getApplications,
  ApplicationNamesSelector,
  checkTrialCompany,
  checkTrialCompanySelector,
} from "../../features/companyPage/companyPage.js";
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL;

const CompanyForm = ({ formType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formRef = useRef(null);
  const state = location?.state;
  const editstate = state?.editstate;

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [addressData, setAddressData] = useState(false);
  const [zipCodeData, setZipCodeData] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [SelectedAdmin, setSelectedAdmin] = useState(null);
  const [SelectedApplication, setSelectedApplication] = useState(null);
  const [SelectedLatitude, setSelectedLatitude] = useState(null);
  const [SelectedLongitude, setSelectedLongitude] = useState(null);
  const [selectShortName, setSelectShortName]=useState(null);
  const [selectCompMobile, setSelectCompMobile]=useState(null);

  const [FiltereApplications, setFiltereApplications] = useState([]);
  const [disable, setDisable] = useState(false);
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );

  const AdminNames = useSelector(AdminNamesSelector);
  console.log("AdminNames", AdminNames);

  const ApplicationNames = useSelector(ApplicationNamesSelector);
  console.log("ApplicationNames", ApplicationNames);

  const CheckTrailCompany = useSelector(checkTrialCompanySelector);
  console.log(CheckTrailCompany, "654656544545");
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "Organization",
      link: `${subDirectory}setting/Organization-master`,
    },
    {
      name: editstate ? "Edit" : "New",
      link: editstate
        ? `${subDirectory}setting/Organization-master/update`
        : `${subDirectory}setting/Organization-master/new`,
    },
  ];
  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    if (formType === "edit") {
      if (editstate) {
        if(editstate?.AddId!=null && editstate?.AddId!=0)setAddressData(true)
        setImageUrl(editstate?.CompLogo);
        if (editstate?.Zip) setZipCodeData(true);
        setSelectedAdmin(editstate?.UserId);
        // dispatch(getApplications(editstate?.UserId)).unwrap();
        setSelectedApplication(editstate.AppId);
      }
    }
    dispatch(getAdminNames()).unwrap();
    if (UserType === "Admin") {
      dispatch(getApplications(UserId)).unwrap();
    } else {
      dispatch(getApplications()).unwrap();
    }
  }, []);

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);

  useEffect(() => {
    if (SelectedAdmin) {
      // Filter company based on the selected User ID
      const filteredApplications = ApplicationNames.filter(
        (option) => option.UserId === SelectedAdmin
      );
      setFiltereApplications(filteredApplications);
    } else {
      setFiltereApplications([]);
    }
  }, [SelectedAdmin, ApplicationNames]);

  const onFinish = async (values) => {
    console.log("Values", values);

    let postData = values;
    postData["CompLogo"] = imageUrl;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    postData["UserId"] = values.UserId || getCookieData("UserId");

    let response = {};
    if (formType === "add") {
      try {
        response = await dispatch(postCompanyData(postData)).unwrap();
      } catch (err) {
        if (err["message"] == "Request failed with status code 422") {
          response = {
            data: {
              statusCode: 0,
              response: "Please Give Required Fields",
              data: [],
            },
          };
        }
      }
    } else if (formType === "edit") {
      if (editstate && addressData) {
        postData["CompAddId"] = editstate?.CompAddId;
        postData["AddId"] = editstate?.AddId != null ? editstate?.AddId : 0;
      }
      if (editstate && !addressData) {
        postData["CompAddId"] = editstate?.CompAddId;
        postData["AddId"] = editstate?.AddId != null ? editstate?.AddId : 0;
        postData["Address1"] = editstate?.Address1;
        postData["Address2"] = editstate?.Address2;
        postData["Zip"] = editstate?.Zip;
        postData["City"] = editstate?.City;
        postData["Dist"] = editstate?.Dist;
        postData["State"] = editstate?.State;
        postData["Latitude"] = editstate?.Latitude;
        postData["Longitude"] = editstate?.Longitude;
        postData["UserId"] = editstate?.UserId;
      }
      postData["CompId"] = editstate?.CompId;
      postData["UpdatedBy"] = getCookieData("UserId") || 7;
      try {
        response = await dispatch(putCompanyData(postData)).unwrap();
      } catch (err) {
        if (err["message"] == "Request failed with status code 422") {
          response = {
            data: {
              statusCode: 0,
              response: "Please Give Required Fields",
              data: [],
            },
          };
        }
      }
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/Organization-master/`, {
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
  const updateImageUrl = (url) => {
    setImageUrl(url);
  };

  const handleAddress = (checked) => {
    if (checked) {
      setAddressData(true);
    } else {
      setAddressData(false);
      if (!editstate) {
        setSelectedLatitude(null)
        setSelectedLongitude(null)
        formRef.current?.setFieldsValue({
          City: null,
          Dist: null,
          State: null,
          Zip: null,
          Latitude: null,
          Longitude: null,
        });
      }
    }
  };
  const getPincodeValues = async (pinCode) => {
    let response = "";
    await fetch(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then((res) => res.text())
      .then((text) => (response = JSON.parse(text)));

    if (response[0]["Status"] === "Success") {
      setZipCodeData(true);
      formRef.current?.setFieldsValue({
        City: response[0]["PostOffice"][0]["Block"],
        Dist: response[0]["PostOffice"][0]["District"],
        State: response[0]["PostOffice"][0]["State"],
      });
    } else {
      setZipCodeData(false);
    }
  };

  const onMarkerClick = async (location) => {
    setSelectedLatitude(location.lat())
    setSelectedLongitude(location.lng())
    formRef.current?.setFieldsValue({
      Latitude: location.lat(),
      Longitude: location.lng(),
    });
  };
  const pinCodeChange = async (e) => {
    if (e.target.value.length < 6) {
      setZipCodeData(false);
      return false;
    }
    await getPincodeValues(e.target.value);
  };

  const handleDropDownChange = async (value) => {
    formRef.current?.setFieldsValue({ UserId: value });
    setSelectedApplication(null);
    // dispatch(getApplications(value)).unwrap();
    await setSelectedAdmin(value);
  };

  useEffect(() => {
    console.log("SelectedAdmin in useEffect:", SelectedAdmin);
  
    if (SelectedAdmin) {
      // Filter applications based on the selected admin
      const filteredApplications = ApplicationNames.filter((option) => option.UserId === SelectedAdmin);
      setFiltereApplications(filteredApplications);
  
      if (filteredApplications.length === 1) {
        const selectedApplicationId = filteredApplications[0].AppId;
        setSelectedApplication(selectedApplicationId);        
        handleApplicationChange(filteredApplications[0].AppId)      
        
        // dispatch(getUserAppCompany({ UserId: SelectedAdmin, AppId: selectedApplicationId })).unwrap();
      } else {
        setSelectedApplication(null);
      }
    } else {
      setFiltereApplications([]);
      setSelectedApplication(null);
    }
  }, [SelectedAdmin, ApplicationNames]);

  useEffect(() => {
    if (UserType === 'Admin') {
      if (ApplicationNames.length === 1) {
        const selectedApplicationId = ApplicationNames[0].AppId;
        setSelectedApplication(selectedApplicationId);
        handleApplicationChange(selectedApplicationId);
       
      } else {
        setSelectedApplication(null);
        // setFiltereCompanies([]);
        // setSelectedCompany(null);
      }
    } else {
      dispatch(getAdminNames()).unwrap();
    }
  }, [UserType, ApplicationNames, UserId]);
  const handleApplicationChange = async (value) => {
    setDisable(false);
    formRef.current?.setFieldsValue({ AppId: value });
    await setSelectedApplication(value);
    var TrialData =[];
    if (UserType === 'Admin') {
       TrialData =await dispatch(
        checkTrialCompany({ UserId: UserId, AppId: value })
      ).unwrap();
    }
    else{
       TrialData =await dispatch(
        checkTrialCompany({ UserId: SelectedAdmin, AppId: value })
      ).unwrap();
    }
   
    if (TrialData.data.statusCode==1 && !editstate){
      const Trial=TrialData.data.data[0];
      const Count=TrialData.data.data.length;
     const mobileno= Trial.MobileNo;
      formRef.current?.setFieldsValue({ CompMobile: mobileno });
      setSelectCompMobile(mobileno)
      if(Trial)
      {
        if (Trial.PricingName.toUpperCase() != "FREE" && Trial["CompanyCount"] == 0) {
        } else if ( Trial.PricingName.toUpperCase() == "FREE" && Trial.CompanyCount >= 1
        ) {
          if (Count > 1)
          {
            setDisable(true);
          }
          else
          {
            setDisable(false);
            setTimeout(function () {
              navigate(
                `${subDirectory}setting/Organization-master/`,
                {
                  state: {
                    Notiffy: {
                      messageType: "error",
                      messageData:
                        "Your Trial Period is Expired  Please Choose Extend Pack To Add Company ",
                    },
                  },
                },
                700
              );
            });
          }
          
        }

else if(Trial.PricingName.toUpperCase() != "FREE"){    
          // let fliterFeatConstraintdata = Trial?.FeatureDetails?.filter((a) => a.FeatName === "Company" ? a.FeatConstraint:0);
          // let fliterFeatConstraint = fliterFeatConstraintdata.map((b) => b.FeatName === "Company" ? b.FeatConstraint:0);
          // console.log(fliterFeatConstraint[0],'444444444')   
          let fliterFeatConstraintdata = Trial?.FeatureDetails?.filter((a) => a.FeatName === "Organization" ? a.FeatConstraint:0);
          let fliterFeatConstraint = fliterFeatConstraintdata.length>0?fliterFeatConstraintdata[0]?.FeatConstraint:0
                   
                  if(fliterFeatConstraint  > Trial.CompanyCount){
                    setDisable(false);
                  }
                  else{                       
                    setDisable(false);
                    setTimeout(function () {
                      navigate(
                        `${subDirectory}setting/Organization-master/`,
                        {
                          state: {
                            Notiffy: {
                              messageType: "error",
                              messageData:
                                "Your Feature Constraint is Completed!  ",
                            },
                          },
                        },
                        700
                      );
                    }); 
                  }
        }        
      }

    }
    else{
      setTrialCompanyData([])
    }
    
   
  };
  
  const handleNameChange = (e) => {
    
    const fullName = e.target.value;
    const shortName = generateShortName(fullName);
    formRef.current?.setFieldsValue({ CompShName: shortName });
    setSelectShortName(shortName)
    //formRef.setFieldsValue({ CompShName: shortName });
  };

  function generateShortName(fullName) {
    const words = fullName.split(" ");

    let shortName = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (word.length > 0) {
        shortName += word.substring(0, 2);
      }
    }

    return shortName.toUpperCase();
  }

  return (
    <div className="pageOverAll">
      <div className="userPage">
        <div className="userPageContent">
          <Messages
            messageType={messageType}
            messageData={messageData}
            onComplete={onComplete}
          />
          <div className="formName">
            <FormHeader title={"Organization"} />
          </div>
          <div className="formDiv">
            <Form
              ref={formRef}
              className="formDivAnt"
              onFinish={onFinish}
              initialValues={editstate}
            >
              <div className="formDivS">
                <div className="inputForm">
                  {UserType === "Super Admin" ||
                  UserType === "Super Admin User" ? (
                    <Form.Item
                      name="UserId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Admin Name ",
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={AdminNames?.map((option) => ({
                          value: option.UserId,
                          label: option?.UserName
                            ? option?.UserName
                            : option.MobileNo,
                        }))}
                        placeholder="UserId"
                        label="Admin Name"
                        className="field-DropDown"
                        isOnchanges={formType == "edit" || SelectedAdmin ? true : false}
                        onChangeFunction={handleDropDownChange}
                        valueData={SelectedAdmin}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}
                  {UserType === "Super Admin" ||
                  UserType === "Super Admin User" ? (
                    <Form.Item
                      name="AppId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Application Name ",
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={FiltereApplications?.map((option) => ({
                          value: option.AppId,
                          label: option.AppName,
                        }))}
                        placeholder="AppId"
                        label="Application Name"
                        className="field-DropDown"
                        isOnchanges={formType == "edit" || SelectedApplication ? true : false}
                        onChangeFunction={handleApplicationChange}
                        valueData={SelectedApplication}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="AppId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Application Name ",
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={ApplicationNames?.map((option) => ({
                          value: option.AppId,
                          label: option.AppName,
                        }))}
                        placeholder="AppId"
                        label="Application Name"
                        className="field-DropDown"
                        isOnchanges={SelectedApplication?true:false}
                        onChangeFunction={handleApplicationChange}
                        valueData={SelectedApplication}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    name="CompName"
                    
                    rules={[
                      {
                        required: true,
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Organization Name ",
                      },
                      {
                        validator: (_, value) => {
                          if (/^.{1,50}$/.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject();
                          }
                        },
                      },
                    ]}
                  >
                    <InputField
                      field="CompName"
                      autoComplete="off"
                      label="Organization Name"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                      onChange={handleNameChange}
                    />
                  </Form.Item>

                  <Form.Item
                    name="CompShName"
                    
                    rules={[
                      {
                        required: true,
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Short Name ",
                      },
                      {
                        validator: (_, value) => {
                          if (/^.{1,20}$/.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject();
                          }
                        },
                      },
                    ]}
                  >
                    <InputField
                      field="CompShName"
                      autoComplete="off"
                      label="Short Name"
                      fieldState={true}
                      fieldApi={true}
                      // isOnChange={formType == "edit" ? true :false}
                      isOnChange={formType == "edit" || selectShortName ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="Proprietor"
                    
                    rules={[
                      {
                        required: true,
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Proprietor ",
                      },
                      {
                        validator: (_, value) => {
                          if (/^.{1,20}$/.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject();
                          }
                        },
                      },
                    ]}
                  >
                    <InputField
                      field="Proprietor"
                      autoComplete="off"
                      label="Proprietor"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="CompMobile" 
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: 'Enter a Valid MobileNo',
                      },
                    ]}
                  >
                    <InputField
                      field="CompMobile"
                      autoComplete="off"
                      label="Mobile"
                      maxlength="10"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" || selectCompMobile ? true : false}
                      // isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item 
                  name="CompEmail"
                  rules={[
                    {
                      pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Enter a valid email address',
                    },
                  ]}>
                    <InputField
                      field="CompEmail"
                      label="Email"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                      autoComplete="off"
                    />
                  </Form.Item>

                  <Form.Item name="CompRegnNo"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Registration.No",
                      }]}
                      >
                    <InputField
                      field="CompRegnNo"
                      autoComplete="off"
                      label="Registration.No"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="CompPOC"
                      rules={[
                        {
                          
                          pattern:/^(?!\s*$).+/,
                          message: "Please Enter Point of Contact",
                        }]}
                    >
                    <InputField
                      field="CompPOC"
                      autoComplete="off"
                      label="Point of Contact"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="CompGSTIN"
                    rules={[
                      {
                        pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/,
                        message: 'Please Enter Valid GST',
                      },
                    ]}
                  >
                    <InputField
                      field="CompGSTIN"
                      autoComplete="off"
                      label="GST"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  <Form.Item name="BusiBrief"
                    rules={[
                      {
                        pattern: /^(?!\s*$).+/,
                        message: 'Please Enter Description',
                      },
                    ]}
                  >
                    <TextAreaInput
                      field="BusiBrief"
                      autoComplete="off"
                      label="Description"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  {(!addressData) && <div className="formAddressDiv">
                    <Form.Item name="Address">
                      <p> Address Details</p>
                      <br />
                    </Form.Item>
                    <Toggle defaultChecked={false} functionName={handleAddress} />
                  </div>}
                  <div className="upload_btn">
                    <p>Upload Logo</p>
                    <Imageupload
                      singleImage={true}
                      updateImageUrl={updateImageUrl}
                      ImageLink={formType == "edit" ? editstate?.CompLogo : ""}
                    />
                  </div>
                  {(!addressData) && <div className="submitButton">
                      <Buttons
                        buttonText="SUBMIT"
                        color="901D77"
                        icon={<ArrowRightOutlined />}
                        htmlType={true}
                      />
                    </div>}
                </div>

                {(addressData) && <div className="formAddressDiv">
                  <Form.Item name="Address">
                    <p> Address Details</p>
                    <br />
                  </Form.Item>
                  <Toggle defaultChecked={true} functionName={handleAddress}/>
                </div>}

                <div className="subinputForm">
                  {addressData ? (
                    <>
                      <div>
                        <Form.Item
                          name="Address1"
                          rules={[
                            {
                              required: true,
                              pattern: /^(?!\s*$).+/,
                              message: 'Please Enter Address1',

                            },
                          ]}
                        >
                          <InputField
                            field="Address1"
                            autoComplete="off"
                            label="Address Line1"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={editstate?.Address1 ? true : false}
                          />
                        </Form.Item>
                        <Form.Item name="Address2"
                        rules={[
                          {
                            
                            pattern: /^(?!\s*$).+/,
                            message: 'Please Enter Address2',

                          },
                        ]}
                        >
                          <InputField
                            field="Address2"
                            autoComplete="off"
                            label="Address Line2"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={editstate?.Address2 ? true : false}
                          />
                        </Form.Item>
                        <Form.Item
                          name="Zip"
                          
                          rules={[
                            {
                              required: true,
                              pattern: /^(?!\s*$).+/,
                              message:"Please Enter Zipcode"
                            },
                            {
                              validator: (_, value) => {
                                if (/(^\d{6}$)|(^\d{5}-\d{4}$)/.test(value)) {
                                  return Promise.resolve();
                                } else {
                                  return Promise.reject();
                                }
                              },
                            },
                          ]}
                        >
                          <InputField
                            field="Zip"
                            autoComplete="off"
                            label="Zipcode"
                            maxLength="6"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={editstate?.Zip ? true : false}
                            onChange={pinCodeChange}
                          />
                        </Form.Item>
                        {zipCodeData ? (
                          <>
                            <Form.Item
                              name="City"
                              
                              rules={[
                                {
                                  required: true,
                                  
                                },
                              ]}
                            >
                              <InputField
                                field="City"
                                disabled={true}
                                isOnChange={true}
                                label="City"
                                fieldState={true}
                                fieldApi={true}
                              />
                            </Form.Item>
                            <Form.Item
                              name="Dist"
                              
                              rules={[
                                {
                                  required: true,
                                  
                                },
                              ]}
                            >
                              <InputField
                                field="Dist"
                                disabled={true}
                                isOnChange={true}
                                label="District"
                                fieldState={true}
                                fieldApi={true}
                              />
                            </Form.Item>
                            <Form.Item
                              name="State"
                              
                              rules={[
                                {
                                  required: true,
                                  
                                },
                              ]}
                            >
                              <InputField
                                field="State"
                                disabled={true}
                                isOnChange={true}
                                label="State"
                                fieldState={true}
                                fieldApi={true}
                              />
                            </Form.Item>
                          </>
                        ) : (
                          ""
                        )}

                        <Form.Item name="Latitude"
                          rules={[
                            {
                              
                              pattern: /^(?!\s*$).+/,
                              message:"Please Enter Latitude"
                            },
                          ]}>
                          <InputField
                            field="Latitude"
                            label="Latitude"
                            autoComplete="off"
                            isOnChange={SelectedLatitude || editstate?.Latitude ? true :false}
                            fieldState={true}
                            fieldApi={true}
                          />
                        </Form.Item>
                        <Form.Item name="Longitude"
                          rules={[
                            {
                              
                              pattern: /^(?!\s*$).+/,
                              message:"Please Enter Longitude"
                            },
                          ]}
                        >
                          <InputField
                            field="Longitude"
                            label="Longitude"
                            autoComplete="off"
                            isOnChange={SelectedLongitude || editstate?.Longitude ? true :false}
                            fieldState={true}
                            fieldApi={true}
                          />
                        </Form.Item>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {addressData ? (
                    <>
                      <div className="MapDiv">
                        <MapView
                          onMarkerClick={onMarkerClick}
                          prevlca={
                            editstate
                              ? {
                                  lat: editstate.Latitude,
                                  lng: editstate.Longitude,
                                }
                              : null
                          }
                        />
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {/* <div className="upload_btn">
                  <p>Upload Logo</p>
                  <Imageupload
                    singleImage={true}
                    updateImageUrl={updateImageUrl}
                    ImageLink={formType == "edit" ? editstate?.CompLogo : ""}
                  />
                </div> */}
              </div>
              {(addressData) && <div className="submitButton">
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                  htmlType={true}
                />
              </div>}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
