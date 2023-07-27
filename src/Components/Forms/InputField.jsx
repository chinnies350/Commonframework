import React, { useEffect, useState } from "react";
import { Input, TreeSelect, Select } from "antd";

import FloatLabel from "./FloatLabel/index.jsx";

// import "antd/dist/antd.css";
import "./main.scss";



export const InputField = ({fieldState, fieldApi, ...props}) => {
  console.log("fieldState",props.value)
    const { value } = fieldState;
  
    const [inpValue , setInputValue] = useState('')


    const {
        field,
        onChange,
        isOnChange,
        onBlur,
        label,
        forwardedRef,
        required,
        ...rest
      } = props;
    
      
  return (


    
    <div className="example">
      <FloatLabel 
        label={label} 
        value = {inpValue}
        isOnChange= {isOnChange}
       > 
        <Input 
                {...rest}
                id={field}
                ref={forwardedRef}
                // value={value}
                defaultValue={value?.toString()}
                required={required}   
                onChange={(e) => {
                  setInputValue(e.target.value)
                if (onChange) {
                onChange(e);
                }
                
                }}
                onBlur={(e) => {
                    if (onBlur) {
                    onBlur(e);
                    }
                }} 
                
        />
      </FloatLabel>
      
     
    </div>
  );
};




