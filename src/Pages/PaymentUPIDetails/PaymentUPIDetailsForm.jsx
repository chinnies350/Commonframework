import { useState, useEffect, useRef,useCallback } from 'react';
import { useDispatch,useSelector } from 'react-redux'
import {useLocation, useNavigate } from 'react-router-dom';
import { Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { DropDowns } from '../../Components/Forms/DropDown.jsx';
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import { getCookieData } from "../../Services/others";
import {getAdminNames, AdminNamesSelector, getActiveCompanyData,companyActiveDataSelector} from "../../features/companyPage/companyPage.js";
import { getCmpanyBranch, CmpanyBranchDataSelector,postPaymentUpiDetails,putPaymentUpiDetails,getPricingMode } from '../../features/paymentUPIdetails/paymentUPIdetails.js';
import "../../Components/Forms/main.scss";

const subDirectory = import.meta.env.ENV_BASE_URL




const PaymentUPIDetailsForm = ({formType}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formRef = useRef(null);
  const state = location?.state
  const editstate = state?.editstate

  const AdminNames=useSelector(AdminNamesSelector)
  const companyNames = useSelector(companyActiveDataSelector)
  const branchNames = useSelector(CmpanyBranchDataSelector)

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [SelectedAdmin, setSelectedAdmin] = useState(null);
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [SelectedBranch, setSelectedBranch] = useState(null);
  const [FiltereCompanies, setFiltereCompanies] = useState([]);
  const [FiltereBranches, setFiltereBranches] = useState([]);
  const [selectedOption, setSelectedOption] = useState('SA');
  const [PaymentMode, setPaymentMode] = useState([]);
  const [SelectedMode, setSelectedMode] = useState(null);

  

  const [UserId, setUserId] = useState(null);
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  useEffect(() => {
    if(companyNames?.length===1){
      selectCompany(companyNames[0]?.CompId)

    }

    
  }, [companyNames]);

  useEffect(() => {
    if(FiltereBranches?.length===1){
       selectBranch(FiltereBranches[0]?.BrId)
    }

  }, [branchNames,FiltereBranches]);


  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "PaymentUPIDetails",
      link: `${subDirectory}setting/PaymentUPIDetails/`,
    },
    {
      name:  editstate ? "Edit" : "New",
      link: editstate ? `${subDirectory}setting/PaymentUPIDetails/update` : `${subDirectory}setting/PaymentUPIDetails/new`,
    },
  
  ];

  useEffect(() => {
    if(UserType==='Admin'){
      const AdminId=getCookieData("UserId") ? parseInt(getCookieData("UserId")) : null
      setUserId(AdminId);
      setSelectedOption('A')
    }
    else{
      setSelectedOption('SA')
    }
  }, []);

  // getPricingMode

  useEffect(() => {
    getPricingModedata()

  },[])

  const getPricingModedata = async()=>{
    let response=await dispatch(getPricingMode()).unwrap();
    if (response?.data?.statusCode === 1){
      console.log(response?.data.data,"mohantest1",response?.data?.data.length===1?response?.data?.data[0]?.ConfigId:null)
      if(response?.data?.data.length===1){
        setSelectedMode(response?.data?.data.length===1?response?.data?.data[0]?.ConfigId:null)
        formRef.current?.setFieldsValue({mode:response?.data?.data.length===1?response?.data?.data[0]?.ConfigId:null})
        }
      setPaymentMode(response?.data?.data)
    }

  }
  


  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    dispatch(getAdminNames()).unwrap();
    if (editstate) {
      setSelectedAdmin(editstate?.UserId)
      setSelectedCompany(editstate?.CompId)
      setSelectedBranch(editstate?.BrId)
      setSelectedMode(editstate?.mode)
      dispatch(getActiveCompanyData(editstate?.UserId)).unwrap();
      dispatch(getCmpanyBranch(editstate?.CompId)).unwrap();
    } 
    if (UserType === "Admin") {
      const adminUserId = getCookieData("UserId") ? parseInt(getCookieData("UserId")) : null;
      formRef.current?.setFieldsValue({UserId:adminUserId})
      if (adminUserId) {
        setSelectedAdmin(adminUserId);
        dispatch(getActiveCompanyData(adminUserId)).unwrap();
      }
    }
  }, []);

  const onFinish = async (values) => {
    console.log('values',values)
    let postData=values
    
    if (UserType == 'Admin'){
      postData["UserId"] = getCookieData('UserId')
    }else postData["UserId"] = values.UserId
    postData["CreatedBy"] = getCookieData('UserId') || 7
    let response={}
    if (formType === "add") {if (selectedOption === 'SA' && UserType != 'Admin') {
      postData["type"] = 'I';
    } else {
      postData["type"] = 'O';
    }
        try{
          response=await dispatch(postPaymentUpiDetails(postData)).unwrap()
        }
        catch(err){
          if(err["message"]=="Request failed with status code 422"){
            response={data:{"statusCode": 0,
            "response": "Please Give Required Fields",
            'data': []}}
          }
        }
       
    }
    else if(formType === "edit"){
      if (editstate) {
        postData["AdminId"] = editstate?.UserId;
        postData["CompId"] = editstate?.CompId;
        postData["BranchId"] = editstate?.BrId;
        postData["type"] = editstate?.type;
        // if (editstate?.CompId != 'null' && selectedOption === 'SA' && UserType != 'Admin') {
        //   postData["type"] = 'I';
        // } else {
        //   postData["type"] = 'O';
        // }
      }
      
      postData["PaymentUPIDetailsId"] = editstate?.PaymentUPIDetailsId
      postData["UpdatedBy"] = getCookieData('UserId') || 7
      try{
          response=await dispatch(putPaymentUpiDetails(postData)).unwrap()
      }catch(err){
        if(err["message"]=="Request failed with status code 422"){
          response={data:{"statusCode": 0,
          "response": "Please Give Required Fields",
          'data': []}}
        }
      }
    }
    console.log("response",response)
    if (response.data.statusCode == 1){
      navigate(`${subDirectory}setting/PaymentUPIDetails/`, {state: {Notiffy: {
                    messageType: "success",
                    messageData: response.data.response,
                    
              }}
    })
  }else{
    setMessageType("error")
    setMessageData(response.data.response)
  }
  };
  

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])


  const handleOptionChange = async(event) => {
    setSelectedOption(event);
    if(event==='A'){
      // if(AdminNames)
      console.log(AdminNames,"AdminNamesAdminNames")
      if(AdminNames?.length===1){
        await handleDropDownChange(AdminNames[0]?.UserId)
      }
      

    }
    formRef.current?.resetFields();
  };

  const handleDropDownChange = async(value) => {   
    formRef.current?.setFieldsValue({UserId:value})
    await dispatch(getActiveCompanyData(value)).unwrap();
    setUserId(value);
    setSelectedCompany(null);
    setSelectedBranch(null);
    await setSelectedAdmin(value)
    // if(companyNames?.length===1){
    //   await selectCompany(companyNames[0]?.CompId)
    // }
  };

  const selectCompany = async(value)=>{
    formRef.current?.setFieldsValue({CompId:value})
    await dispatch(getCmpanyBranch(value)).unwrap();
    setSelectedBranch(null);
    await setSelectedCompany(value)
    // if(branchNames?.length===1){
    //   await selectBranch(branchNames[0]?.BrId)
    // }
  }
  const selectPaymentMode = async(value)=>{
    formRef.current?.setFieldsValue({mode:value})
    setSelectedMode(value)
  
  }

  const selectBranch = async(value)=>{
    console.log(value,"valuevalue")
    formRef.current?.setFieldsValue({BrId:value})
    await setSelectedBranch(value)
  }

  useEffect(() => {
    if (SelectedAdmin) {
      // Filter company based on the selected User ID
      console.log(companyNames,"companyNamescompanyNames",SelectedAdmin)
    
      const filteredCompanies = companyNames.filter(
        (option ) => option.AdminId === SelectedAdmin
      );
      console.log(filteredCompanies,"/////////////////////////////")
      setFiltereCompanies(filteredCompanies);
    } else {
      setFiltereCompanies([]);
    }
  }, [SelectedAdmin, companyNames]);

  useEffect(() => {
    if (SelectedCompany) {
      // Filter company based on the selected User ID
      const filteredBranches = branchNames.filter(
        (option ) => option.CompId === SelectedCompany
      );
      setFiltereBranches(filteredBranches);
  
    } else {
      setFiltereBranches([]);
    }
  }, [SelectedCompany, branchNames]);

  useEffect(() => {
    console.log("SelectedAdmin in useEffect:", SelectedAdmin);


    
  },[SelectedCompany]);

 

  
  return (
    <div className='pageOverAll'>
    <div className='userPage'>
      <div className='userPageContent'>
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
        <div className="formName">
          <FormHeader title={'Payment UPI Details'} />
        </div>
        <div className='formDiv'>
          <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
            {/* <div > */}
            {!editstate && UserType === 'Super Admin' || UserType === 'Super Admin User' ? (
            <div className="radio-buttons">
              <RadioGrpButton
                content={[
                  { value: "SA", label: "Super Admin" },
                  { value: "A", label: "Admin" },
                ]}
                fieldState={true}
                Header="Roles"
                onSelectFuntion={handleOptionChange}
                defaultSelect= 'SA'
                
              />
            </div>
            ):null}

            {/* Render content based on the selected option */}
            
              <div className='formDivS'>
              <div className='inputForm'>
                { selectedOption ==='A' || editstate?.type==='O' ?(
                  <Form.Item
                  name="UserId"
                  rules={[
                    {
                      required: true,
                      message:  "Select Admin Name ",
                    },
                  ]}
                  
                >
                  <DropDowns
                    options={AdminNames?.map((option) => ({
                      value: option.UserId,
                      label: option?.UserName?option?.UserName:option.MobileNo,
                    }))}
                    placeholder="UserId"
                    label="Admin Name"
                    className="field-DropDown"
                    isOnchanges={(formType === "edit" || (UserType === "Admin" && selectedOption === "A")) ? true : UserId ? parseInt(UserId) : false}
                    onChangeFunction={handleDropDownChange}
                    // valueData={SelectedAdmin}
                    valueData={
                      (formType === "edit" || (UserType === "Admin" && selectedOption === "A")) ? SelectedAdmin : UserId ? parseInt(UserId) : null
                    }
                    // disabled={formType == "edit" ? true : false}
                    disabled={
                      formType === "edit" ||
                      (UserType === "Admin" && selectedOption === "A")
                        ? true
                        : false
                    }
                  />
                  </Form.Item>
                ):null
                }

                { selectedOption ==='A' || editstate?.type==='O' ? (
                    <Form.Item
                    name="CompId"
                    
                    rules={[
                      {
                        required: true,
                        message:  "Select Organization Name ",
                      },
                    ]}
                  >
                    <DropDowns
                      options={FiltereCompanies?.map((option) => ({
                        value: option.CompId,
                        label: option.CompName,
                      }))}
                      placeholder="CompId"
                      label="Organization Name"
                      className='field-DropDown'
                      isOnchanges={(formType == "edit" ||SelectedCompany)?true:false}
                      onChangeFunction={selectCompany}
                      valueData={SelectedCompany}
                      disabled={formType == "edit" ? true :false}
                    />
                    </Form.Item>
                   ):null
                  }

                  { selectedOption ==='A' || editstate?.type==='O'  ? (
                    <Form.Item
                    name="BrId"
                    
                    rules={[
                      {
                        required: true,
                        message:  "Select Branch Name ",
                      },
                    ]}
                  >
             
                    <DropDowns
                      options={FiltereBranches?.map((option) => ({
                        value: option.BrId,
                        label: option.BrName,
                      }))}
                      placeholder="BranchId"
                      label="Branch Name"
                      className='field-DropDown'
                      isOnchanges={(formType == "edit" || SelectedBranch)?true:false}
                      onChangeFunction={selectBranch}
                      valueData={SelectedBranch}
                      disabled={formType == "edit" ? true :false}
                    />
                    </Form.Item>):null
                }
                
              <Form.Item
                  name="Name"
                  rules={[
                    {
                      
                      pattern:/^(?!\s*$).+/,
                      message:"Please Enter Name"
                    }]}
                  // hasFeedback
                >
                  <InputField
                    field="Name"
                    autoComplete="off"
                    label="Name"
                    fieldState={true}
                    fieldApi={true}
                    isOnChange={formType == "edit" ? true :false}

                  />
              </Form.Item>
              <Form.Item
                    name="MobileNo"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: 'Enter a Valid MobileNo',
                        required: true,
                      },
                    ]}
                  
                  >
                    <InputField
                      field="MobileNo"
                      label="Mobile Number"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="10"
                      // type="number"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              <Form.Item
                    name="UPIId"
                    rules={[
                      {
                        pattern: /[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}/,
                        message: 'Enter a Valid UpiId',
                        required: true,
                      },
                    ]}
                  
                  >
                    <InputField
                      field="UPIId"
                      label="UPI Id"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="30"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}
                      disabled={formType == "edit" ? true :false}
                    />
              </Form.Item>
              <Form.Item
                    name="MerchantCode"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Merchant Code"
                      }]}
                  >
                    <InputField
                      field="MerchantCode"
                      label="Merchant Code"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="50"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              <Form.Item
                    name="MerchantId"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Merchant Id"
                      }]}
                  >
                    <InputField
                      field="MerchantId"
                      label="Merchant Id"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="10"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              {/* <Form.Item
                    name="mode"
                  >
                    <InputField
                      field="mode"
                      label="Mode"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="15"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item> */}
              <Form.Item
                    name="mode"
                    
                    rules={[
                      {
                        required: true,
                        message:"Select Payment Mode "
                      },
                    ]}
                  >
                    <DropDowns
                      options={PaymentMode?.map((option) => ({
                        value: option.ConfigId,
                        label: option.ConfigName,
                      }))}
                      field="mode"
                      placeholder="Mode"
                      label="Payment Mode"
                      className='field-DropDown'
                      isOnchanges={(formType == "edit" || SelectedMode )? true:false}
                      onChangeFunction={selectPaymentMode}
                      valueData={SelectedMode ? parseInt(SelectedMode):null}
                      disabled={formType == "edit" ? true :false}
                    />
                    </Form.Item>
              <Form.Item
                    name="orgid"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Org Id"
                      }]}
                  >
                    <InputField
                      field="orgid"
                      label="Org Id"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="15"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              <Form.Item
                    name="sign"
                    rules={[
                      {
                        
                        pattern:/^(?!\s*$).+/,
                        message:"Please Enter Sign"
                      }]}
                  >
                    <InputField
                      field="sign"
                      label="Sign"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="100"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              <Form.Item
                    name="url"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Please enter a valid URL');
                          }
                        },
                      },
                    ]}
                  >
                    <InputField
                      field="url"
                      label="Url"
                      fieldState={true}
                      fieldApi={true}
                      maxLength="100"
                      autoComplete="off"
                      isOnChange={formType == "edit" ? true :false}

                    />
              </Form.Item>
              </div>
              <div className='submitButton'>
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                //   handleSubmit={handleSubmit}
                />
              </div>
              </div>                         
          </Form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default PaymentUPIDetailsForm;

















// import { useState, useEffect, useRef,useCallback } from 'react';
// import { useDispatch,useSelector } from 'react-redux'
// import {useLocation, useNavigate } from 'react-router-dom';
// import { Form } from "antd";
// import { ArrowRightOutlined } from "@ant-design/icons";
// import { InputField } from "../../Components/Forms/InputField.jsx";
// import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
// import Buttons from "../../Components/Forms/Buttons.jsx";
// import { DropDowns } from '../../Components/Forms/DropDown.jsx';
// import { Messages } from "../../Components/Notifications/Messages";
// import FormHeader from '../pageComponents/FormHeader.jsx';
// import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
// import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
// import { getCookieData } from "../../Services/others";
// import {getAdminNames, AdminNamesSelector, getActiveCompanyData,companyActiveDataSelector} from "../../features/companyPage/companyPage.js";
// import { getCmpanyBranch, CmpanyBranchDataSelector,postPaymentUpiDetails,putPaymentUpiDetails } from '../../features/paymentUPIdetails/paymentUPIdetails.js';
// import "../../Components/Forms/main.scss";

// const subDirectory = import.meta.env.ENV_BASE_URL




// const PaymentUPIDetailsForm = ({formType}) => {

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const formRef = useRef(null);
//   const state = location?.state
//   const editstate = state?.editstate

//   const AdminNames=useSelector(AdminNamesSelector)

//   const companyNames = useSelector(companyActiveDataSelector)

//   const branchNames = useSelector(CmpanyBranchDataSelector)

//   const [messageType, setMessageType] = useState(null);
//   const [messageData, setMessageData] = useState(null);
//   const [SelectedAdmin, setSelectedAdmin] = useState(null);
//   const [SelectedCompany, setSelectedCompany] = useState(null);
//   const [SelectedBranch, setSelectedBranch] = useState(null);
//   const [FiltereCompanies, setFiltereCompanies] = useState([]);
//   const [FiltereBranches, setFiltereBranches] = useState([]);
//   const [selectedOption, setSelectedOption] = useState('SA');

//   const [UserType, setUserType] = useState(
//     getCookieData("UserType") ? getCookieData("UserType") : null
//   );

//   const items = [
//     {
//       name: "Home",
//       link: `${subDirectory}setting/`,
//     },
  
//     {
//       name: "PaymentUPIDetails",
//       link: `${subDirectory}setting/PaymentUPIDetails/`,
//     },
//     {
//       name:  editstate ? "Edit" : "New",
//       link: editstate ? `${subDirectory}setting/PaymentUPIDetails/update` : `${subDirectory}setting/PaymentUPIDetails/new`,
//     },
  
//   ];

//   useEffect(() => {
//     if(UserType==='Admin'){
//       setSelectedOption('A')
//     }
//     else{
//       setSelectedOption('SA')
//     }
//   }, []);
  


//   useEffect(() => {
//     dispatch(changeBreadCrumb({ items: items }));
//     dispatch(getAdminNames()).unwrap();
//     if (editstate) {
//       setSelectedAdmin(editstate?.UserId)
//       setSelectedCompany(editstate?.CompId)
//       setSelectedBranch(editstate?.BrId)
//       dispatch(getActiveCompanyData(editstate?.UserId)).unwrap();
//       dispatch(getCmpanyBranch(editstate?.CompId)).unwrap();
//     } 
//   }, []);

//   const onFinish = async (values) => {
//     console.log('values',values)
//     let postData=values
//     if (selectedOption === 'SA') {
//       postData["type"] = 'I';
//     } else {
//       postData["type"] = 'O';
//     }
//     postData["CreatedBy"] = getCookieData('UserId') || 7
//     let response={}
//     if (formType === "add") {
//         try{
//           response=await dispatch(postPaymentUpiDetails(postData)).unwrap()
//         }
//         catch(err){
//           if(err["message"]=="Request failed with status code 422"){
//             response={data:{"statusCode": 0,
//             "response": "Please Give Required Fields",
//             'data': []}}
//           }
//         }
       
//     }
//     else if(formType === "edit"){
//       if (editstate) {
//         postData["AdminId"] = editstate?.UserId;
//         postData["CompId"] = editstate?.CompId;
//         postData["BranchId"] = editstate?.BrId;
//         if (selectedOption === 'SA') {
//           postData["type"] = 'I';
//         } else {
//           postData["type"] = 'O';
//         }
//       }
      
//       postData["PaymentUPIDetailsId"] = editstate?.PaymentUPIDetailsId
//       postData["UpdatedBy"] = getCookieData('UserId') || 7
//       try{
//           response=await dispatch(putPaymentUpiDetails(postData)).unwrap()
//       }catch(err){
//         if(err["message"]=="Request failed with status code 422"){
//           response={data:{"statusCode": 0,
//           "response": "Please Give Required Fields",
//           'data': []}}
//         }
//       }
//     }
//     console.log("response",response)
//     if (response.data.statusCode == 1){
//       navigate(`${subDirectory}setting/PaymentUPIDetails/`, {state: {Notiffy: {
//                     messageType: "success",
//                     messageData: response.data.response,
                    
//               }}
//     })
//   }else{
//     setMessageType("error")
//     setMessageData(response.data.response)
//   }
//   };
  

//   const onComplete = useCallback(() => {
//     setMessageData(null);
//     setMessageType(null);
    
    
//   }, [])


//   const handleOptionChange = (event) => {
//     setSelectedOption(event);
//     formRef.current?.resetFields();
//   };

//   const handleDropDownChange = async(value) => {   
//     formRef.current?.setFieldsValue({UserId:value})
//     dispatch(getActiveCompanyData(value)).unwrap();
//     setSelectedCompany(null);
//     setSelectedBranch(null);
//     await setSelectedAdmin(value)
//   };

//   const selectCompany = async(value)=>{
//     formRef.current?.setFieldsValue({CompId:value})
//     dispatch(getCmpanyBranch(value)).unwrap();
//     setSelectedBranch(null);
//     await setSelectedCompany(value)
//   }

//   const selectBranch = async(value)=>{
//     formRef.current?.setFieldsValue({BrId:value})
//     await setSelectedBranch(value)
//   }

//   useEffect(() => {
//     if (SelectedAdmin) {
//       // Filter company based on the selected User ID
//       const filteredCompanies = companyNames.filter(
//         (option ) => option.UserId === SelectedAdmin
//       );
//       setFiltereCompanies(filteredCompanies);
//     } else {
//       setFiltereCompanies([]);
//     }
//   }, [SelectedAdmin, companyNames]);

//   useEffect(() => {
//     if (SelectedCompany) {
//       // Filter company based on the selected User ID
//       const filteredBranches = branchNames.filter(
//         (option ) => option.CompId === SelectedCompany
//       );
//       setFiltereBranches(filteredBranches);
//     } else {
//       setFiltereBranches([]);
//     }
//   }, [SelectedCompany, branchNames]);

  
//   return (
//     <div className='pageOverAll'>
//     <div className='userPage'>
//       <div className='userPageContent'>
//       <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
//         <div className="formName">
//           <FormHeader title={'Payment UPI Deatils'} />
//         </div>
//         <div className='formDiv'>
//           <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
//             {/* <div > */}
//             {!editstate && UserType === 'Super Admin' || UserType === 'Super Admin User' ? (
//             <div className="radio-buttons">
//               <RadioGrpButton
//                 content={[
//                   { value: "SA", label: "Super Admin" },
//                   { value: "A", label: "Admin" },
//                 ]}
//                 fieldState={true}
//                 Header="Roles"
//                 onSelectFuntion={handleOptionChange}
//                 defaultSelect= 'SA'
                
//               />
//             </div>
//             ):null}

//             {/* Render content based on the selected option */}
            
//               <div className='formDivS'>
//               <div className='inputForm'>
//                 { selectedOption ==='A' || editstate?.type==='O' ?(
//                   <Form.Item
//                   name="UserId"
//                   rules={[
//                     {
//                       required: true,
//                     },
//                   ]}
//                   hasFeedback
//                 >
//                   <DropDowns
//                     options={AdminNames?.map((option) => ({
//                       value: option.UserId,
//                       label: option?.UserName?option?.UserName:option.MobileNo,
//                     }))}
//                     placeholder="UserId"
//                     label="Admin Name"
//                     className="field-DropDown"
//                     isOnchanges={true}
//                     onChangeFunction={handleDropDownChange}
//                     valueData={SelectedAdmin}
//                     disabled={formType == "edit" ? true : false}
//                   />
//                   </Form.Item>
//                 ):null
//                 }

//                 { selectedOption ==='A' || editstate?.type==='O' ? (
//                     <Form.Item
//                     name="CompId"
//                     hasFeedback
//                     rules={[
//                       {
//                         required: true,
//                       },
//                     ]}
//                   >
//                     <DropDowns
//                       options={FiltereCompanies?.map((option) => ({
//                         value: option.CompId,
//                         label: option.CompName,
//                       }))}
//                       placeholder="CompId"
//                       label="Company Name"
//                       className='field-DropDown'
//                       isOnchanges={true}
//                       onChangeFunction={selectCompany}
//                       valueData={SelectedCompany}
//                       disabled={formType == "edit" ? true :false}
//                     />
//                     </Form.Item>
//                    ):null
//                   }

//                   { selectedOption ==='A' || editstate?.type==='O'  ? (
//                     <Form.Item
//                     name="BrId"
//                     hasFeedback
//                     rules={[
//                       {
//                         required: true,
//                       },
//                     ]}
//                   >
//                     <DropDowns
//                       options={FiltereBranches?.map((option) => ({
//                         value: option.BrId,
//                         label: option.BrName,
//                       }))}
//                       placeholder="BranchId"
//                       label="Branch Name"
//                       className='field-DropDown'
//                       isOnchanges={true}
//                       onChangeFunction={selectBranch}
//                       valueData={SelectedBranch}
//                       disabled={formType == "edit" ? true :false}
//                     />
//                     </Form.Item>):null
//                 }
                
//               <Form.Item
//                   name="Name"
//                   // hasFeedback
//                 >
//                   <InputField
//                     field="Name"
//                     autoComplete="off"
//                     label="Name"
//                     fieldState={true}
//                     fieldApi={true}
//                     isOnChange={formType == "edit" ? true :false}

//                   />
//               </Form.Item>
//               <Form.Item
//                     name="MobileNo"
//                   >
//                     <InputField
//                       field="MobileNo"
//                       label="Mobile Number"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="10"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="UPIId"
//                   >
//                     <InputField
//                       field="UPIId"
//                       label="UPI Id"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="30"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="MerchantCode"
//                   >
//                     <InputField
//                       field="MerchantCode"
//                       label="Merchant Code"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="50"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="MerchantId"
//                   >
//                     <InputField
//                       field="MerchantId"
//                       label="Merchant Id"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="10"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="mode"
//                   >
//                     <InputField
//                       field="mode"
//                       label="Mode"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="15"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="orgid"
//                   >
//                     <InputField
//                       field="orgid"
//                       label="Org Id"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="15"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="sign"
//                   >
//                     <InputField
//                       field="sign"
//                       label="Sign"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="100"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               <Form.Item
//                     name="url"
//                     rules={[
//                       {
//                         validator: (_, value) => {
//                           if (!value || /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/.test(value)) {
//                             return Promise.resolve();
//                           } else {
//                             return Promise.reject('Please enter a valid URL');
//                           }
//                         },
//                       },
//                     ]}
//                   >
//                     <InputField
//                       field="url"
//                       label="Url"
//                       fieldState={true}
//                       fieldApi={true}
//                       maxLength="100"
//                       autoComplete="off"
//                       isOnChange={formType == "edit" ? true :false}

//                     />
//               </Form.Item>
//               </div>
//               <div className='submitButton'>
//                 <Buttons
//                   buttonText="SUBMIT"
//                   color="901D77"
//                   icon={<ArrowRightOutlined />}
//                 //   handleSubmit={handleSubmit}
//                 />
//               </div>
//               </div>                         
//           </Form>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }

// export default PaymentUPIDetailsForm;

