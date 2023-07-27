import { Button, ConfigProvider  } from 'antd';
import './main.scss'

const TertiaryButton = ({buttonText,color,handleSubmit,lineWidth,icon, htmlType, disabled}) =>

(
        <Button type="primary" 
                className="tertiary_Button" 
                onClick={handleSubmit}
                htmlType= {htmlType ?"submit" : ''} 
                disabled={disabled ? disabled: false}
        >{buttonText}{icon}
        </Button>
        
    
);

// (

    
//         <ConfigProvider
//             theme={{
//             // token: {
//             //     colorPrimary: color,   
//             // },
//             }}
//         > 
//             <Button type="primary" htmlType="submit"  className="tertiary_Button" onClick={handleSubmit} color={color}>{buttonText}{icon}</Button>
//             {/* <Button disabled>SUBMIT</Button> */}
    
//          </ConfigProvider>
        
//     );

export default TertiaryButton;


