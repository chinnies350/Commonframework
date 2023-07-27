import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoleSelector,changeUser,changeBranch,changeStore,selectedAppIdSelector,selectAppData,getAppDetails,changeApp } from '../../features/ModuleAccess/moduleAccessSlice';
import { DropDowns } from "../../Components/Forms/DropDown.jsx";



const AppDropDown = ({ UserId }) => {
  const dispatch = useDispatch();
  const appData = useSelector(selectAppData);
  const AppId = useSelector(selectedAppIdSelector);
  const selectRole = useSelector(selectRoleSelector);
  const [SelectedApplication, setSelectedApplication] = useState(null);
  
  useEffect(() => {
    try{
        if (UserId != null){
            dispatch(getAppDetails({UserId: UserId})).unwrap()
        }
    } catch(err) {
        console.log(err)
    }
  }, [UserId])

  useEffect(() => {
    try{
      if(AppId==null)setSelectedApplication(null)
    } catch(err) {
        console.log(err)
    }
  }, [AppId])
  useEffect(() => {
    if (appData.length===1){
      
      setSelectedApplication(appData[0]?.["AppId"])
      dispatch(changeApp({ AppId:appData[0]?.["AppId"] }))
      // dispatch(changeStore({ storeId: null }));
      // dispatch(changeBranch({ BranchId: null }));
    }else{
      setSelectedApplication(null)
    }
    
  },[appData])
  const appDropDownChange = (e) => {
    setSelectedApplication(e)
    dispatch(changeApp({ AppId:e }))
    dispatch(changeStore({ storeId: null }));
    dispatch(changeBranch({ BranchId: null }));
    // if(selectRole=="Branch Admin"){dispatch(changeUser({ userId: null}))}
    // dispatch(changeUser({ userId: null}));

  }
  

  
    return (
        <div className="moduleAccessSelectDrp">
            <DropDowns
                      options={appData?.map((option) => ({
                        value: option.AppId,
                        label: option.AppName,
                      }))}
                      label="App Name"
                      id="AppName"
                      field="AppName"
                      fieldState={true}
                      fieldApi={true}
                      onChangeFunction={(e) => appDropDownChange(e)}
                      className="field-DropDown"
                      valueData={SelectedApplication}
                      isOnchanges={SelectedApplication?true:false}
                    />

        </div>
    )
}

export default AppDropDown