import appIcon from '../../Images/notification.png'
import NotificationsData from './NotificationData';

const HomeNotification = () => {
    return (
        <div>
            <div className="homeAppHeadder">
                <div className='homePageAppIcon'>
                    <img src={appIcon} />
                </div>
                <div>
                    <h2>Notifications</h2>
                    {/* <p>Apps you've Accese</p> */}
                </div>
                
            </div>
            <div>
                <NotificationsData />
            </div>
        </div>
    )
}


export default HomeNotification;
