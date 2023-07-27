import { DatePicker, Space } from 'antd';
import classnames from "classnames"
import dayjs from 'dayjs';
// const onChange = (date, dateString) => {
//   console.log(date, dateString);
// };
export const DatePic = ({ fieldState, fieldApi, ...props }) => {

    const { value } = fieldState;
  const { setValue, setTouched, setError } = fieldApi;
  const { required,field, onChange, onBlur, canSelectPast,initialValue, forwardedRef, min, className, content, faClass, icon, ...rest } = props;
    
  const disabledDate = (current) => {

    // return current > dayjs().endOf('day'); for today & below date slect
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return current.valueOf() <= date.setDate(date.getDate() - 2)
  };
  // console.log(props.props.canSelectPast,"//////" )
    return(

      
        <Space direction="vertical">
            <DatePicker 
            {...rest}
            id={field}
            type="date"
            ref={forwardedRef}
            required={required}
            value={value}
            disabledDate={canSelectPast ? "": disabledDate}
            format="DD-MM-YYYY"
            className={classnames(`form-control ${className}`, {
              "is-invalid": fieldState.error,
            })}
            onChange={onChange}
            />
        </Space>
    );
}
