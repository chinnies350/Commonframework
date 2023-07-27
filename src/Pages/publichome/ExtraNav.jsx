import { AppstoreOutlined, MailOutlined, SettingOutlined,PhoneOutlined,LoginOutlined, } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Button, Space } from 'antd';
import {Link} from 'react-router-dom' 
import Logo from '../../Images/payprelogo.svg';  
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown,} from 'antd'; 
import './ExtraNav.scss';

import {  MdOutlineLanguage  } from "react-icons/md";
import { BiSupport } from "react-icons/bi"; 

// const subDirectory = require("../../config.json").subDirectory;

const items = [
 
  
  {
    label: 'Contact Sales',
    key: 'SubMenu',
    icon:<PhoneOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },

  


  {
    // label: 'Sign In',
    // key: 'app',
   

     disabled: false,
    label: (
     
        <Link to={`/login`}>
                      <a fontSize="18px"  style={{ verticalAlign: "middle",  }} />
                       Sign In
                        {/* <FiLogIn  style={{ fontSize: "18px" }}  /> */}
        </Link> 
    ),
  
    
  }, 
 
  {
    label: (
     
        <Button style={{ backgroundColor: 'black', width:"140px", height:"auto", fontSize:"16px",  justifyContent:"center",  }} type="primary"> 
       <Link to={`/UserProfile`}>
                      <a fontSize="18px" style={{ verticalAlign: "middle" }} />
                       Free Account
        </Link> 
        </Button>  
    ),
    key: 'alipay',
  }, 
  
];

  

const dropitems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];



const ExtraNav = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
 <div className='extranav'>
 
  <div className='extranavItems'>
 
<div className='extranavdropdowns' > 
   
<div> 
<Dropdown
    menu={{
      items:dropitems,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space style={{ verticalAlign: "middle"  }}>
       <MdOutlineLanguage/> English
      </Space>
    </a>
  </Dropdown>
</div>
 

</div>




        <div>
    <Link  style={{ color: "black" }}>
                      <a fontSize="18px"  style={{ verticalAlign: "middle",  }} />
                      <BiSupport/>
        </Link> 
        </div>
 
  </div>
 </div>   
  )
  // return  <Menu style={{  marginTop:"2rem", float:"right" }}  onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
 
};
 
export default ExtraNav;