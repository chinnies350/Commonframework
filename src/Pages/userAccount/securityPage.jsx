import PasswordUpdate from "./passwordUpdate/passwordUpdate"
import PinUpdate from './PinUpdate/pinUpdate';

const SecurityPage = () => {
    return (
        <div className='userAccountSec'>
            <div className="myProfileHeading">
                Security
            </div>
            <div className="securityContentPage">
                <PasswordUpdate />
                <PinUpdate/>
            </div>
        </div>
    )
}



export default SecurityPage