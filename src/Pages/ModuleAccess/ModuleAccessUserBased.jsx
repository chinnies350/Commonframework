import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allModuleSelector,
  getAllModuleActive,
  selectedUserSelector,
  selectedUserDataSelector,
  selectedStoreSelector,
  getBranchBasedOnStoreAndType,
  getUserData,
  selectedModuleBranchSelector,
  getBranchBasedOnStoreAndTypeSadmin,
  selectRoleSelector,
  removeAppList,
  gettingUserId,
  AddAppList,
  changeAppAccess,
  selectedBranchIdSelector,
  gettingCompAccess,
  removeAppAccess,
  userDataSelector
} from "../../features/ModuleAccess/moduleAccessSlice";
import "./ModuleAccessUserBased.scss";
import { getCookieData } from "../../Services/others";
import { Checkbox, Col, Row } from "antd";



const ModuleAccessUserBased = ({disabled}) => {
  const dispatch = useDispatch();
  const selectRole = useSelector(selectRoleSelector);
  const allModules = useSelector(allModuleSelector);
  const userId = useSelector(selectedUserSelector);
  const storeId = useSelector(selectedStoreSelector);
  const selectedUserData = useSelector(selectedUserDataSelector);
  const selectedModuleBranch = useSelector(selectedModuleBranchSelector);
  const [checkedList, setCheckedList] = useState([]);
  const AdminId = useSelector(gettingUserId);
  const BranchId = useSelector(selectedBranchIdSelector);
  const CompAccess = useSelector(gettingCompAccess);
  const userData = useSelector(userDataSelector);

    useEffect(() => {
      console.log("getting value getAllModuleActive",userId,AdminId,selectRole)
      try {
            if(AdminId && (selectRole == "Branch Admin" || selectRole=="Company Admin")){
              dispatch(getAllModuleActive(AdminId)).unwrap();
            }else{
              dispatch(getAllModuleActive()).unwrap();
            }
          
      } catch (err) {
        console.log(err, "err");
      }
    }, [AdminId]);
    
    useEffect(()=>{
      console.log("getting value getAllModuleActive",userId,AdminId,selectRole,allModules,selectedModuleBranch)
      try {
        // if (userId) {
            console.log("getting value getAllModuleActive1238",userId,getCookieData("UserType"),getCookieData("UserId"))
            if (getCookieData("UserType") === "Admin") {
              dispatch(getAllModuleActive(getCookieData("UserId"))).unwrap();
              
            }
            if(selectRole=="Company Admin" && BranchId){
              dispatch(getUserData({ userId: getCookieData("UserType") === "Admin"?getCookieData("UserId"):AdminId,BranchId:BranchId})).unwrap()
            }
            else if(selectRole=="Branch Admin" || selectRole=="Sadmin"){dispatch(getUserData({ userId: userId})).unwrap();}
           
          // }
      } catch (err) {
        console.log(err, "err");
      }
    }, [BranchId]);

    useEffect(()=>{
      console.log("getting value getAllModuleActive",userId,AdminId,selectRole,allModules,selectedModuleBranch)
      try {
        if (userId!=null && getCookieData("UserType") !== "Admin") {
              if(selectRole=="Company Admin" && BranchId){
                dispatch(getUserData({ userId: userId,BranchId:BranchId })).unwrap();
              }else if(selectRole=="Branch Admin" || selectRole=="Sadmin"){
                dispatch(getUserData({ userId: userId })).unwrap();
              }
            }
            else if(userId!=null && getCookieData("UserType") === "Admin"  && (selectRole=="Company Admin" && BranchId)){
            dispatch(getUserData({ userId: getCookieData("UserId"),BranchId:BranchId })).unwrap();
          }else if(userId!=null && getCookieData("UserType") === "Admin"  && (selectRole=="Branch Admin" || selectRole==" Sadmin")){
            dispatch(getUserData({ userId: userId })).unwrap();
          }

      } catch (err) {
        console.log(err, "err");
      }
    }, [userId]);


    useEffect(() => {
      console.log("getting BranchId",BranchId,selectedModuleBranch)
      try {
        async function tempCompanyFunction () {
          // let appList = {}
          let appCompanyAccess = {}
          console.log("inside api i am there1234",...selectedModuleBranch)
          const SelectCompanyList = await Promise.all([...selectedModuleBranch?.map(async(a) => { 
                                            console.log("inside api i am there1234",BranchId,AdminId,userId)
                                              if(selectRole == 'Company Admin' && BranchId){
                                                console.log("inside api i am there")
                                                let res = await dispatch(
                                                  getBranchBasedOnStoreAndTypeSadmin({ BranchType: a.SubCateId,UserId:getCookieData("UserType") === "Admin"?getCookieData("UserId"):userId,BranchId:BranchId })
                                                ).unwrap();
                                                let samVar = res?.data?.data?.filter((eachApp) =>eachApp.AppAccess=='Y')
                                                                          .map((eachApp) => eachApp.AppId)
                                                appCompanyAccess[a.ConfigName] = samVar
                                              }
                                            return a.SubCateId
                                            })]);
                                              
          dispatch(changeAppAccess(appCompanyAccess))                                                              
          console.log("SelectList",SelectCompanyList)
          setCheckedList( SelectCompanyList);
      }
      if(selectRole=="Company Admin"){
        tempCompanyFunction () 
      }
      
            
            
      } catch (err) {
        console.log(err, "err");
      }
    }, [BranchId,selectedModuleBranch]);

    

  

  useEffect( () => {
    try {
      async function tempFunction () {
          // let appList = {}
          let appAccess = {}
          console.log("getting checkbox val123",...selectedModuleBranch)
          const SelectList = await Promise.all([...selectedModuleBranch?.map(async(a) => { 
                                            console.log("getted a value",BranchId,userId)
                                            if(selectRole != 'Company Admin' && userId){
                                              
                                                let res;
                                                res = await dispatch(
                                                  getBranchBasedOnStoreAndTypeSadmin({ BranchType: a.SubCateId,UserId:userId,Type:selectRole=="Branch Admin" ? 'B':'S' })
                                                ).unwrap();
                                                // if(getCookieData("UserType")=="Admin"){
                                                //   res = await dispatch(
                                                //     getBranchBasedOnStoreAndTypeSadmin({ BranchType: a.SubCateId,UserId:userId,Type:selectRole=="Branch Admin" ? 'B':'S' })
                                                //   ).unwrap();
                                                // }else if(getCookieData("UserType")!="Admin" && userId){
                                                //   res = await dispatch(
                                                //     getBranchBasedOnStoreAndTypeSadmin({ BranchType: a.SubCateId,UserId:userId,Type:selectRole=="Branch Admin" ? 'B':'S' })
                                                //   ).unwrap();
                                                // }
                                                
                                                let samVar = res?.data?.data?.filter((eachApp) =>eachApp.AppAccess=='Y')
                                                                          .map((eachApp) => eachApp.AppId)
                                                appAccess[a.ConfigName] = samVar
                                                }
                                        
                                            return a.SubCateId
                                            })]);
                                              
          dispatch(changeAppAccess(appAccess))                                                              
          console.log("SelectList",SelectList)
          setCheckedList(userId != null ? SelectList : []);
      }
      if(selectRole != 'Company Admin'){
        tempFunction()}
    } catch (err) {
      console.log("err", err);
    }
  }, [selectedUserData]);

 

  useEffect(() => {
    try {
      setCheckedList([]);
      // dispatch(getUserData({ userId: getCookieData("UserType") === "Admin"?getCookieData("UserId"):userId })).unwrap();
    } catch (err) {
      console.log("err", err);
    }
  }, [selectRole]);

  useEffect(()=>{
    if (userData.length==0){
      if(selectRole=="Branch Admin"){
        setCheckedList([]);
      }
    }

},[userData])

  const checkedBoxChangeFun = async (e, subCat) => {
    console.log(e,"data of click",userId,AdminId)
    try {
      let res;
      if (e.target.checked) {
        if (userId && selectRole=='Company Admin') {
          res = await dispatch(
            getBranchBasedOnStoreAndTypeSadmin({
              UserId: userId,
              BranchType: e.target.value,
              BranchId:BranchId
            })
          ).unwrap();
        } 
        else if ((getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId) && selectRole=='Branch Admin') {
          res = await dispatch(
            getBranchBasedOnStoreAndTypeSadmin({
              UserId: getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId,
              BranchType: e.target.value,
              Type:'B'
            })
          ).unwrap();
        } 
        // else if (AdminId && selectRole=='Branch Admin') {
        //   res = await dispatch(
        //     getBranchBasedOnStoreAndTypeSadmin({
        //       UserId: AdminId,
        //       BranchType: e.target.value,
        //       Type:'B'
        //     })
        //   ).unwrap();
        // } 
          // if (storeId) {
          //   res = await dispatch(
          //     getBranchBasedOnStoreAndType({
          //       storeId: storeId,
          //       BranchType: e.target.value,
          //     })
          //   ).unwrap();
          // } 
          else {
            res = await dispatch(
              getBranchBasedOnStoreAndTypeSadmin({ BranchType: e.target.value })
            ).unwrap();
            console.log("gettingCompAccess",CompAccess)

            
          }
      } else {
        dispatch(removeAppList({subCat:subCat}))
        dispatch(removeAppAccess({ appAccessData:subCat }))
      }  
          
    } catch (err) {
      console.log(err, "err");
    }
  };

  const allModuleCheck = allModules?.map((eachModule, index) => {
    let data = [];

    if (userId) {
      data = selectedModuleBranch?.filter(
        (eachData) => eachData.ConfigName == eachModule.ConfigName
      );
    }


    return (
      <div>
        <Row>
          <Col span={10}>
            <Checkbox
              style={{ padding: "5px" }}
              onChange={(e) => checkedBoxChangeFun(e, eachModule.ConfigName)}
              value={eachModule.ConfigId}
              key={eachModule.ConfigId}
            >
              {eachModule.ConfigName}
            </Checkbox>
          </Col>
        </Row>
      </div>
    );
  });

  

  const onChange = async (list) => {
    console.log("onChangeonchange",list)
    setCheckedList(list);
  };

  

 


  return (
    <div className="userAccessDiv">
      <div className="userAccess">
        <div className="userAccessHeader selectDrpHeading">Category</div>
        <div className="userAccessBody " style={disabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
          {console.log("checkedListcheckedList",checkedList)}
          <Checkbox.Group
            style={{
              width: "100%",
            }}
            onChange={(e) => onChange(e)}
            value={checkedList}
          >
            {allModules?.length > 0 && allModuleCheck}
          </Checkbox.Group>
        </div>
      </div>
      
    </div>
  );
};

export default ModuleAccessUserBased;
