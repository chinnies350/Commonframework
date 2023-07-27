import {  useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { changeRole, selectRoleSelector,emptyPostData } from '../../features/ModuleAccess/moduleAccessSlice'
import './UserRoles.scss';
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import { getCookieData } from "../../Services/others";

const UserRoles = ({getUserRole}) => {
    const dispatch = useDispatch()
    const selectRole = useSelector(selectRoleSelector);
    console.log(selectRole,"test")
 
    const role = ['Sadmin', 'Company Admin', 'Branch Admin']
    console.log(role,selectRole,"eachItem2")
    const [selectRadioButtonValue,setselectRadioButtonValue]=useState(useSelector(selectRoleSelector))
    
    const selectValue = async (e) => {
        setselectRadioButtonValue(e);
        getUserRole(e);
        dispatch(emptyPostData());
        dispatch(changeRole({id: e}))

      };
    

    return (
        
        <>
        
        <div className="moduleAccessSelectDrp">
           
            <RadioGrpButton
                    content={getCookieData("UserType")=="Admin"?[
                      { value: "Company Admin", label: "Admin" },
                      { value: "Branch Admin", label: "Employee" },
                    ]:[
                        { value: "Sadmin", label: "Super Admin User" },
                        { value: "Company Admin", label: "Admin" },
                        { value: "Branch Admin", label: "Employee" },
                      ]}
                    fieldState={true}
                    defaultSelect={selectRadioButtonValue}
                    Header={"Roles"}
                    onSelectFuntion={(e) => selectValue(e)}
                   
                  />

        </div>
        </>
    )
}

export default UserRoles