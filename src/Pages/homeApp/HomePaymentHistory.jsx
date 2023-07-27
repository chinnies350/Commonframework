import appIcon from '../../Images/appHistory.png'
import HomePaymentTable from './HomePaymentTable';

const HomePaymentHistory = () => {

    return (
        <div>
            <div className="homeAppHeadder">
                <div className='homePageAppIcon'>
                    <img src={appIcon} />
                </div>
                <div>
                    <h2>Payment History</h2>
                    {/* <p>Apps you've Accese</p> */}
                </div>
                
            </div>
            <div className='homePaymentParent'>
                <HomePaymentTable />
            </div>
        </div>
    )
}

export default HomePaymentHistory;