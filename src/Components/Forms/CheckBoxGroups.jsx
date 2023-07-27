import { Checkbox, Divider } from 'antd';
import { useState } from 'react';
import classnames from "classnames"
const CheckboxGroup = Checkbox.Group;

export const CheckBoxGroup = ({ fieldState, fieldApi, faClass,style,ListOfCheckBox,defaultCheckedList, ...props }) => {
      // const { value } = fieldState
    // const { setValue, setTouched } = fieldApi

    //example props.props.ListOfCheckBox =['Apple', 'Pear', 'Orange'];
    const plainOptions = ListOfCheckBox ;

    // //example props.props.defaultCheckedList =['Apple', 'Pear'];
    // const defaultCheckedList = defaultCheckedList;

  const { field, onBlur, initialValue, forwardedRef, className, content, ...rest} = props.props 
  console.log(className)
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all
      </Checkbox>
      <Divider />
      <CheckboxGroup 
        options={plainOptions} 
        value={checkedList} 
        onChange={onChange}
        className={classnames(` ${className}`, { "is-invalid": fieldState.error })} 
      />
    </>
  );
};
