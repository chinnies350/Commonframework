import '../../styles/applications/applications.scss';
import { Search } from "../../Components/Forms/Search.jsx";
import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import ApplicationList from './applicationList';
import { getUserData } from "../../features/applications/applications";
import { getCookieData } from "../../Services/others";
import { useDispatch } from "react-redux";
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import PinUpdateNotification from '../../Pages/PinUpdatenotification/pinUpdateNotification'

const Application = () => {
    const dispatch = useDispatch()
    const [searchText, setSearchText]= useState('')
    const serachTextVal = useDeferredValue(searchText)

    const [Showpin, setShowpin] = useState(false)

    // useEffect(() => {

    // }, [serachTextVal])

    useEffect(() => {

        
        
        async function getUserDataFun () {
            // alert("his")
            // debugger
           
            const userId = getCookieData('UserId') ?? 1
            const res = await dispatch(getUserData({userId})).unwrap()
            if (res.data.statusCode) {
          
                setShowpin((res?.data?.data[0]?.Password!='N' || res?.data?.data[0]?.Pin!='N')? false:true)
    
                
            } 
        }
        getUserDataFun()
       
    }, [])

    const pinUpdate =async(e)=>{
        setShowpin(e);

    }

  



    const onSearchChange = useCallback((e) => {
        setSearchText(e.target.value)
    }, [])

    const handleCancel = () => {
        setShowpin(false);
       
      };


    return (
        <div className="homeApplication">

            {Showpin &&
            <DefaultModal
                    open={Showpin}
                    title="Set PIN"
                    footer={false}
                    children={<PinUpdateNotification pinUpdate={pinUpdate}/>}
                    handleCancel={handleCancel}
        // handleSubmit={handleSubmit}
                />}

            <div className='applicationSearch'>
                <Search
                    placeholder='Search'
                    // onSearch={onSearch}
                    onSearchChange={onSearchChange}
                />
                

            </div>

            <ApplicationList searchText={serachTextVal}/>
            
            
        </div>
    )
}


export default Application;