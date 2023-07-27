import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Form, Input } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages.jsx";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import FormHeader from "../pageComponents/FormHeader.jsx";
import Imageupload from "../../Components/Forms/Upload.jsx";
import { postUserData, putUserData } from "../../features/userPage/userPage.js";
import {
  companyActiveDataSelector,
  getActiveCompanyData,
  getUserRoles,
  checkTrialCompany,
} from "../../features/companyPage/companyPage.js";
import {
  branchActiveDataSelector,
  getActiveBranchData,
  getActiveAdminData,
  getActiveAppData,
  getCompanyDataBasedOnApp,
  getBranchDataBasedOnCompany
} from "../../features/branchPage/branchPage.js";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.BASE_URL;

const UserForm = ({ formType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;
  const editstate = state?.editstate;
  const formRef = useRef(null);
  const dispatch = useDispatch();
  // const CompanyNames = useSelector(companyActiveDataSelector);
  // const BranchNames = useSelector(branchActiveDataSelector);

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );
  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );
  const [SelectedCompany, setSelectedCompany] = useState();
  const [SelectedAdmin, setSelectedAdmin] = useState(null);
  const [SelectedBranch, setSelectedBranch] = useState();
  const [SelectedApp, setSelectedApp] = useState(null);
  const [isOnchange, setIsOnchange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [FilteredBranches, setFilteredBranches] = useState([]);
  const [UserRoles, setUserRoles] = useState([]);
  const [SelectedRoles, setSelectedRoles] = useState(null);
  const [AdminNames, setAdminNames] = useState([]);
  const [AppNames, setAppNames] = useState([]);
  const [CompanyNames, setCompanyNames] = useState([]);
  const [BranchNames, setBranchNames] = useState([]);
  const [TrialUserData,setTrialUserData]=useState([]);
  const [Disable,setDisable]=useState(false)
  

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
    {
      name: "UserCreation",
      link: `${subDirectory}setting/user-master/`,
    },
    {
      name: editstate ? "Edit" : "New",
      link: editstate
        ? `${subDirectory}setting/user-master/update`
        : `${subDirectory}setting/user-master/new`,
    },
  ];

  const onFinish = async (values) => {
    let postData = values;
   
    let fliterRoleData = UserRoles.filter((a) => a.ConfigName === "Employee");
    postData["UserImage"] = imageUrl;
    postData["UserType"] = values?.UserType
      ? values?.UserType
      : fliterRoleData.length > 0
      ? fliterRoleData[0].ConfigId
      : null;
    // === "2" ? "P" : "E"
    postData["CreatedBy"] = getCookieData("UserId") || 7;

    let response = {};
    if (formType === "add") {
      response = await dispatch(postUserData(postData)).unwrap();
    } else if (formType === "edit") {
      if (editstate) {
        postData["CompId"] = editstate?.CompId;
        postData["BranchId"] = editstate?.BranchId;
      }
      postData["UserId"] = editstate?.UserId;
      postData["UpdatedBy"] = getCookieData("UserId") || 7;
      response = await dispatch(putUserData(postData)).unwrap();
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/user-master/`, {
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

   useEffect(()=>{
    if(SelectedAdmin!=null && SelectedApp!=null && formType !="edit"){
    handleApplicationChange(SelectedAdmin,SelectedApp)
    }
  },[AppNames])

  const validatePhoneNumber = (rule, value, callback) => {
    if (value && value.length !== 10) {
      callback();
    } else {
      callback();
    }
  };

  const validateEmail = (rule, value, callback) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value || regex.test(value)) {
      callback();
    } else {
      callback("Please enter a valid Mail Id");
    }
  };

  const fetchUserRoles = async () => {
    const response = await dispatch(getUserRoles()).unwrap();
    // const data = await response.data.data;
    // setFeatureCategory(data);
    if (response.data.statusCode === 1) {
      let finalUserRoles = response.data.data.filter(
        (value) =>
          value.ConfigName != "Super Admin" && value.ConfigName != "Public"
      );
      setUserRoles(finalUserRoles);
    }
  };

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    if (UserType === "Super Admin") {
      fetchUserRoles();
    } else {
      fetchUserRoles();
      dispatch(getActiveCompanyData(UserId)).unwrap();
      dispatch(getActiveBranchData()).unwrap();
    }
    // dispatch(getActiveCompanyData()).unwrap();
    // dispatch(getActiveBranchData()).unwrap();
    if (editstate) {
      setSelectedRoles(editstate?.UserTypeName);
      setImageUrl(editstate?.UserImage);
      setSelectedCompany(editstate.CompId);
      setSelectedBranch(editstate.BranchId);
    }
    // else {
    //   navigate(`${subDirectory}user-master/`);
    // }
  }, []);
  useEffect(()=>{
    if(UserType==='Admin'){
      AdminDropDown(UserId)
    }
  },[])

  useEffect(() => {   
    if (SelectedCompany) {
      // Filter branches based on the selected company ID
      const filteredBranches = BranchNames.filter(
        (branch) => branch.CompId === SelectedCompany
      );
      setFilteredBranches(filteredBranches);
    } else {
      setFilteredBranches([]);
    }
  }, [SelectedCompany]);

  const handleUserRoleDropDownChange = async (value) => {
    formRef.current?.setFieldsValue({ UserType: value });
    let filterdata = UserRoles.filter((a) => a?.ConfigId === value);
    setSelectedRoles(filterdata.length > 0 ? filterdata[0]?.ConfigName : null);

    let response = await dispatch(getActiveAdminData()).unwrap();
    if (response.data.statusCode === 1) {
      setAdminNames(response.data.data);
      if(response?.data?.data.length===1){
        AdminDropDown(response?.data?.data[0]?.UserId)

      }
      // AdminDropDown
    }

    // dispatch(getActiveCompanyData()).unwrap();
    // dispatch(getActiveBranchData()).unwrap();
  };

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);


  const handleDropDownChangeForDropDown = async (value,AppId,AdminId) => {

    setSelectedCompany(value);
    formRef.current?.setFieldsValue({ CompId: value });
    

    let response = await dispatch(getBranchDataBasedOnCompany({"UserId":AdminId,"AppId":AppId,"CompId":value})).unwrap();
    if (response.data.statusCode === 1) {
      await setBranchNames(response.data.data);
      if(response?.data?.data?.length===1){
        await DropDownBranchChange(response?.data?.data[0]?.BrId)
      }
      
    }
    else{
      setBranchNames([]);
    }

  };

  const handleDropDownChange = async (value) => {

    setSelectedCompany(value);
    formRef.current?.setFieldsValue({ CompId: value });
 
    let response = await dispatch(getBranchDataBasedOnCompany({"UserId":SelectedAdmin,"AppId":SelectedApp,"CompId":value})).unwrap();

    if (response.data.statusCode === 1) {
      await setBranchNames(response.data.data);
     
      if(response?.data?.data?.length===1){
        await DropDownBranchChange(response?.data?.data[0]?.BrId)
      }
      
    }
    else{
      setBranchNames([]);
    }

  };

  const DropDownBranchChange = async (value) => {
    formRef.current?.setFieldsValue({ BranchId: value });
    await setSelectedBranch(value);
  };
  const AdminDropDown = async (value) => {
    setSelectedApp(null);
    setCompanyNames([]);
    setBranchNames([]);
    setSelectedCompany()
    setSelectedBranch()
    
   
    // formRef?.current?.value = ""
    // formRef.current?.resetFields(["AppId"])
    // formRef.current?.resetFields(["BranchId"])
    // formRef.current?.resetFields(["CompId"])
    // formRef.current?.resetFields()
    // formRef.current?.setFieldsValue({ AppId: undefined })
    formRef.current?.setFieldsValue({ AdminId: value});
    setSelectedAdmin(value);
    let response = await dispatch(getActiveAppData(value)).unwrap();
    if (response.data.statusCode === 1) {
      await setAppNames(response.data.data);
      if(response?.data?.data?.length===1){
        await AppDropDownBasedonAdminId(value,response?.data?.data[0]?.AppId)
      }
      // setSelectedApp(response?.data?.data?.length===1 ? response?.data?.data[0]?.AppId:null)
      
    }
    else{
      setAppNames([]);
    }
    // dispatch(getActiveCompanyData(value)).unwrap();
  };

  const AppDropDownBasedonAdminId = async (AdminId,value) => {
   
    await setSelectedApp(value)
    formRef.current?.setFieldsValue({ AppId: value });
    
    let response = await dispatch(getCompanyDataBasedOnApp({"UserId":AdminId,"AppId":value})).unwrap();
    if (response.data.statusCode === 1) {
     
      await setCompanyNames(response?.data?.data);
      if(response?.data?.data?.length===1){
        await handleDropDownChangeForDropDown(response?.data?.data[0]?.CompId,value,AdminId)
       
      } 
    }
    else{
      setCompanyNames([]);
    }
  };
 

  const AppDropDown = async (value) => {
   
    await setSelectedApp(value)
    formRef.current?.setFieldsValue({ AppId: value });
    
    let response = await dispatch(getCompanyDataBasedOnApp({"UserId":SelectedAdmin,"AppId":value})).unwrap();
    if (response.data.statusCode === 1) {
     
      await setCompanyNames(response?.data?.data);
      if(response?.data?.data?.length===1){
        await handleDropDownChangeForDropDown(response?.data?.data[0]?.CompId,value,SelectedAdmin)
       
      } 
    }
    else{
      setCompanyNames([]);
    }
  };


  const updateImageUrl = (url) => {
    setImageUrl(url);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };




//Imran 
const handleApplicationChange = async (UserId,AppId) => {
  var TrialData =[];
  if (UserType === 'Admin') {
     TrialData =await dispatch(
      checkTrialCompany({ UserId: UserId, AppId: AppId })
    ).unwrap();
  }
  else{
     TrialData =await dispatch(
      checkTrialCompany({ UserId: UserId, AppId: AppId })
    ).unwrap();
  }
 
  if (TrialData.data.statusCode==1 && formType !="edit"){
    const Trial=TrialData.data.data[0];
    const Count=TrialData.data.data.length;
    console.log(TrialData,"TrialDataTrialData")
    let fliterFeatConstraintdata = Trial?.FeatureDetails?.filter((a) => a.FeatName === "User" ? a.FeatConstraint:0);
    let fliterFeatConstraint = fliterFeatConstraintdata.length>0?fliterFeatConstraintdata[0]?.FeatConstraint:0     
  
    if(Trial)
    {
      if ( Trial.PricingName.toUpperCase() == "FREE" && Trial.UserCount >= 1
      ) {
        // if (Count > 1)
        // {
        //   setDisable(true);
        // }
        // else
        // {
          setDisable(false);
          setTimeout(function () {
            navigate(
              `${subDirectory}setting/user-master/`,
              {
                state: {
                  Notiffy: {
                    messageType: "error",
                    messageData:
                      "Your Trial Period is Expired  Please Choose Extend Pack To Add User",
                  },
                },
              },
              700
            );
          });
        // }
      }
        
else if(Trial.PricingName.toUpperCase() != "FREE"){         
        // if(fliterFeatConstraint > Trial.UserCount){
        //   setDisable(false);
        // }
        if(fliterFeatConstraint <= Trial.UserCount){
          setDisable(false);
          setTimeout(function () {
            navigate(
              `${subDirectory}setting/user-master/`,
              {
                state: {
                  Notiffy: {
                    messageType: "error",
                    messageData:
                      "Your Feature Constraint is Completed!",
                  },
                },
              },
              700
            );
          }); 
        }
        // else{                       
          // setDisable(false);
          // setTimeout(function () {
          //   navigate(
          //     `${subDirectory}setting/user-master/`,
          //     {
          //       state: {
          //         Notiffy: {
          //           messageType: "error",
          //           messageData:
          //             "Your Feature Constraint is Completed!",
          //         },
          //       },
          //     },
          //     700
          //   );
          // }); 
        // }
}

    }

  }
  else{
    setTrialUserData([])
  }
  
 
};
//Imran


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
            <FormHeader title={"User Creation"} />
          </div>
          <div className="formDiv">
            <Form
              ref={formRef}
              className="formDivAnt"
              onFinish={onFinish}
              initialValues={{ ...editstate, UserImage: editstate?.UserImage }}
            >
              <div className="formDivS">
                <div className="inputForm">
                  {/* UserType */}
                  {UserType === "Super Admin" ||
                  UserType === "Super Admin User" ? (
                    <Form.Item name="UserType" 
                  
                      rules={[
                        {
                          required: true,
                          message: "Please Select User Type",
                        },
                      ]}
                      
                 
                    >
                      <DropDowns
                        options={UserRoles?.map((option) => ({
                          value: option.ConfigId,
                          label: option.ConfigName,
                        }))}
                        placeholder="User Type"
                        label="User Type"
                        className="field-DropDown"
                        isOnchanges={(formType == "edit" || SelectedRoles)?true:false}
                        onChangeFunction={handleUserRoleDropDownChange}
                        valueData={SelectedRoles}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}

                  {(UserType === "Super Admin" ||
                    UserType === "Super Admin User") &&
                  SelectedRoles != "Super Admin User" && SelectedRoles != "Admin" && formType !="edit" ? (
                    <Form.Item
                      name="AdminId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Admin",
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={AdminNames?.map((option) => ({
                          value: option.UserId,
                          label: option.UserName
                            ? option.UserName
                            : option.MobileNo,
                        }))}
                        placeholder="Admin Name"
                        label="Admin Name"
                        className="field-DropDown"
                        isOnchanges={SelectedAdmin ?true:false}
                        onChangeFunction={AdminDropDown}
                        valueData={SelectedAdmin}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}

                 
                  {SelectedRoles != "Super Admin User" && SelectedRoles != "Admin" && formType !="edit" ? (
                    <Form.Item
                      name="AppId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Application",
                        },
                      ]}
                      
                    >
                   
                      <DropDowns
                        options={AppNames?.map((option) => ({
                          value: option.AppId,
                          label: option.AppName
                        }))}
                        placeholder="Application"
                        label="Application"
                        className="field-DropDown"
                        isOnchanges={SelectedApp?true:false}
                        onChangeFunction={AppDropDown}
                        valueData={SelectedApp}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}

                  {SelectedRoles != "Super Admin User" &&
                  SelectedRoles != "Admin" && formType !="edit" ? (
                    <Form.Item
                      name="CompId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Organization",
                        },
                      ]}
                      
                     
                    >
                      <DropDowns
                        options={CompanyNames?.map((option) => ({
                          value: option.CompId,
                          label: option.CompName,
                        }))}
                        placeholder="CompId"
                        label="Organization Name"
                        className="field-DropDown"
                        isOnchanges={SelectedCompany?true:false}
                        onChangeFunction={handleDropDownChange}
                        valueData={SelectedCompany}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}
                  {SelectedRoles != "Super Admin User" &&
                  SelectedRoles != "Admin" && formType !="edit" ? (
                    <Form.Item
                      name="BranchId"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Branch",
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={BranchNames?.map((option) => ({
                          value: option.BrId,
                          label: option.BrName,
                        }))}
                        placeholder="BranchId"
                        label="Branch Name"
                        className="field-DropDown"
                        isOnchanges={SelectedBranch?true:false}
                        onChangeFunction={DropDownBranchChange}
                        valueData={SelectedBranch}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                  ) : null}

                  <Form.Item
                    name="MobileNo"
                    rules={[
                      {
                        pattern: /^\d{10}$/,
                        message: "Please Enter a Valid Mobile Number",
                      },
                      { required: true ,
                      message:"Please Enter Mobile Number"},
                      { validator: validatePhoneNumber },
                    ]}
                    
                  >
                    <InputField
                      field="MobileNo"
                      label="Mobile Number"
                      fieldState={true}
                      maxLength="10"
                      fieldApi={true}
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="MailId"
                    rules={[{ validator: validateEmail }]}
                    
                  >
                    <InputField
                      field="MailId"
                      label="MailId"
                      fieldState={true}
                      fieldApi={true}
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="UserName"
                    rules={[{ pattern:/^(?!\s*$).+/,message:"Please Enter User Name" }]}
                    // hasFeedback
                  >
                    <InputField
                      field="UserName"
                      label="User Name"
                      fieldState={true}
                      fieldApi={true}
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="Password"
                    // rules={[{ required: true }]}
                    // hasFeedback
                  >
                    <Input.Password
                      field="Password"
                      fieldState={true}
                      fieldApi={true}
                      autocomplete="off"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      onIconClick={handlePasswordToggle}
                      visibilityToggle={true}
                      addonBefore="Password"
                      isOnChange={formType == "edit" ? true : false}
                      style={{ width: "250px" }}
                      // disabled={formType == "edit" ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="Pin"
                    rules={[
                      {
                        pattern: /^[0-9]{4}$/,
                        message: "Pin number must be a 4-digit",
                        required: true
                      },
                    ]}
                    
                  >
                    <InputField
                      field="Pin"
                      label="Pin"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="4"
                      autocomplete="off"
                      isOnChange={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  {/* <Form.Item name="UserType" hasFeedback>
                    <li className="drp_btn">
                      <RadioGrpButton
                        content={[
                          { value: "1", label: "Employee" },
                          { value: "2", label: "Public" },
                        ]}
                        fieldState={true}
                        defaultSelect={
                          formType === "edit"
                            ? String(editstate?.UserType) === "P"
                              ? "2"
                              : "1"
                            : "1"
                        }
                        Header={"Select UserType"}
                      />
                    </li>
                  </Form.Item> */}

               

                  <div className="upload_btn">
                    <p>Upload Profile</p>
                    <Imageupload
                      singleImage={true}
                      updateImageUrl={updateImageUrl}
                      ImageLink={formType == "edit" ? imageUrl : null}
                    />
                  </div>
                </div>
              </div>
              <div className="submitButton">
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                  htmlType={true}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
