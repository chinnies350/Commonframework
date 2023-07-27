// import '../../styles/appPage/appPage.scss';

// import SideMenu from '../../Components/Menu/SideMenu'
// import CenterPage from './CenterPage'

// const AppPage = () => {
//     return (
//         <div className='appPage'>
//             <div className='sideNaveParent'>
//                 <SideMenu />
//             </div>
//             <div className="centerPage">
//                 <CenterPage />
//             </div>
//         </div>
//     )
// }

// export default AppPage


import '../../styles/appPage/appPage.scss';

import SideMenu from '../../Components/Menu/SideMenu'
import CenterPage from './CenterPage'
import { getItem, getsubItem } from '../../Components/Menu/SideMenu'
import { BiHomeSmile,BiCartAdd } from "react-icons/bi";   
import { IoBagHandleOutline } from "react-icons/io5";  
import { TbCheckupList,TbReport } from "react-icons/tb"; 
import { FiSettings,} from "react-icons/fi"; 
import { RiUser3Line } from "react-icons/ri"; 
import payprelogo from '../../Images/payprelogo.svg'
import { useState} from 'react';
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.BASE_URL

// const items = [
//     getItem('HOME', `${subDirectory}landing-page/home`, <BiHomeSmile className="iconsize" />),
//     // getItem('BOOKING', `${subDirectory}booking`, <IoBagHandleOutline />),
//     // getItem('STOCK', `${subDirectory}stock`, <BiCartAdd/>, [
//     //   getsubItem('SWEETS', `${subDirectory}sweets`),
//     //   getsubItem('SNACKS', `${subDirectory}snacks`),
//     //   getsubItem('Submenu', `${subDirectory}submenu`, null, [getsubItem('Option 5', 'Option5'), getsubItem('Option 6', 'Option6')]),
//     // ]),
  
//     // getItem('ORDER', 'ORDER7', <TbCheckupList/>),
//     // getItem('REPORT', 'REPORT8', <TbReport/>  ),
//     // <Link to={`${subDirectory}/login`} style={{ color: "black", }}>
//     //                     <a fontSize="18px"  style={{ verticalAlign: "middle",  }} />
//     //                      Sign In 
//     //       </Link> ,
          
//     getItem('SETTINGS', `${subDirectory}setting`,<FiSettings />, [
//       getsubItem('Config Type', `${subDirectory}config-type`),
//       getsubItem('Config Master', `${subDirectory}config-master`),
//       getsubItem('Company', `${subDirectory}company-master`),
//       getsubItem('Branch', `${subDirectory}branch-master`),
//       getsubItem('Tax', `${subDirectory}admin-tax`),
//       getsubItem('Carousel', `${subDirectory}carousel`),
//       getsubItem('Currency', `${subDirectory}currency`),
//       getsubItem('Feature', `${subDirectory}feature-master`),
//       getsubItem('Application Info', `${subDirectory}submenu`, null, [getsubItem('Application',  `${subDirectory}application-master`), 
//                                                                         getsubItem('Application Menu',  `${subDirectory}app-menu`),
//                                                                         getsubItem('Pricing Type',  `${subDirectory}pricing`),
//                                                                         getsubItem('Feature Mapping',  `${subDirectory}feature-mapping`),
//                                                                         getsubItem('Application Image',  `${subDirectory}application-image`)
//                                                                     ]),

//     ]),
//     getItem('USER MENU', `${subDirectory}user`,<FiSettings />, [
//         getsubItem('User Creation',  `${subDirectory}user-master`),
//         getsubItem('App Access',  `${subDirectory}app-access`)]),
//     getItem('USER', '9', <RiUser3Line/>),
//   //   getItem(
//   //     <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
//   //       Ant Design
//   //     </a>,
//   //     'link',
//   //     <LinkOutlined />,
//   //   ),
  
//   ];


const AppPage = () => {

    const [UserType, setUserType] = useState(
        getCookieData("UserType") ? getCookieData("UserType") : null
      );

    const items = [
        getItem('HOME', `${subDirectory}landing-page/home`, <BiHomeSmile className="iconsize" />),
        // ...other items
      ];
    
    if (UserType === 'Super Admin' || UserType === 'Super Admin User') {
    // Additional items for Super Admin and Super Admin User
    items.push(
        getItem('SETTINGS', `${subDirectory}setting`,<FiSettings />, [
            getsubItem('Config Type', `${subDirectory}setting/config-type`),
            getsubItem('Config Master', `${subDirectory}setting/config-master`),
            getsubItem('Organization', `${subDirectory}setting/Organization-master`),
            getsubItem('Branch', `${subDirectory}setting/branch-master`),
            getsubItem('Tax', `${subDirectory}setting/admin-tax`),
            getsubItem('Carousel', `${subDirectory}setting/carousel`),
            getsubItem('Currency', `${subDirectory}setting/currency`),
            getsubItem('Feature', `${subDirectory}setting/feature-master`),
            getsubItem('Message Template',`${subDirectory}setting/message-template`),
            getsubItem('Application Info', `${subDirectory}setting/submenu`, null, [getsubItem('Application',  `${subDirectory}setting/application-master`), 
                                                                              getsubItem('Application Menu',  `${subDirectory}setting/app-menu`),
                                                                              getsubItem('Pricing Type',  `${subDirectory}setting/pricing`),
                                                                              getsubItem('Feature Mapping',  `${subDirectory}setting/feature-mapping`),
                                                                              getsubItem('Application Image',  `${subDirectory}setting/application-image`)
                                                                          ]),
      
          ]),
          getItem('USER MENU', `${subDirectory}setting/user`,<FiSettings />, [
              getsubItem('User Creation',  `${subDirectory}setting/user-master`),
              getsubItem('App Access',  `${subDirectory}setting/app-access`),
              getsubItem('Payment UPI Details',`${subDirectory}setting/PaymentUPIDetails`)
            ]),
          getItem('USER', `${subDirectory}landing-page/user-account`, <RiUser3Line/>),
    );
    }else if (UserType === 'Admin' || UserType === 'Admin User') {
    
    items.push(
        getItem('SETTINGS', `${subDirectory}setting`,<FiSettings />, [
            getsubItem('Organization', `${subDirectory}setting/Organization-master`),
            getsubItem('Branch', `${subDirectory}setting/branch-master`),
        ]),
        getItem('USER MENU', `${subDirectory}setting/user`,<FiSettings />, [
            getsubItem('User Creation',  `${subDirectory}setting/user-master`),
            getsubItem('App Access',  `${subDirectory}setting/app-access`),
            getsubItem('Payment UPI Details',`${subDirectory}setting/PaymentUPIDetails`)
        ]),
        getItem('USER', `${subDirectory}landing-page/user-account`, <RiUser3Line/>),
    );
    }

    

    return (
        <div className='appPage'>
            <div className='sideNaveParent'>
                <div className="paypreLogoDiv">
                    <img src={payprelogo} alt='paypre logo' />
                </div>
                <SideMenu items={items} mode={'vertical'} theme={'light'}/>
            </div>
            <div className="centerPage">
                <CenterPage />
            </div>
        </div>
    )
}

export default AppPage