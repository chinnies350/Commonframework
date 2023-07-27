import { useState, useEffect,useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getlogData,logDataSelector } from '../../features/logs/logs';
import { getCookieData } from "../../Services/others";





const NotificationsData = () => {

    const dispatch = useDispatch();

    const messages = useSelector(logDataSelector)

    
    const [UserType, setUserType] = useState(
        getCookieData("UserType") ? getCookieData("UserType") : null
    );

    const [UserId, setUserId] = useState(
        getCookieData("UserId") ? getCookieData("UserId") : null
      );

      useEffect(() => {
        if (UserType === 'Admin' || UserType === 'Admin User') {
            dispatch(getlogData(UserId)).unwrap();
        }else if (UserType === 'Super Admin' || UserType === 'Super Admin User'){
        dispatch(getlogData()).unwrap();
        }
    }, [UserType, UserId]);

    return (
        <div className="homeNotification">
            <ul>
                {messages?.map((message, index) => (
                    <li key={index} style={{  marginBottom: '8px' }}>
                        {message.message.charAt(0).toUpperCase() + message.message.slice(1)}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default NotificationsData;
