import { Switch } from 'antd';
import classnames from "classnames"

export const Toggle = ({ style, defaultChecked,functionName,...props }) => {
    // const onChange = (checked) => {
    //     console.log(`switch to ${checked}`);
    //   };

      
      
      return  (
         
         <Switch 
         defaultChecked={defaultChecked}
         // className={classnames(` ${className}`, { "is-invalid": fieldState.error })} 
         onChange={functionName} 
         />

      );




}
