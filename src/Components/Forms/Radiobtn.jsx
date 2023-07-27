import { Radio } from 'antd';
import classnames from "classnames"



export const RadioButton = ({ fieldState, fieldApi, faClass,style, ...props }) => {

const { value } = fieldState
  const { setValue, setTouched } = fieldApi
  const { field, onChange, onBlur, initialValue, forwardedRef, className, content, ...rest } = props  
  console.log(props,"/////")




return (
<Radio
        {...rest}
        id={field}
        ref={forwardedRef}
        name={props.props.name}
        required={false}
        value={props.props.value}
        // style={{props.props}}
        className={classnames(` ${className}`, { "is-invalid": fieldState.error })}
        onChange={(e) => {
        // setValue(e.target.value)
        if (onChange) {
            onChange(e)
        }
        }}
        onBlur={(e) => {
        // setTouched(true)
        if (onBlur) {
            onBlur(e)
        }
        }}>{props.props.label}</Radio>
);
}


// export default RadioButton;



