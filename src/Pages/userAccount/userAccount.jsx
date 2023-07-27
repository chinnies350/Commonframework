import { useEffect, useState } from 'react';
import '../../styles/userAccount/userAccount.scss'
import MyProfile from './myProfile';
import { useDispatch } from 'react-redux';
import { getUserDataByUserId } from '../../features/userAccount/userAccount'
import { ClearCookie, getCookieData } from '../../Services/others';
import SecurityPage from './securityPage';
import { GrClose } from 'react-icons/gr';
import { AiOutlineMenu } from 'react-icons/ai'
import { MdOutlineLogout } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';


const subDirectory = import.meta.env.ENV_BASE_URL

const UserAccount = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userProfile, setUserProfile] = useState(true)
    const [security, setSecurity] = useState(false)
    const [close, setClose] = useState(true)

    useEffect(() => {
        callApi()
        async function callApi() {
            const userId = getCookieData('UserId') ?? 1
            await dispatch(getUserDataByUserId({ userId })).unwrap()
        }
    }, [])

    const logout = () => {
        ClearCookie()
        navigate(`${subDirectory}`)

    }

    return (
        <div className="userAccount">
            <div className={`optionSection ${!close ? "userSectionClose" : ''}`}>
                <div className='mobileViewClose' onClick={() => setClose(false)}>
                    <GrClose/>
                </div>
                <div className='userAccountHeading'>
                    Account Setting
                </div>
                <div className='userAccountTabDiv'>
                    <div className='userAccountTab' onClick={() => {
                        setUserProfile(true)
                        setSecurity(false)
                    }}>
                        My Profile
                    </div>
                    <div className='userAccountTab' onClick={() => {
                        setUserProfile(false)
                        setSecurity(true)
                    }}>Security</div>
                    <div className='userAccountTab' onClick={logout}>
                        <MdOutlineLogout />
                        &nbsp;
                        Logout
                    </div>
                </div>
            </div>
            {userProfile &&
                <div className={`userAccountCont ${close ? "userSectionClose" : ''}`}>
                    <div className='menuIcon' onClick={() => setClose(true)}>
                        <AiOutlineMenu />
                    </div>

                    <MyProfile />
                </div>}

            {security &&
                <div className={`userAccountSec ${close ? "userSectionClose" : ''}`}>
                    <div className='menuIcon' onClick={() => setClose(true)}>
                        <AiOutlineMenu />
                    </div>
                    <SecurityPage />
                </div>}

        </div>
    )
}


export default UserAccount;
