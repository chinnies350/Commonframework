import { useState, useEffect} from 'react';
import { selectedStoreSelector, 
          changeStore,
          getstoreData,
          gettingUserId,
          selectRoleSelector,
          changeUser,
          emptyUserData,
        getUserAppDetails ,getCompDetails} from '../../features/ModuleAccess/moduleAccessSlice';
import './storeDropDown.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DropDowns } from "../../Components/Forms/DropDown.jsx";



const StoreDropDown = ({ UserId,AppId }) => {
  console.log("UserId,AppId",UserId,AppId)
  const dispatch = useDispatch();
  const UserIds = useSelector(gettingUserId);
  const storeId = useSelector(selectedStoreSelector);
  const selectRole = useSelector(selectRoleSelector);
  const [SelectedStore, setSelectedStore] = useState(null);

  const [storeData, setstoreData] = useState([]);

  async function fetchData() {
    const gettingTableData = await dispatch(getCompDetails({UserId})).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      await setstoreData(gettingTableData.data.data);
    }else{
      setstoreData([]);
    }
  }

  async function fetchDataUser(e) {
    const gettingTableData = await dispatch(getstoreData(e)).unwrap();
    if (gettingTableData.data.statusCode === 1) {
        await setstoreData(gettingTableData.data.data);
    } else {
        await setstoreData([]);
    }
  }

  async function fetchUserAppStoreData() {
    const gettingTableData = await dispatch(getUserAppDetails({ UserId,AppId })).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      await setstoreData(gettingTableData.data.data);
    } else {
      await setstoreData([]);
    }
  }

  // useEffect(() => {
  //   try {
  //     fetchDataUser(UserIds);
  //   } catch (err) {
  //     console.log(err, "err");
  //   }
  // }, [UserIds]);
  useEffect(() => {
    try{
      if(storeId==null)setSelectedStore(null)
    } catch(err) {
        console.log(err)
    }
  }, [storeId])

  useEffect(() => {
    try {
      // fetchData();
      console.log("fetchUserAppStoreData",UserId,AppId)
      if ((UserId != undefined &&  UserId != null)&& (AppId != undefined && AppId !=null)){
        fetchUserAppStoreData();
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, [UserId,AppId]);

  useEffect(() => {
    if (storeData.length===1){
      setSelectedStore(storeData[0]?.["CompId"])
      dispatch(changeStore({ storeId: storeData[0]?.["CompId"] }));
    }else{
      setSelectedStore(null)
    }
    
  },[storeData])
  // useEffect(() => {
  //   try {
  //     // fetchData();
      
  //       fetchData();
      
  //   } catch (err) {
  //     console.log(err, "err");
  //   }
  // }, [UserId]);

  


  

  const appDropDownChange = (e) => {
    console.log("e",e)
    setSelectedStore(e)
    dispatch(changeStore({ storeId: e }));
    if(selectRole=="Branch Admin"){console.log("Store Drop Down User Change into null")
      dispatch(changeUser({ userId: null}))
      dispatch(emptyUserData())
    }
    // dispatch(emptyUserData());
  };
    return (
        <div className="moduleAccessSelectDrp storeSelectDiv">
          {console.log("storeDatastoreData",storeData)}
            <DropDowns
                      options={storeData?.map((option) => ({
                        value: option.CompId,
                        label: option.CompName,
                      }))}
                      label="Organization Name"
                      id="StoreName"
                      field="CompName"
                      fieldState={true}
                      fieldApi={true}
                      onChangeFunction={(e) => appDropDownChange(e)}
                      className="field-DropDown"
                      valueData={SelectedStore}
                      isOnchanges={SelectedStore?true:false}
                    />

        </div>
    )
}

export default StoreDropDown