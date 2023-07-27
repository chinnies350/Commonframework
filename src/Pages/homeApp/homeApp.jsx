import appIcon from '../../Images/appIcon.png'
import AppList from './appList'

const HomeApp = () => {
    return (
        <div>
       
            <div className="homeAppHeadder">
                <div className='homePageAppIcon'>
                    <img src={appIcon} />
                </div>
                <div>
                    <h2>My Apps</h2>
                    <p>Apps you've Access</p>
                </div>
                
            </div>
            <div className='appList'>
                <AppList />
            </div>
        </div>
    
    )
}

export default HomeApp;

