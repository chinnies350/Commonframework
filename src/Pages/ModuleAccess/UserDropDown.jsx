import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  userDataSelector,
  changeUser,
  emptyDataList,
  selectRoleSelector,
  selectedUserSelector,
  emptyModuleBranch,
} from "../../features/ModuleAccess/moduleAccessSlice";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import { Form } from "antd";

const UserDropDown = ({userIdValue}) => {
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);
  const selectedRole = useSelector(selectRoleSelector);
  const [SelectedUser, setSelectedUser] = useState(null);
  
  // console.log("userData",userData,userData)
  // const [SelectedType, setSelectedType] = useState(userData?true:false);
  
  console.log(userData,"1234")
  const [form] = Form.useForm();
  if (userData.length==0){
    form.resetFields();
  }
  useEffect(() => {
    if (userData.length===1){
        userIdValue(userData[0]?.["UserId"])
        setSelectedUser(userData[0]?.["UserId"])
        dispatch(changeUser({ userId: userData[0]?.["UserId"]}))
    }else if(userData.length==0){
      if (selectedRole=="Branch Admin"){
            setSelectedUser(null)
            dispatch(changeUser({ userId: null}))
            dispatch(emptyModuleBranch());
      }
    }
    
  },[userData])
  const userDropDownChange = (e) => {
    userIdValue(e)
    
    setSelectedUser(e)
    dispatch(changeUser({ userId: e}))
    dispatch(emptyDataList());


}

  return (
    <Form form={form}>
      <div className="moduleAccessSelectDrp">
      <Form.Item
          name="UserName"
      >
        {console.log("SelectedUser",SelectedUser,userData)}
        <DropDowns
          options={userData?.map((option) => ({
            value: option.UserId,
            label: option.UserName,
          }))}
          label="User Name"
          id="UserName"
          field="UserName"
          fieldState={true}
          fieldApi={true}
          valueData={SelectedUser}
          isOnchanges={SelectedUser?true:false}
          onChangeFunction={(e) => userDropDownChange(e)}
          className="field-DropDown"
        />
        </Form.Item>
      </div>
    </Form>
  );
};

export default UserDropDown;
