import { AppstoreOutlined, MailOutlined, SettingOutlined,PhoneOutlined,LoginOutlined, } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Button, Space } from 'antd';
import {Link} from 'react-router-dom' 
// import Logo from '../../Images/payprelogo.svg';  
import { DownOutlined, SmileOutlined, } from '@ant-design/icons';
import { Dropdown,} from 'antd'; 
import './ExtraNav.scss';

import {  MdOutlineLanguage  } from "react-icons/md";
import { BiSupport } from "react-icons/bi"; 

// const subDirectory = require("../../config.json").subDirectory;
 

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
       <MdOutlineLanguage/>/EN
      </Space>
    </a>
  </Dropdown>
</div>
 

</div>




        <div>
    <div  style={{ color: "black" }}>
                      <a fontSize="18px"  style={{ verticalAlign: "middle",  }} />
                      <PhoneOutlined />
        </div> 
        </div>
 
  </div>
 </div>   
  )
  // return  <Menu style={{  marginTop:"2rem", float:"right" }}  onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
 
};
 
export default ExtraNav;