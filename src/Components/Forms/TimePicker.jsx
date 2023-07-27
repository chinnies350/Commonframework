
import { TimePicker } from 'antd';
import FloatLabel from "./FloatLabel/index.jsx";
import "./main.scss";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)


export const TimePickers = ({label,isOnChange,onChange,valueData}) => (
 
    <div className="example">
       
      <FloatLabel 
        label={label} 
        isOnChange= {isOnChange}
       > 
        <TimePicker className="TimePickerDiv"
        use12Hours format="h:mm a" 
        onChange={onChange} 
        value={valueData != undefined ? dayjs(valueData, 'HH:mm:ss') :""}
        />
    
      </FloatLabel>
      
     
    </div>
  
);
export default TimePickers;

// import { TimePicker } from 'antd';
// import FloatLabel from "./FloatLabel/index.jsx";
// import "./main.scss";

// const onChange = (time, timeString) => {
//   console.log(time, timeString);
// };
// export const TimePickers = ({label,isOnChange}) => (
//     <div className="example">
//       <FloatLabel 
//         label={label} 
//         isOnChange= {isOnChange}
//        > 
//         <TimePicker className="TimePickerDiv"
//         use12Hours format="h:mm a" 
//         onChange={onChange} />
    
//       </FloatLabel>
      
     
//     </div>
  
// );
// export default TimePickers;