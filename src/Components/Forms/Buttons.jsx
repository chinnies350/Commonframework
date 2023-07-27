import { Button, ConfigProvider  } from 'antd';
import './main.scss'
 
const Buttons = ({buttonText,color,handleSubmit,lineWidth,icon,disabled}) =>

(

    
    <ConfigProvider
        theme={{
        // token: {
        //     colorPrimary: color,   
        // },
        }}
    > 
        <Button type="primary" htmlType="submit"  className="primary_Button" onClick={handleSubmit} color={color} disabled={disabled ? disabled: false} >{buttonText}{icon}</Button>
        {/* <Button disabled>SUBMIT</Button> */}

     </ConfigProvider>
    
);

 

export default Buttons;


