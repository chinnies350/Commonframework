import { AppstoreOutlined, MailOutlined,CalendarOutlined,SettingOutlined,LinkOutlined } from '@ant-design/icons';
import { IoBagHandleOutline } from "react-icons/io5";  
import { BiHomeSmile,BiCartAdd } from "react-icons/bi";  
import { TbCheckupList,TbReport } from "react-icons/tb"; 
import { FiSettings,} from "react-icons/fi"; 
import { RiUser3Line } from "react-icons/ri"; 
import { Divider, Menu, Switch } from 'antd';
import { useEffect, useState } from 'react';
import './sideMenu.scss'
import {  
  BrowserRouter,  
  Routes,  
  Route,  
  Link,
  useNavigate  
}   
from 'react-router-dom';  
import {emptyPostData,changeIntialRole} from "../../features/ModuleAccess/moduleAccessSlice";
import { emptyBreadCrumb } from '../../features/appPage/centerPage';
import { useDispatch} from "react-redux";

// import {CommonMaster} from '../Pages/UserForm'

// import {home} from '../../Components/'
// import TtdcLogo from "../../restaurant.svg";

import PaypreLogo from "../../Components/Icons/home.svg";
import HomeLogo from "../../Components/Icons/home.svg";
import menuLogo from "../../Components/Icons/menu.svg";
import OrderLogo from "../../Components/Icons/order.svg";
import ReportLogo from "../../Components/Icons/report.svg";
import SettingLogo from "../../Components/Icons/setting.svg";
import SignOutLogo from "../../Components/Icons/signout.svg";
import StockLogo from "../../Components/Icons/stock.svg";
import UserLogo from "../../Components/Icons/user.svg";

const subDirectory = import.meta.env.BASE_URL

const StyleLogo={width: "30px",borderColor:"red"}

const HomeLogos=<img style={StyleLogo} src={HomeLogo}></img>
const menuLogos=<img style={StyleLogo} src={menuLogo}></img>
const OrderLogos=<img style={StyleLogo} src={OrderLogo}></img>
const ReportLogos=<img style={StyleLogo} src={ReportLogo}></img>
const SettingLogos=<img style={StyleLogo} src={SettingLogo}></img>
const SignOutLogos=<img style={StyleLogo} src={SignOutLogo}></img>
const StockLogos=<img style={StyleLogo} src={StockLogo}></img>
const UserLogos=<img style={StyleLogo} src={UserLogo}></img>



export const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
}

export const getsubItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  }
//   const items = [
//     getItem('HOME', `${subDirectory}`, <BiHomeSmile className="iconsize" />),
//     getItem('BOOKING', `${subDirectory}booking`, <IoBagHandleOutline />),
//     getItem('STOCK', `${subDirectory}stock`, <BiCartAdd/>, [
//       getsubItem('SWEETS', `${subDirectory}sweets`),
//       getsubItem('SNACKS', `${subDirectory}snacks`),
//       getsubItem('Submenu', `${subDirectory}submenu`, null, [getsubItem('Option 5', 'Option5'), getsubItem('Option 6', 'Option6')]),
//     ]),
  
//     getItem('ORDER', 'ORDER7', <TbCheckupList/>),
//     getItem('REPORT', 'REPORT8', <TbReport/>  ),
//     // <Link to={`${subDirectory}/login`} style={{ color: "black", }}>
//     //                     <a fontSize="18px"  style={{ verticalAlign: "middle",  }} />
//     //                      Sign In 
//     //       </Link> ,
          
//     getItem('SETTING', `${subDirectory}setting`,<FiSettings />, [
//       getsubItem('Option 7', '/Option10'),
//       getsubItem('Option 8', '/Option11'),
//       getsubItem('Option 9', '/Option12'),
//       getsubItem('Option 10', '/Option13'),
//     ]),
  
//     getItem('USER', '9', <RiUser3Line/>),
//   //   getItem(
//   //     <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
//   //       Ant Design
//   //     </a>,
//   //     'link',
//   //     <LinkOutlined />,
//   //   ),
  
//   ];

const SideMenu = ({ mode, theme , items }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const navigatefun =(e) =>{
    console.log("navigate called",e)
    if (e==`${subDirectory}setting`) {
      dispatch(emptyBreadCrumb());
    }
    // dispatch(changeIntialRole());
    dispatch(emptyPostData());
    dispatch(changeIntialRole());
    navigate(e)
  }
  // const navigate=useNavigate()
    // const [mode, setMode] = useState('inline');
  // const [mode, setMode] = useState('vertical');
  // const [theme, setTheme] = useState('light');
  // const changeMode = (value) => {
  //   setMode(value ? 'vertical' : 'inline');
  // };


//   const changeTheme = (value) => {
//     setTheme(value ? 'dark' : 'light');
//   };
  return (
    <>
      {/* <Switch onChange={changeMode} /> Change Mode */}
      {/* <Divider type="vertical" />
      <Switch onChange={changeTheme} /> Change Style */}
    
      <Menu
        style={{
          width:'100%',
          height:'100%', 
          padding:'0px',
          paddingInline:'0px',
          paddingInlineEnd:'0px',
          paddingLeft:'0px'
        }}
        defaultSelectedKeys={['1']}
        onClick={(e)=>navigatefun(e.key)}
        // defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
        items={items}
      />
    </>
  );
};
export default SideMenu;