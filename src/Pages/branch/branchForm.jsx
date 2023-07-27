import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from 'moment';
import Buttons from "../../Components/Forms/Buttons.jsx";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import MapView from "../../Components/MapView/MapView.jsx";
import { DropDowns } from '../../Components/Forms/DropDown.jsx';
import { TimePickers } from '../../Components/Forms/TimePicker.jsx';
import FormHeader from '../pageComponents/FormHeader.jsx';
import { getAdminNames, AdminNamesSelector } from "../../features/companyPage/companyPage.js";
import { postBranchData, putBranchData, getBranchApplications, BranchApplicationNamesSelector,
   ApplicationCompanySelector, getApplicationCompany, UserAppCompanySelector,
    getUserAppCompany,checkTrialBranch ,checkTrialBranchSelector,companyname} from "../../features/branchPage/branchPage.js";
import { getCookieData } from "../../Services/others";


const subDirectory = import.meta.env.ENV_BASE_URL

const BranchForm = ({ formType }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formRef = useRef(null);
  const state = location?.state
  const editstate = state?.editstate
  // const Applicationcompany=useSelector(ApplicationCompanySelector)

  const Applicationcompany = useSelector(UserAppCompanySelector)
  console.log("Applicationcompany",Applicationcompany)

  const AdminNames = useSelector(AdminNamesSelector)

  const ApplicationNames = useSelector(BranchApplicationNamesSelector)
  const CheckTrialBranchData = useSelector(checkTrialBranchSelector)

  const [FiltereCompanies, setFiltereCompanies] = useState([]);


  const [FiltereApplications, setFiltereApplications] = useState([]);
  const [disable, setDisable] = useState(false);

  //local states
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [zipCodeData, setZipCodeData] = useState(false);
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [SelectedAdmin, setSelectedAdmin] = useState(null);
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [SelectedApplication, setSelectedApplication] = useState(null);
  const [SelectedLatitude, setSelectedLatitude] = useState(null);
  const [SelectedLongitude, setSelectedLongitude] = useState(null);
  const [selectShortName, setSelectShortName]=useState(null);
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "Branch",
      link: `${subDirectory}setting/branch-master/`,
    },
    {
      name: editstate ? "Edit" : "New",
      link: editstate ? `${subDirectory}setting/branch-master/update` : `${subDirectory}setting/branch-master/new`,
    },

  ];

  // useEffect(()=>{
  //   if (UserType === 'Admin') {
  //   console.log(ApplicationNames,"formRefformRefadmin")
  //   if(ApplicationNames!=[]){
  //     setSelectedApplication(ApplicationNames[0]?.AppId)
  //     handleApplicationChange(ApplicationNames[0]?.AppId)
  //   }
  //   }

  // },[ApplicationNames])

  // useEffect(()=>{
    
  //   console.log(FiltereApplications,"formRefformRefsadmin")
  //   if(FiltereApplications!=[]){
  //     setSelectedApplication(FiltereApplications[0]?.AppId)
  //     handleApplicationChange(FiltereApplications[0]?.AppId)
  //     dispatch(getUserAppCompany({"UserId":FiltereApplications[0]?.UserId, "AppId":FiltereApplications[0]?.AppId})).unwrap();
    
  //   }

  // },[FiltereApplications])

  // useEffect(() => {

  //   console.log(Applicationcompany)
 
  // },[Applicationcompany])

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    // if (UserType === 'Admin') {
    //   dispatch(getActiveCompanyData(UserId)).unwrap();
    //   }else{
    //   dispatch(getActiveCompanyData()).unwrap();
    //   }
    dispatch(getAdminNames()).unwrap();
    if (UserType === 'Admin') {editstate
      dispatch(getBranchApplications(UserId)).unwrap();
    } else {
      dispatch(getBranchApplications()).unwrap();
    }
    if (editstate) {      
      console.log(editstate,"editstateeditstate")
      setFromTime(editstate.WorkingFrom);
      setToTime(editstate.WorkingTo);
      formRef.current?.setFieldsValue({ WorkingFrom: editstate.WorkingFrom, WorkingTo: editstate.WorkingTo, CompId: editstate.CompId })
      setSelectedCompany(editstate?.CompId)
      if (editstate?.Zip) setZipCodeData(true)
      setSelectedAdmin(editstate?.UserId)
      setSelectedApplication(editstate?.AppId)
      dispatch(getApplicationCompany(editstate?.AppId)).unwrap();
      // dispatch(getUserAppCompany(editstate?.UserId, editstate?.AppId)).unwrap();
      dispatch(getUserAppCompany({"UserId":editstate?.UserId, "AppId":editstate?.AppId})).unwrap();
      setSelectedCompany(editstate?.CompId)

    }

  }, []);
  console.log(SelectedCompany,"editstateeditstate1")

  const selectCompany = async (value) => {
    setDisable(false);
    formRef.current?.setFieldsValue({ CompId: value })
    await setSelectedCompany(value)
    var TrialData =[];
    if (UserType === 'Admin') {
       TrialData= await dispatch(checkTrialBranch({"UserId":UserId, "AppId":SelectedApplication, "CompId":value})).unwrap();
    }
    else{
       TrialData= await dispatch(checkTrialBranch({"UserId":SelectedAdmin, "AppId":SelectedApplication, "CompId":value})).unwrap();
      }
    
    if (TrialData.data.statusCode == 1 && !editstate){
      const Trial=TrialData.data.data[0];
      const Count=TrialData.data.data.length;
      if(Trial)
      {

        if (Trial.PricingName.toUpperCase() != "FREE" && Trial.BranchCount  == 0) {  
        } else if ( Trial.PricingName.toUpperCase() == "FREE" && Trial.BranchCount >= 1
        ) {
          if(Count > 1)
          {
            // alert("hi1")
            setDisable(true);
          }else{
            setDisable(false);
            dispatch(companyname({id: value}))
            setTimeout(function () {
              navigate(
                `${subDirectory}setting/branch-master/`,
                {
                  state: {
                    Notiffy: {
                      messageType: "error",
                      messageData:
                        "Your Trial Period is Expired  Please Choose Extend Pack To Add Branch ",
                    },
                  },
                },
                700
              );
            });
          }
          
        } else if(Trial.PricingName.toUpperCase() != "FREE"){ 
          // JSON.parse('{"name":"John", "age":30, "city":"New York"}')
          
          // let fliterFeatConstraint = Trial .length >0 ?Trial[0]?.FeatureDetails?.filter((a) => a.FeatName === "Branch"? a.FeatConstraint:0):0;
          // console.log(fliterFeatConstraint,'444444444')

          let fliterFeatConstraintdata = Trial?.FeatureDetails?.filter((a) => a.FeatName === "Branch" ? a.FeatConstraint:0);
          let fliterFeatConstraint = fliterFeatConstraintdata.length>0?fliterFeatConstraintdata[0]?.FeatConstraint:0
          
                  if(fliterFeatConstraint > Trial.BranchCount){
                    // alert("hi2")
                    setDisable(false);
                  }
                  else{                       
                    setDisable(false);
                    dispatch(companyname({id: value}))
                    setTimeout(function () {
                      navigate(
                        `${subDirectory}setting/branch-master/`,
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
      Trial=[];
    }
    
   
  }
  

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, [])

  const onFinish = async (values) => {
    let postData = values
    postData["UserId"] = values.UserId || getCookieData('UserId')
    postData["AppId"] = values.AppId
    postData["WorkingFrom"] = fromTime;
    postData["WorkingTo"] = toTime;
    postData["CreatedBy"] = getCookieData('UserId') || 7
    console.log("postData", postData)
    let response = {}
    if (formType === "add") {
      try {
        response = await dispatch(postBranchData(postData)).unwrap()
      } catch (err) {
        // if(err["message"]=="Request failed with status code 422"){
        //   response={data:{"statusCode": 0,
        //   "response": "Please Give Required Fields",
        //   'data': []}}
        // }
      }
    }
    else if (formType === "edit") {
      postData["BrId"] = editstate?.BrId
      postData["AddId"] = editstate?.AddId
      postData["UpdatedBy"] = getCookieData('UserId') || 7
      try {
        response = await dispatch(putBranchData(postData)).unwrap()
      } catch (err) {
        // if (err["message"] == "Request failed with status code 422") {
        //   response = {
        //     data: {
        //       "statusCode": 0,
        //       "response": "Please Give Required Fields",
        //       'data': []
        //     }
        //   }
        // }
      }
    }
    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/branch-master/`, {
        state: {
          Notiffy: {
            messageType: "success",
            messageData: response.data.response,

          }
        }
      })
    } else {
      setMessageType("error")
      setMessageData(response.data.response)
    }
  };

  const getPincodeValues = async (pinCode) => {
    let response = "";
    await fetch(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then((res) => res.text())
      .then((text) => (response = JSON.parse(text)));

    if (response[0]["Status"] === "Success") {
      console.log("getting values", response[0]["PostOffice"][0]["Block"], response[0]["PostOffice"][0]["District"], response[0]["PostOffice"][0]["State"])
      setZipCodeData(true)
      formRef.current?.setFieldsValue({
        City: response[0]["PostOffice"][0]["Block"],
        Dist: response[0]["PostOffice"][0]["District"],
        State: response[0]["PostOffice"][0]["State"],
      });

    } else {
      setZipCodeData(false)
    }
  };

  const onMarkerClick = async (location) => {
    console.log("location3", location.lat(), location.lng())
    setSelectedLatitude(location.lat())
    setSelectedLongitude(location.lng())
    formRef.current?.setFieldsValue({
      Latitude: location.lat(),
      Longitude: location.lng(),
    });
    let mapdata = (formRef.current?.getFieldsValue());
    console.log("mapdata", mapdata["Latitude"], mapdata["Longitude"])
  };
  const pinCodeChange = async (e) => {
    if (e.target.value.length < 6) {
      setZipCodeData(false)
      return false;

    }
    await getPincodeValues(e.target.value);
  };
  const onFromTimeChange = (time, timeString) => {
    const fromTime = moment(timeString, ["h:mm a"]).format("HH:mm:ss");
    setFromTime(fromTime);


  };
  const onToTimeChange = (time, timeString) => {
    const toTime = moment(timeString, ["h:mm a"]).format("HH:mm:ss");
    setToTime(toTime);


  };

  const handleDropDownChange = async (value) => {
    
    console.log('i am in handle changes')
    formRef.current?.setFieldsValue({ UserId: value })
    dispatch(companyname({id: value}))
    setSelectedApplication(null);
    // formRef.current?.setFieldsValue({ AppId: null })
    formRef.current?.resetFields(["AppId"])
    //selectCompany(null);
    await setSelectedAdmin(value)
  };

  const handleApplicationChange = async (value) => {
    formRef.current?.setFieldsValue({ AppId: value })
    // dispatch(getApplicationCompany(value)).unwrap();
    await setSelectedApplication(value)
    var TrialData =[];
    if (UserType === 'Admin') {
      console.log('i am in handle changes - 1')
       TrialData= await dispatch(checkTrialBranch({"UserId":UserId, "AppId":SelectedApplication, "CompId":value})).unwrap();
    }
    else{
      console.log('i am in handle changes - 2')
       TrialData= await dispatch(checkTrialBranch({"UserId":SelectedAdmin, "AppId":SelectedApplication, "CompId":value})).unwrap();
    }
    
    if (TrialData.data.statusCode == 1){
      const Trial=TrialData.data.data[0];
      const Count=TrialData.data.data.length;
      
      if(Trial)
      {
        if (Trial.PricingName.toUpperCase() != "FREE" && Trial.BranchCount  == 0) {
        } else if ( Trial.PricingName.toUpperCase() == "FREE" && Trial.BranchCount >= 1
        ) {
          if(Count > 1)
          {
            // alert("hi")
            setDisable(true);
          }else{
            setDisable(false);
            dispatch(companyname({id: value}))
            setTimeout(function () {
              navigate(
                `${subDirectory}setting/branch-master/`,
                {
                  state: {
                    Notiffy: {
                      messageType: "error",
                      messageData:
                        "Your Trial Period is Expired  Please Choose Extend Pack To Add Branch ",
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
      Trial=[];
    }
    if(UserType=='Admin'){
      dispatch(getUserAppCompany({"UserId":UserId, "AppId":value})).unwrap();
    }else{
      dispatch(getUserAppCompany({"UserId":SelectedAdmin, "AppId":value})).unwrap();
    }
      
  };

  //Yash
  useEffect(() => {
    console.log("SelectedAdmin in useEffect:", SelectedAdmin);
  
    if (SelectedAdmin) {
      // Filter applications based on the selected admin
      const filteredApplications = ApplicationNames.filter((option) => option.UserId === SelectedAdmin);
     setFiltereApplications(filteredApplications);
  
      if (filteredApplications.length === 1) {
        const selectedApplicationId = filteredApplications[0].AppId;
        setSelectedApplication(selectedApplicationId);
        formRef.current?.setFieldsValue({ AppId: selectedApplicationId });

        dispatch(getUserAppCompany({ UserId: SelectedAdmin, AppId: selectedApplicationId })).unwrap();
      } else {
        setSelectedApplication(null);
      }
    } else {
      setFiltereApplications([]);
      setSelectedApplication(null);
    }
  }, [SelectedAdmin, ApplicationNames]);
  
  useEffect(() => {
    console.log("SelectedApplication in useEffect:", SelectedApplication);
  
    if (SelectedApplication) {
      // Filter companies based on the selected application
      const filteredCompanies = Applicationcompany.filter((option) => option.AppId === SelectedApplication);
      setFiltereCompanies(filteredCompanies);
  
      if (filteredCompanies.length === 1) {
        const selectedCompanyId = filteredCompanies[0].CompId;
        setSelectedCompany(selectedCompanyId);
        selectCompany(selectedCompanyId);
       
        
      } else {
        
        // setSelectedCompany(null);
      }
    } else {
      setFiltereCompanies([]);
      // setSelectedCompany(null);
    }
  }, [SelectedApplication, Applicationcompany]);

  useEffect(() => {
    if (UserType === 'Admin') {
      if (ApplicationNames.length === 1) {
        const selectedApplicationId = ApplicationNames[0]?.AppId;
        setSelectedApplication(selectedApplicationId);     
        const UsercompanyId = dispatch(getUserAppCompany({ UserId: UserId, AppId: selectedApplicationId })).unwrap();
        formRef.current?.setFieldsValue({ AppId: selectedApplicationId }); 
        console.log(UsercompanyId,'11111')
        
        // dispatch(getApplicationCompany(selectedApplicationId)).unwrap();
      } else {
        setSelectedApplication(null);
        setFiltereCompanies([]);
        // alert("hier")
        setSelectedCompany(null);
      }
    } else {
      dispatch(getAdminNames()).unwrap();
    }
  }, [UserType, ApplicationNames, UserId]);
  
//Yash
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

  const handleNameChange = (e) => {
    
    const fullName = e.target.value;
    const shortName = generateShortName(fullName);
    formRef.current?.setFieldsValue({ BrShName: shortName });
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

  // useEffect(() => {
  //   if (SelectedApplication) {
  //     // Filter company based on the selected App ID
  //     const filteredCompanies = Applicationcompany.filter(
  //       (option ) => option.AppId === SelectedApplication
  //     );
  //     setFiltereCompanies(filteredCompanies);
  //   } else {
  //     setFiltereCompanies([]);
  //   }
  // }, [SelectedApplication, Applicationcompany]);

  return (
    <div className='pageOverAll'>
      <div className='userPage'>
        <div className='userPageContent'>
          <Messages messageType={messageType} messageData={messageData} onComplete={onComplete} />
          <div className="formName">
            <FormHeader title={'Branch'} />
          </div>
          <div className='formDiv'>
            <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
              <div className='formDivS'>
                <div className='inputForm'>
                  {UserType === 'Super Admin' || UserType === 'Super Admin User' ?
                    <Form.Item
                      name="UserId"
                      rules={[
                        {
                          required: true,
                          message:"Please Select Admin"
                        },
                      ]}
                      
                    >
                      <DropDowns
                        options={AdminNames?.map((option) => ({
                          value: option.UserId,
                          label: option?.UserName ? option?.UserName : option.MobileNo,
                        }))}
                        placeholder="UserId"
                        label="Admin Name"
                        className="field-DropDown"
                        isOnchanges={(formType == "edit" || SelectedAdmin)?true:false}
                        onChangeFunction={handleDropDownChange}
                        valueData={SelectedAdmin}
                        disabled={formType == "edit" ? true : false}
                      />
                    </Form.Item>
                    : null
                  }
                  {UserType === 'Super Admin' || UserType === 'Super Admin User' ? (
                    <Form.Item
                      name="AppId"
                      rules={[
                        {
                          required: true,
                          message:"Please Select Application"
                        },
                      ]}
                      // hasFeedback
                    >
                      {console.log(SelectedApplication,"SelectedApplicationSelectedApplication")}
                      <DropDowns
                        options={FiltereApplications?.map((option) => ({
                          value: option.AppId,
                          label: option.AppName,
                        }))}
                        placeholder="AppId"
                        label="Application Name"
                        className="field-DropDown"
                        isOnchanges={(formType == "edit" || SelectedApplication)?true:false}
                        onChangeFunction={handleApplicationChange}
                        valueData={SelectedApplication}
                        disabled={formType == "edit" ? true : false}                        
                      />
                    </Form.Item>
                  ) : (<Form.Item
                    name="AppId"
                    rules={[
                      {
                        required: true,
                        message:"Please Select Application"
                      },
                    ]}
                    // hasFeedback
                  >
                    <DropDowns
                      options={ApplicationNames?.map((option) => ({
                        value: option.AppId,
                        label: option.AppName,
                      }))}
                      placeholder="AppId"
                      label="Application Name"
                      className="field-DropDown"
                      isOnchanges={(formType == "edit" ||SelectedApplication)?true:false}
                      onChangeFunction={handleApplicationChange}
                      valueData={SelectedApplication}
                      disabled={formType == "edit" ? true : false}
                    />
                  </Form.Item>
                  )
                  }
                  <Form.Item
                    name="CompId"
                    // hasFeedback
                    rules={[
                      {
                        required: true,
                        message:"Please Select Organization"
                      },
                    ]}
                  >
                    <DropDowns
                      options={Applicationcompany?.map((option) => ({
                        value: option.CompId,
                        label: option.CompName,
                      }))}
                      placeholder="CompId"
                      label="Organization Name"
                      className='field-DropDown'
                      isOnchanges={(formType == "edit" || SelectedCompany)?true:false}
                      onChangeFunction={selectCompany}
                      valueData={SelectedCompany}
                      disabled={formType == "edit" ? true : false} 
                    />
                  </Form.Item>
                  <Form.Item
                    name="BrName"
                    
                    rules={[
                      {
                        required: true,
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Branch Name"
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
                      field="BrName"
                      autoComplete="off"
                      label="Branch Name"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}
                      onChange={handleNameChange}
                     
                    />
                  </Form.Item>

                  <Form.Item
                    name="BrShName"
                    
                    rules={[
                      {
                        required: true,
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Short Name"

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
                      field="BrShName"
                      autoComplete="off"
                      label="Short Name"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" || selectShortName ? true : false}
                      

                    />
                  </Form.Item>
                  <Form.Item
                    name="BrMobile"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: 'Enter a Valid MobileNo',
                      },
                    ]}
                  >
                    <InputField
                      field="BrMobile"
                      label="Mobile"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="10"
                      autoComplete={"nope"}
                      isOnChange={formType == "edit" ? true : false}

                    />
                  </Form.Item>
                  <Form.Item
                    name="BrEmail"
                    rules={[
                      {
                        // pattern: /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/,
                        pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Enter a valid email address',
                      },
                    ]}
                  // hasFeedback
                  // rules={[
                  //   {
                  //     validator: (_, value) => {

                  //       if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                  //         return Promise.resolve();
                  //       } else {
                  //         return Promise.reject('Please Enter Valid Email');
                  //       }

                  //     },

                  //   },
                  // ]}
                  >
                    <InputField
                      field="BrEmail"
                      autoComplete={"nope"}
                      label="Email"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}

                    />
                  </Form.Item>

                  <Form.Item
                    name="BrRegnNo"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Registration.No",
                      }]}
                    >
                    <InputField
                      field="BrRegnNo"
                      autoComplete="off"
                      label="Registration.No"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}

                    />
                  </Form.Item>

                  <Form.Item
                    name="BrGSTIN"
                    rules={[
                      {
                        pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/,
                        message: 'Enter a valid GSTIN',
                      },
                    ]}
                  
                  >
                    <InputField
                      field="BrGSTIN"
                      autoComplete="off"
                      label="GST"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}

                    />
                  </Form.Item>
                  <Form.Item
                    name="BrInCharge"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message: "Please Enter Incharge",
                      }]}
                    >
                    <InputField
                      field="BrInCharge"
                      autoComplete="off"
                      label="Incharge"
                      fieldState={true}
                      fieldApi={true}
                      isOnChange={formType == "edit" ? true : false}

                    />
                  </Form.Item>
                  <Form.Item
                    name="WorkingFrom"

                    >
                    <TimePickers
                      label="Working From"
                      isOnChange={true}
                      onChange={onFromTimeChange}
                      valueData={fromTime}
                    />

                  </Form.Item>
                  <Form.Item
                    name="WorkingTo"

                    >
                    <TimePickers
                      label="Working To"
                      isOnChange={true}
                      onChange={onToTimeChange}
                      valueData={toTime}
                    />
                  </Form.Item>

                </div>

                <div className="formAddressDiv">
                  <p> Address Details</p>
                </div>
                <div className='subinputForm'>

                  <div>
                    <Form.Item
                      name="Address1"
                      
                      rules={[
                        {
                          required: formType == "edit" ? false : true,
                          pattern:/^(?!\s*$).+/,
                          message:"Please Enter Address1"

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
                    <Form.Item
                      name="Address2"
                      rules={[
                        {
                          
                          pattern:/^(?!\s*$).+/,
                          message:"Please Enter Address2"

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
                          required: formType == "edit" ? false : true,
                          pattern:/^(?!\s*$).+/,
                          message:"Please Enter Zipcode"


                        },
                        // {
                        //   validator: (_, value) => {
                        //     if (/(^\d{6}$)|(^\d{5}-\d{4}$)/.test(value)) {
                        //       return Promise.resolve();
                        //     } else {
                        //       return Promise.reject();
                        //     }
                        //   },

                        // },
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
                    {zipCodeData ?
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
                      : ""}

                    <Form.Item
                      name="Latitude"
                      rules={[
                        {
                          
                          pattern: /^(?!\s*$).+/,
                          message:"Please Enter Latitude"
                        },
                      ]}
                      >
                      <InputField
                        field="Latitude"
                        label="Latitude"
                        isOnChange={SelectedLatitude || editstate?.Latitude ? true :false}
                        fieldState={true}
                        fieldApi={true}
                        autoComplete="off"

                      />
                    </Form.Item>
                    <Form.Item
                      name="Longitude"
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
                        isOnChange={SelectedLongitude || editstate?.Longitude ? true :false}
                        fieldState={true}
                        fieldApi={true}
                        autoComplete="off"

                      />
                    </Form.Item>
                  </div>





                  <div className="MapDiv"
                  >
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



                </div>

              </div>


              <div className='submitButton'>
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                  htmlType={true}
                  disabled={disable}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchForm;

