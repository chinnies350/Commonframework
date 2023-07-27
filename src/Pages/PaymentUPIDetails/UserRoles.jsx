// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   changeRole,
//   selectRoleSelector,
// } from "../../features/ModuleAccess/moduleAccessSlice";
// import "./UserRoles.scss";
// import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
// import { getCookieData } from "../../Services/others";

// const UserRoles = () => {
//   const dispatch = useDispatch();
//   // const selectRole = useSelector(selectRoleSelector);
//   const [UserType, setUserType] = useState(
//     getCookieData("UserType") ? getCookieData("UserType") : null
//   );

//   const [selectRadioButtonValue, setselectRadioButtonValue] = useState(
//     useSelector(selectRoleSelector)
//   );

//   const content = [
//     { value: "Sadmin", label: "Sadmin" },
//     { value: "Admin", label: "Admin" }
//   ];



// //   useEffect(() => {
// //     try {

// //       if (UserType === "Admin") {
// //         setselectRadioButtonValue("Branch Admin");
// //         dispatch(changeRole({ id: "Branch Admin" }));
// //       }
// //     } catch (err) {
// //       console.log(err, "err");
// //     }
// //   }, []);

//   const selectValue = async (e) => {
//     setselectRadioButtonValue(e);
//     dispatch(changeRole({ id: e }));
//   };

//   return (
//     <>


//       <div className="moduleAccessSelectDrp">
//         <RadioGrpButton
//         content={content}
//         //   content={
//         //     UserType != "Super Admin" && UserType != "Super Admin User"
//         //       ? content.filter(
//         //         (a) => a.value != "Sadmin" && a.value != "Admin"
//         //       )
//         //       : content
//         //   }
//           fieldState={true}
//           defaultSelect={selectRadioButtonValue}
//           Header={"Roles"}
//           onSelectFuntion={(e) => selectValue(e)}
//         // style={{width:"250px"}}
//         />

//       </div>
//     </>
//   );
// };

// export default UserRoles;
