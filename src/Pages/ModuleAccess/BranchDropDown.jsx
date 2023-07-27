import { useDispatch, useSelector } from "react-redux"
// import { branchDataSelector1, useGetBranchDataQuery, branchDataSelectorData } from "../../features/ModuleAccess/moduleAccessApiSlice"
import { useEffect, useState } from "react";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import { emptyUserData,selectRoleSelector,changeUser,changeBranch, getBranchDropModule, selectBranchData, selectedBranchIdSelector, getUserAppStoreDetails } 
from "../../features/ModuleAccess/moduleAccessSlice";
import { Form } from "antd";

const BranchDropDown = ({ storeId,UserId,AppId }) => {
    console.log("BranchDropDown",storeId,UserId,AppId)
    const dispatch = useDispatch()
    // const branchDataValue = useSelector(selectBranchData);
    const BranchId = useSelector(selectedBranchIdSelector);
    const [branchData, setBranchData] = useState([])
    const [SelectedBranch, setSelectedBranch] = useState(null);
    const selectRole = useSelector(selectRoleSelector);
    const [form] = Form.useForm();
    // if (branchDataValue.length==0){
    //     form.resetFields();
    //   }
    async function fetchUserAppStoreData() {
        const userAppStoreData=await dispatch(getUserAppStoreDetails({StoreId: storeId,UserId:UserId,AppId:AppId})).unwrap()
        console.log("userAppStoreData",userAppStoreData)
        if (userAppStoreData.data.statusCode === 1) {
                await setBranchData(userAppStoreData.data.data);
            } else {
                await setBranchData([]);
            }
      }
    async function fetchStoreData(e) {
        const storeData=await dispatch(getBranchDropModule({storeId: e})).unwrap()
        console.log("userAppStoreData1235",storeData)
        if (storeData.data.statusCode === 1) {
                await setBranchData(storeData.data.data);
            } else {
                await setBranchData([]);
            }
      }
    useEffect(() => {
        try{
            if(storeId != null && UserId != null && AppId != null){
                fetchUserAppStoreData();
            }
            else if (storeId != null){
                fetchStoreData(storeId)
            }
        } catch(err) {
            console.log(err)
        }
    }, [storeId])
    useEffect(() => {
        if (branchData.length===1){
            setSelectedBranch(branchData[0]?.["BrId"])
            dispatch(changeBranch({ BranchId:branchData[0]?.["BrId"] }))
        }else{
            setSelectedBranch(null)
        }
        
      },[branchData])
    const branchDatas = branchData.map((eachBranch) => (<option value={eachBranch.BranchId}> {eachBranch.BranchName}</option> ))
    const branchDropDownChange = (e) => {
        console.log("e get value",e)
        setSelectedBranch(e)
        dispatch(changeBranch({ BranchId:e }))
        if(selectRole=="Branch Admin"){
            dispatch(changeUser({ userId: null}))
            dispatch(emptyUserData())
        }

    }
    return (
        <Form form={form}>
            <div className="moduleAccessSelectDrp">
                {console.log("branchData",branchData)}
                <Form.Item
                    name="BranchName"
                >
                    <DropDowns
                            options={branchData?.map((option) => ({
                                value: option.BrId,
                                label: option.BrName,
                            }))}
                            label="Branch Name"
                            onChangeFunction={(e) => branchDropDownChange(e)}
                            className="field-DropDown"
                            valueData={SelectedBranch}
                            isOnchanges={SelectedBranch?true:false}
                            />
                </Form.Item>

            </div>
        </Form>
    )
}

export default BranchDropDown