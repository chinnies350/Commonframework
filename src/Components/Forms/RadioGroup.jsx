// import { Radio } from 'antd';
// import { useState } from 'react';
// import classnames from "classnames"
// import './RadioBtn.scss'
// export const RadioGrpButton = ({ fieldState, fieldApi, faClass,style, ...props }) => {
//     // const { value } = fieldState
//     // const { setValue, setTouched } = fieldApi

// const { field, onBlur, initialValue, forwardedRef, className, content, ...rest } = props.props 
// console.log(props.props,"kkkkkk")
//   const [value, setValue] = useState(0);
//   const onChange = (e) => {
//     console.log('radio checked', e.target.value);
//     setValue(e.target.value);
//   };

//   return (
    
//     <Radio.Group onChange={onChange} value={value} >
     
//       {props?.props?.map((key,index)=>
//       <Radio 
//         value={key.value} 
//         key={index}
//         style={{style}}
//         className={classnames(` ${className}`, { "is-invalid": fieldState.error })}
      
//       >{key.label}</Radio>
      
//       )}
      
//     </Radio.Group>
//   );
// };


import { Radio } from 'antd';
import { useState } from 'react';
import classnames from "classnames"
import './RadioBtn.scss'
export const RadioGrpButton = ({ fieldState,style, ...props }) => {
    // const { value } = fieldState
    // const { setValue, setTouched } = fieldApi

const { field, onBlur, initialValue, forwardedRef, className,onSelectFuntion, content,Header,defaultSelect ,...rest } = props 

  const [value, setValue] = useState(defaultSelect);
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    if(onSelectFuntion){
        onSelectFuntion(e.target.value)
    }
  };

  return (
    <div>
    <p style={{paddingBottom:"10px",fontWeight:"500"}}>{Header}</p>
            
    <Radio.Group onChange={onChange} value={value} >
     
    {console.log("valuevalue",content)}
      {content?.map((key,index)=>
     
      <Radio 
        value={key.value} 
        key={index}
        className={classnames(` ${className}`, { "is-invalid": fieldState.error })}
      
      >{key.label}</Radio>
      
      )}
      
    </Radio.Group>
    </div>
  );
};
