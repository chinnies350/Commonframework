import { useEffect,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ModuleAccessCompanys.scss";
import { Checkbox, Row, Col} from "antd";

import { Collapse } from "antd";
import {
  selectedUserSelector,
  gettingAppListSelector,
  getCmpDetails,
  removeCmpList,
  selectRoleSelector,
  selectedStoreSelector,
  selectedBranchIdSelector,
  gettingAppAccess,
  getUserAppDetails,changeCompAccess,
  gettingPostDataValue,
  changePostData,
  removePostDataValue,
  gettingUserId,
  removeCompanyAccess
} from "../../features/ModuleAccess/moduleAccessSlice";
import { getCookieData } from "../../Services/others";


const ModuleApp = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const selectRole = useSelector(selectRoleSelector);
  const userId = useSelector(selectedUserSelector);
  const AdminId = useSelector(gettingUserId);
  const AppList = useSelector(gettingAppListSelector);
  const storeId = useSelector(selectedStoreSelector);
  const BranchId = useSelector(selectedBranchIdSelector);
  const AppAccess = useSelector(gettingAppAccess);
  const PostDataValues = useSelector(gettingPostDataValue);
  
  const[postData, setPostData]=useState([])
  const [checkedList, setCheckedList] = useState({});

  // useEffect(() => {
  //   try {
  //     if (userId) {
  //       dispatch(getUserData({ userId: userId })).unwrap();
        
  //     }
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // }, [userId]);

  
  useEffect(() => {
    try {
      console.log("AppAccess Data",AppAccess)
      async function sampleComp() {

      let sampleCompAcc = await Object.keys(AppAccess)?.reduce(async (acc, appKey) => {
        if (AppList[appKey] != undefined && userId!=null) {

            let appsDict = await AppAccess[appKey]?.reduce(async (subAcc ,AppId) => {

              if (selectRole=="Sadmin"){await dispatch(getCmpDetails({ AppId })).unwrap() }
              else{await dispatch(getCmpDetails({ UserId:getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId,AppId:AppId })).unwrap()}
              
              let res=await dispatch (getUserAppDetails({UserId:userId,AppId:AppId})).unwrap()

              return { ...await subAcc ,...{[res.data?.data[0]?.AppName]: res.data?.data?.map((eachCom) => {return {'CompId':eachCom.CompId, 'AppId':AppId}})}}
            }, {})
            return {... await acc,... await appsDict}
        } else {
          return await acc
        }

      }, {})

      dispatch(changeCompAccess(sampleCompAcc ?? []))

      console.log("sampleCompAcc", sampleCompAcc)
    }

    if(selectRole!="Company Admin"){
      sampleComp()
    }else{
      console.log("obj.AppId",AppAccess)
      let appPost=[]
      {Object.keys(AppAccess)?.map((a) =>{
        AppAccess[a].map(obj => {
          appPost.push({"AppId":obj,"CompId":storeId,"BranchId": BranchId})
          // dispatch(changePostData([...PostDataValues,{"AppId":obj,"CompId":storeId,"BranchId": BranchId}]))
          
        })
        
      } )}
      dispatch(changePostData([...appPost]))
    }
      setCheckedList(AppAccess)
    } catch (err) {
      console.log("err", err);
    }
  }, [AppAccess, AppList]);


  

  const onChange = async (e,a) => {
      let newObj = {
        [a]: e
      }
      setCheckedList({...checkedList, ...newObj})
  };
 
  
  const checkedBoxChangeFun = async (e, AppName, AppId) => {
            // await dispatch(getCmpDetails({ "AppId":AppId, "UserId":userId})).unwrap();
            console.log(e, AppName, storeId,BranchId,userId,"data of click2");

    try {

      // let res;
      if (e.target.checked) {
        console.log("selectRole",selectRole)
        if(selectRole!="Company Admin"){
          if(selectRole=="Sadmin"){
            await dispatch(getCmpDetails({ AppId })).unwrap();
          }else{
            console.log("selectRole1234",selectRole)
            await dispatch(getCmpDetails({ "AppId":AppId, "UserId":getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId})).unwrap();
          }
          
        }else{
          dispatch(changePostData([...PostDataValues,{"AppId":AppId,"CompId":storeId,"BranchId": BranchId}]))
        }
        
        
      } else {
        if(selectRole!="Company Admin"){
          dispatch(removeCmpList({ AppName: AppName }));
          dispatch(removePostDataValue({ AppId:AppId }));
          dispatch(removeCompanyAccess({ companyAccessData: AppName }))

        }else{
          dispatch(removePostDataValue({ AppId:AppId }));
          // dispatch(removeCompanyAccess({ companyAccessData: AppName }))
          // postData.map((deleteData,index)=>{
          //   if(deleteData.AppId==AppId){
          //       delete postData[index]
          //       getPostAppData(postData)
          //   }
          // })
        }
        
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  return (
    <div className="userAccessDiv">
      <div className="userAccess">
        <div className="userAccessHeader selectDrpHeading"> Apps </div>
        {console.log("AppListAppList",AppList)}
        <Collapse defaultActiveKey="1">
          <Panel header="Hide / Show" key="1">
            <div className="userAccessBody ">
              {console.log("checkedListP", checkedList)}
              {Object.keys(AppList).length === 0 && <>
                  <p style={{color:"gray"}}> No Apps Found </p>
              </>}
              {Object.keys(AppList)?.map((a) => (
                <div className="BranchCardList">
                  <p> {a}</p>
                  {console.log(checkedList[a],"getting others value")}
                  <Checkbox.Group 
                      value={checkedList[a]}
                      onChange={(e) => onChange(e,a)}
                      >
                      {/* {checkedList[a]?.map(async (AppId)=> await dispatch(getCmpDetails({ AppId })).unwrap())} */}
                
                      {Object.values(AppList)?.map((b) =>
                        b?.map((c) =>
                          c?.SubCategoryName === a ? (
                            
                       
                              <Checkbox
                                className="companyCard"
                                key={c?.AppId}
                                value={c?.AppId}
                                
                                onChange={(e) =>
                                  checkedBoxChangeFun(e, c?.AppName, c?.AppId)
                                }
                              >
                                {c?.AppName}
                              </Checkbox>
                         
                            
                          ) : null
                        )
                      )}
         
                  </Checkbox.Group>
                  
                </div>
              ))}
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ModuleApp;
