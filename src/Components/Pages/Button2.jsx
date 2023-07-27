import { Button, ConfigProvider  } from 'antd';
import '../Forms/main.scss'
 
const Buttons = ({buttonText,color,handleSubmit,lineWidth,icon}) =>

(

    
    <ConfigProvider
        theme={{
        // token: {
        //     colorPrimary: color,   
        // },
        }}
    > 
        <Button type="primary"  className="secondary_Button" onClick={handleSubmit}>{buttonText}{icon}</Button>
        {/* <Button disabled>SUBMIT</Button> */}

     </ConfigProvider>
    
);

 

export default Buttons;


