import UserName from './myProfile/userName';

const MyProfile = () => {
    
    return (
        <div className='userAccountCont'>
            <div className="myProfileHeading">
                My Profile
            </div>
            <div>
                <UserName />
            </div>
        </div>
    )
}

export default MyProfile;