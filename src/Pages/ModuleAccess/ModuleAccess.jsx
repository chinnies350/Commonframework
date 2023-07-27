import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from "../pageComponents/FormHeader.jsx";
import "./ModuleAccess.scss";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
 

import {
  selectedAppIdSelector,
  selectedBranchIdSelector,
  selectedStoreSelector,
  selectRoleSelector,
  getSadminUser,
  getBranchAdmin,
  emptySelectedIds,
  gettingAdminSelector,
  gettingAdminDropDown,
  getstoreData,
  changeUserId,
  changeUser,
  postModuleRights,
  postBranchModuleRights,
  deleteModuleRights,
  deleteBranchModuleRights,
  emptyPostData,
  gettingPostDataValue,
  changeApp,
  changeStore,
  changeBranch,
  emptySelectedModuleBranch
} from "../../features/ModuleAccess/moduleAccessSlice";

import { getCookieData } from "../../Services/others";
import UserRoles from "./UserRoles";
import StoreDropDown from "./storeDropDown";
import AppDropDown from "./AppDropDown";
import ModuleAccessUserBased from "./ModuleAccessUserBased";
import UserDropDown from "./UserDropDown";
import BranchDropDown from "./BranchDropDown";
import Companys from "./ModuleAccessCompanys.jsx"
import CompanyBranch from "./ModuleAccessBranches.jsx" 
import ModuleApp from './ModuleAccessApp.jsx'
import { Form } from "antd";

const subDirectory = import.meta.env.BASE_URL;


const ModuleAccess = () => {
  const dispatch = useDispatch();
  const selectedRole = useSelector(selectRoleSelector);
  const storeId = useSelector(selectedStoreSelector);
  const BranchId = useSelector(selectedBranchIdSelector);
  const AppId = useSelector(selectedAppIdSelector);
  const AdminDropDown = useSelector(gettingAdminSelector);
  const PostDataValues = useSelector(gettingPostDataValue);
 
  const [UserId, setUserId] = useState(null);
  const [companyAdminId, setCompanyAdminId] = useState(null);
  const [branchAdminId, setBranchAdminId] = useState(null);
  const [SelectedCompanyAdmin, setSelectedCompanyAdmin] = useState(null);
  const [SelectedBranchAdmin, setSelectedBranchAdmin] = useState(null);
  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );
  // const [postDataValues, setPostDataValues]=useState(null);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  
  const [form] = Form.useForm();

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "AppAccess",
      link: `${subDirectory}setting/app-access`,
    },
  ];
  console.log(selectedRole, storeId, BranchId, UserId,"123456789")
  useEffect(() => {
    try {
      if (UserType === "Admin") {
        let cookieUserId = getCookieData("UserId") ?? null
        console.log('got cookie id', cookieUserId)
        // setUserId(
        //   getCookieData("UserId") ? parseInt(getCookieData("UserId")) : null
        // );
        if(selectedRole=="Company Admin"){
          console.log("setCompanyAdminId",cookieUserId)
          setCompanyAdminId(cookieUserId)
          dispatch(changeUser({ userId: cookieUserId}))
        }else if(selectedRole=="Branch Admin"){
          console.log("setBranchAdminId",cookieUserId)
          setBranchAdminId(cookieUserId)
        }

        // dispatch(getstoreData(getCookieData("UserId")));
        dispatch(getstoreData(cookieUserId));
        dispatch(changeUserId(cookieUserId));
      }
      else{
        dispatch(getSadminUser()).unwrap();
      }
      
     
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    dispatch(emptySelectedIds());
    
  }, [selectedRole]);

  useEffect(() => {
    dispatch(gettingAdminDropDown());
  }, []);

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);


  useEffect(() => {
    if (selectedRole == "Sadmin") {
      dispatch(getSadminUser()).unwrap();
    } else if (selectedRole == "Company Admin") {
      dispatch(gettingAdminDropDown()).unwrap();
    } else if (
      selectedRole == "Branch Admin" &&
      storeId != null &&
      BranchId != null
    ) {
      dispatch(getBranchAdmin({ BranchId }));
      dispatch(gettingAdminDropDown()).unwrap();
    }
  }, [selectedRole, storeId, BranchId, UserId]);

  useEffect(() => {
    if (AdminDropDown.length===1){
        if(selectedRole == "Company Admin"){
          setCompanyAdminId(AdminDropDown[0]?.["UserId"]);
          setSelectedCompanyAdmin(AdminDropDown[0]?.["UserId"]);
          dispatch(getstoreData(AdminDropDown[0]?.["UserId"]));
          dispatch(changeUserId(AdminDropDown[0]?.["UserId"]));
          dispatch(changeUser({ userId: AdminDropDown[0]?.["UserId"]}))
         
        }else if(selectedRole == "Branch Admin"){
          setBranchAdminId(AdminDropDown[0]?.["UserId"]);
          setSelectedBranchAdmin(AdminDropDown[0]?.["UserId"])
          dispatch(getstoreData(AdminDropDown[0]?.["UserId"]));
          dispatch(changeUserId(AdminDropDown[0]?.["UserId"]));
          
         
        }
        
    }
    
  },[SelectedCompanyAdmin,AdminDropDown])

  const userDropDownChange = (e) => {
    
    setCompanyAdminId(e);
    dispatch(getstoreData(e));
    dispatch(changeUserId(e));
    dispatch(changeUser({ userId: e}))
    dispatch(changeApp({ AppId:null }))
    dispatch(changeStore({ storeId: null }));
    dispatch(changeBranch({ BranchId: null }));
    dispatch(emptySelectedModuleBranch());
    setSelectedCompanyAdmin(e);
   
  };

  const userBranchDropDownChange = (e) => {
 
    setBranchAdminId(e);
    dispatch(getstoreData(e));
    dispatch(changeUserId(e));
    dispatch(changeApp({ AppId:null }))
    dispatch(changeStore({ storeId: null }));
    dispatch(changeBranch({ BranchId: null }));
    dispatch(emptySelectedModuleBranch());
    setSelectedBranchAdmin(e)
   
  };

  

  const userIdValue = (userId) => {
    setUserId(userId);
    // dispatch(emptySelectedModuleBranch());

  } 

  // const getPostData = (postData) => {
  //   console.log("getting posted data",postData)
  //   setPostDataValues(postData)
  // }
  // const getPostAppData = (postData) => {
  //    setPostDataValues(postData)
  // }

  const handleSubmit = async () =>{
    try{
        console.log("PostDataValues",PostDataValues)
        let res;
        let deleteData;
        let filtered = PostDataValues.filter(function (el) {
          return el != null && el != undefined;
        });
        if (PostDataValues.length==0){
          if(selectedRole!="Company Admin"){
              deleteData = {
                UserId:UserId
              };
              res=await dispatch(deleteModuleRights(deleteData)).unwrap()
          }else{
            deleteData = {
              UserId: companyAdminId,
              BranchId:BranchId
            };
            res=await dispatch(deleteBranchModuleRights(deleteData)).unwrap()
          }
        }
        else{
          if(selectedRole!="Company Admin"){
              res = await dispatch(
                postModuleRights({
                  UserId: UserId,
                  ModuleDetails: filtered,
                  CreatedBy: getCookieData("UserId") ?? 1
                })
              ).unwrap();
            }else{
              res = await dispatch(
                postBranchModuleRights({
                  UserId: companyAdminId,
                  ModuleDetails: filtered,
                  CreatedBy: getCookieData("UserId") ?? 1
                })
              ).unwrap();
            }
        }
        
        if (res.data.statusCode===1) {
          setMessageType("success");
          setMessageData(res.data.response);
          if (!AdminDropDown.length===1 || selectedRole=="Sadmin"){
                setUserId(null);
                setCompanyAdminId(null);
                setBranchAdminId(null);
                setSelectedCompanyAdmin(null);
                setSelectedBranchAdmin(null);
                form.resetFields();
                dispatch(emptyPostData());
          }
        
        } else {
          setMessageType("error");
          setMessageData(res.data.response);
        }
    }catch(err){
      if(err["message"]=="Request failed with status code 422"){
        setMessageType("error");
        setMessageData("Please Give Proper Values");
      }
    }
  }
  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, [])

  const getUserRole = (e) => {
    if (UserType != "Admin"){
        setCompanyAdminId(null);
        setBranchAdminId(null);
        setSelectedCompanyAdmin(null);
        setSelectedBranchAdmin(null);
        setUserId(null);
    }
    form.resetFields();
    
  } 

  console.log(selectedRole, storeId, BranchId, UserId,"567891234")
  return (
    <div className="pageOverAll">
      <div className="userPage">
        <div className="userPageContent">
        <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
          <div className="formName">
            <FormHeader title={"App Access Rights"} />
          </div>

          <div className="moduleAccessDiv">
            <div className="dropDownSelectors">
            <div className="dropDownSelectParentDiv">
              <div>
                <UserRoles getUserRole={getUserRole}/> 
              </div>
              
              <div className="dropDownSelectChildDiv">
                <Form form={form}>
                    {selectedRole == "Company Admin" && UserType != "Admin" && (
                      <Form.Item
                          name="CompanyAdmin"
                      >
                        <DropDowns
                            options={AdminDropDown?.map((option) => ({
                              value: option.UserId,
                              label: option?.UserName?option?.UserName:option.MobileNo,
                            }))}
                            label="Admin Name"
                            onChangeFunction={(e) => userDropDownChange(e)}
                            isOnchanges={SelectedCompanyAdmin?true:false}
                            className="field-DropDown"
                            valueData={SelectedCompanyAdmin}
                            
                      />
                    </Form.Item>
                    )}
                    {selectedRole == "Branch Admin" && UserType != "Admin" && (
                      <Form.Item
                          name="BranchAdmin"
                      >
                        <DropDowns
                        options={AdminDropDown?.map((option) => ({
                          value: option.UserId,
                          label: option?.UserName?option?.UserName:option.MobileNo,
                        }))}
                        label="Admin Name"
                        onChangeFunction={(e) => userBranchDropDownChange(e)}
                        isOnchanges={SelectedBranchAdmin?true:false}
                        className="field-DropDown"
                        valueData={SelectedBranchAdmin}
                        
                      />
                      </Form.Item>
                    )}
                </Form>
                    {console.log("selectedRole",selectedRole,companyAdminId,getCookieData("UserId"),UserType)}
                    {selectedRole != "Sadmin" &&
                        // selectedRole == "Company Admin" &&
                        //  companyAdminId != null && companyAdminId !=undefined && 
                        (<>
                          <Form form={form}>
                          <Form.Item
                                name="AppName"
                            >
                            <AppDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId"))  :selectedRole=="Company Admin" ? companyAdminId:branchAdminId} />
                          </Form.Item>
                          </Form>
                        </>
                         )
                    }
                    {console.log("UserId store",UserId,selectedRole,branchAdminId)}
                    {/* {selectedRole != "Sadmin" &&
                        selectedRole != "Company Admin" &&
                        AppId !=null && AppId !=undefined && 
                        //  branchAdminId != null && branchAdminId !=undefined && 
                        (<>
                          <Form form={form}>
                          <Form.Item
                                name="CompName"
                            >
                           <StoreDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId")) :branchAdminId} AppId={AppId} />
                          </Form.Item>
                          </Form>
                        </>
                         )
                         
                    } */}
                    {selectedRole != "Sadmin" &&
                        selectedRole == "Company Admin" &&
                        UserType == "Admin" &&
                        //  companyAdminId != null && companyAdminId !=undefined && 
                         AppId !=null && AppId !=undefined && 
                         <StoreDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId"))  :companyAdminId} AppId={AppId}/>
                    }
                    {selectedRole != "Sadmin" &&
                              selectedRole != "Company Admin" &&
                              AppId !=null && AppId !=undefined && 
                              UserType == "Admin" &&
                              //  branchAdminId != null && branchAdminId !=undefined && 
                              (<>
                                <Form form={form}>
                                <Form.Item
                                      name="CompName"
                                  >
                                <StoreDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId")) :branchAdminId} AppId={AppId} />
                                </Form.Item>
                                </Form>
                              </>
                              )
                              
                          }
                    {selectedRole == "Sadmin" && <UserDropDown userIdValue={userIdValue}/>}

              </div>
              
            </div>
            <div className="dropDownSelectChildDiv">
              {console.log(AppId,UserId,"AppIdAppId")}

              {selectedRole != "Sadmin" &&
                        selectedRole == "Company Admin" &&
                        UserType != "Admin" &&
                        //  companyAdminId != null && companyAdminId !=undefined && 
                         AppId !=null && AppId !=undefined && 
                         <StoreDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId"))  :companyAdminId} AppId={AppId}/>
              }
              {selectedRole != "Sadmin" &&
                        selectedRole != "Company Admin" &&
                        AppId !=null && AppId !=undefined &&
                        UserType != "Admin" && 
                        //  branchAdminId != null && branchAdminId !=undefined && 
                        (<>
                          <Form form={form}>
                          <Form.Item
                                name="CompName"
                            >
                           <StoreDropDown UserId={UserType=="Admin"? parseInt(getCookieData("UserId")) :branchAdminId} AppId={AppId} />
                          </Form.Item>
                          </Form>
                        </>
                         )
                         
                    }
              {selectedRole != "Sadmin" &&
                      selectedRole == "Company Admin" &&
                      // companyAdminId != null && companyAdminId !=undefined && 
                      AppId !=null && AppId !=undefined &&
                      storeId != null &&
                      storeId != undefined && <BranchDropDown storeId={storeId} UserId={UserType=="Admin"? parseInt(getCookieData("UserId"))  :companyAdminId} AppId={AppId}/>
              }
              {selectedRole != "Sadmin" &&
                      selectedRole != "Company Admin" &&
                      AppId !=null && AppId !=undefined &&
                      storeId != null &&
                      storeId != undefined && <BranchDropDown storeId={storeId} UserId={UserType=="Admin"? parseInt(getCookieData("UserId"))  :branchAdminId} AppId={AppId}/>
                      // storeId != null &&
                      // storeId != undefined && <BranchDropDown storeId={storeId} />
              }

              {selectedRole == "Branch Admin" &&
                    storeId != null && storeId != undefined &&
                    BranchId != null && BranchId != undefined && <UserDropDown  userIdValue={userIdValue}/>
              }
            </div>
            </div>
            
            
               
            <div className="userAccessDivP">
              <ModuleAccessUserBased disabled={(selectedRole=="Company Admin" 
                                                // && companyAdminId != null && companyAdminId !=undefined
                                                && AppId!=null
                                                && storeId!=null
                                                && BranchId!=null) || 
                                              (selectedRole=="Branch Admin" 
                                              // &&  branchAdminId != null && branchAdminId !=undefined
                                              && storeId!=null
                                              && BranchId!=null
                                              && UserId!=null) ||
                                              (UserId !=null 
                                              && selectedRole!="Company Admin" 
                                              && selectedRole!="Branch Admin") ? false : true}/>
            </div>

            <div className="userAccessDivComp">  
              <ModuleApp/>   
            </div>
          {selectedRole != "Company Admin" && <>
            <div className="userAccessDivComp">  
              <Companys />   
            </div>

            <div className="userAccessDivComp">
              <CompanyBranch/>
            </div>
            </>
          }

        <div className="submitButton">
          <Buttons
            buttonText="SUBMIT"
            color="901D77"
            icon={<ArrowRightOutlined />}
            handleSubmit={handleSubmit}
            // disabled={(selectedRole=="Company Admin"  && PostDataValues!=null) || (selectedRole=="Branch Admin"  && PostDataValues!=null) || (UserId !=null && PostDataValues!=null && selectedRole!="Company Admin" && selectedRole!="Branch Admin")  ? false : true}
          />
        </div>
                    


          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleAccess;

