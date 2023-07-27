import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined,ImportOutlined,SearchOutlined} from "@ant-design/icons";

// export const DropDowns = ({items}) => (
//   <Dropdown
//     menu={{
//       items,
//       selectable: true,
//       defaultSelectedKeys: ['1'],
//     }}
//   >
//     <Typography.Link>
//       <Space>
//         Selectable
//         <DownOutlined />
//       </Space>
//     </Typography.Link>
//   </Dropdown>
// );
 

// import { Select } from 'antd'; 
// export const DropDowns = ({options,placeholder}) => (
//   <Select
//     showSearch
//     style={{
//       width: 250, 
//     }}
//     placeholder={placeholder}  
//     optionFilterProp="children"
//     filterOption={(input, option) => (option?.label ?? '').includes(input)}
//     filterSort={(optionA, optionB) =>
//       (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
//     }
//     options={options} 
//   />
     
  
// ); 

import { Select } from 'antd'; 
import classnames from "classnames"
import FloatLabel from "./FloatLabel/index";
import React, { useEffect, useState } from "react";
import { Input, TreeSelect } from "antd";

export const DropDowns = ({options,onChangeFunction,isOnchanges,className,defaultValue,disabled,...props}) => {
  


  const [inpValue , setInputValue] = useState('')
  const [isOnchange,setisOnchange] =useState(isOnchanges)

  const changeStatus =async()=>{
    await setisOnchange(true)

  }

  {console.log(isOnchanges,"dhana check dropdown123")}
  const {
      field,
      onChange,
      label,
      onBlur,
      forwardedRef,
      required,
      valueData,
      ...rest
    } = props;
    console.log(valueData,"label",options)

    

  
    {console.log(valueData,isOnchange,"dhana check dropdown",typeof(inpValue),valueData!=null)}
return(
  
  <FloatLabel 
        label={label} 
        value = {inpValue}
        isOnChange ={valueData!=null ? true:isOnchange}
       > 
  
  <Select
    showSearch
    style={{
      width: 250
     
    }}
    defaultValue={defaultValue?defaultValue:null}
    // placeholder={label}
    optionFilterProp="children"
    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    // filterOption={(input, option) => (option?.label ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    value={valueData}
    onChange={(e) =>onChangeFunction(e)}
    onSelect={(e)=>changeStatus(e)}
    options={options} 
    className={classnames(` ${className}`)} 
    disabled={disabled ? true : false}
  />
   </FloatLabel>
     
      )
  };