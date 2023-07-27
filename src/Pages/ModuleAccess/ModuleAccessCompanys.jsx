import {useEffect,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ModuleAccessCompanys.scss";
import { Checkbox } from "antd";

import { Collapse } from "antd";
import {
  gettingAppListSelector,
  gettingCmpListSelector,
  getBranchDetails,
  removeBranchList,
  gettingCompAccess,
  getUserAppStoreDetails,
  selectedUserSelector,
  changeBranchAccess,
  gettingPostDataValue,
  changePostData,
  removePostDataValue,
  selectRoleSelector,
  gettingUserId,
  gettingBranchAccess,
  removeBranchAccess

} from "../../features/ModuleAccess/moduleAccessSlice";
import { getCookieData } from "../../Services/others";


const Companys = ({}) => {
  // gettingCmpListSelector

  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const selectRole = useSelector(selectRoleSelector);
  const AdminId = useSelector(gettingUserId);
  const AppList = useSelector(gettingAppListSelector);
  const CmpList = useSelector(gettingCmpListSelector);
  const CompAccess = useSelector(gettingCompAccess);
  const userId = useSelector(selectedUserSelector);
  const PostDataValues = useSelector(gettingPostDataValue);
  const BranchAccess = useSelector(gettingBranchAccess);

  const [checkedList, setCheckedList] = useState({});

  console.log("CompAccess",CompAccess)
  useEffect(() => {
    try {

      async function sampleBranch() {
        let CompAccessVal={}
        console.log("CompAccessCompAccess1234",CompAccess)
        let sampleBranchAcc = await Object.keys(CompAccess)?.reduce(async (acc, appKey) => {
          CompAccessVal[appKey]=CompAccess[appKey].map(obj => obj.CompId)
          console.log("CompAccessCompAccess123",CompAccess)
          if(CmpList[appKey] != undefined){
              let appsDict = await CompAccess[appKey]?.reduce(async (subAcc ,compVal) => {
                if (selectRole=="Sadmin"){
                  await dispatch(getBranchDetails({ "CompId":compVal["CompId"],AppId: compVal["AppId"]})).unwrap()
                }
                else{
                  await dispatch(getBranchDetails({ "CompId":compVal["CompId"],"AppId": compVal["AppId"],"UserId":getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId})).unwrap()
                }
                let res=await dispatch (getUserAppStoreDetails({UserId:userId,AppId:compVal["AppId"],StoreId:compVal["CompId"]})).unwrap()
                // console.log("check 11", `${res.data.data[0]['AppName']}-${res.data.data[0]['CompName']}`, await subAcc)
                return { ...await subAcc ,...{[`${res.data?.data[0]?.AppName}-${res.data?.data[0]?.CompName}`]: res.data?.data?.map((eachCom) => { {console.log("eachCom",eachCom)} return {'CompId':eachCom.CompId, 'AppId':eachCom.AppId,'BranchId':eachCom.BrId}})}}
              }, {})
              console.log("appsDict", appsDict)
              return {... await acc,... await appsDict}
            }else {
              return await acc
            }
        }, {})
  
        dispatch(changeBranchAccess(sampleBranchAcc))
        setCheckedList(CompAccessVal)
      }
      if(selectRole!="Company Admin"){
        sampleBranch()
      }
      
    } catch (err) {
      console.log("err", err);
    }
  }, [CompAccess,CmpList]);

  const onChange = async (e,a) => {
      let newObj = {
        [a]: e
      }
      setCheckedList({...checkedList, ...newObj})
  };

  const checkedBoxChangeFun = async (e, CmpName, CompId,AppId,AppName) => {
    console.log(e, CmpName, "data of click1234");

    try {
      
      let res;
      if (e.target.checked) {
        if(selectRole=="Sadmin"){
          res = await dispatch(getBranchDetails({ CompId,AppId })).unwrap();
        }else{
          res = await dispatch(getBranchDetails({ "CompId":CompId,"AppId":AppId,"UserId":getCookieData("UserType")=="Admin"?getCookieData("UserId"):AdminId })).unwrap();
        }
        // dispatch(changePostData([...PostDataValues,{"AppId":AppId,"CompId":CompId,"BranchId": BranchId}]))
        
      } else {
        
        dispatch(removePostDataValue({ CompId: CompId,AppId:AppId }));
        dispatch(removeBranchAccess({ branchAccessData: `${AppName}-${CmpName}` }))
        dispatch(removeBranchList({ CompName: `${AppName}-${CmpName}` }));
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  return (
    <div className="userAccessDiv">
      <div className="userAccess">
        <div className="userAccessHeader selectDrpHeading"> Organization </div>

        <Collapse defaultActiveKey="1">
          <Panel header="Hide / Show" key="1">
            <div className="userAccessBody ">
              {console.log("CmpListCmpList",CmpList)}
              {Object.keys(CmpList).length === 0 && <>
                  <p style={{color:"gray"}}> No Organizations Found </p>
              </>}
            {Object.keys(CmpList)?.map((a) => (
                <div className="BranchCardList">
                  <p> {a}</p>
                  {console.log("checkedList1223",checkedList)}
                  <Checkbox.Group 
                      value={checkedList[a]}
                      onChange={(e) => onChange(e,a)}
                      >
                        {Object.values(CmpList)?.map((b) =>
                          b?.map((c) =>
                            c?.AppName === a ? (
                              <Checkbox
                                className="companyCard"
                                key={c?.CompId}
                                value={c?.CompId}
                                onChange={(e) =>
                                  checkedBoxChangeFun(e, c?.CompName, c?.CompId,c?.AppId,c?.AppName)
                                }
                              >
                                {c?.CompName}
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

export default Companys;
