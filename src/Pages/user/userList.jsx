import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import {
  EditFilled,
  DeleteFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import React from "react";
import { Tables } from "../../Components/Tables/Table.jsx";
import { Space } from "antd";
import Search from "../../Components/Forms/Search.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  userDataSelector,
  getUserData,
  deleteUserData,
  getBasedUserData,
  getBasedAdminUserData
} from "../../features/userPage/userPage.js";
import { getCookieData } from "../../Services/others";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";

const subDirectory = import.meta.env.BASE_URL;

let content = [
  { value: "Super Admin User", label: "Super Admin User" },
  { value: "Admin", label: "Admin" },
  { value: "Employee", label: "Employee" },
];

const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "UserCreation",
    link: `${subDirectory}setting/user-master`,
  },
];

const UserList = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [CommonDataFilter, setCommonDataFilter] = useState([]);
  const formRef = React.useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [RadioDefalut, setRadioDefalut] = useState(null);
  const [ShowAdminDropDown, setShowAdminDropDown] = useState(false);
  const [SelectedAdminNames, setSelectedAdminNames] = useState(null);
  const [AdminNames, setAdminNames] = useState([]);

  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );
  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );

  const CommonData = useSelector(userDataSelector);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const onSearch = (value) => {
    setSearchedText(value);
  };
  const onSearchChange = (e) => {
    setSearchedText(e.target.value);
  };

  const onChange = async (e) => {
    await dispatch(getUserData()).unwrap()
    setRadioDefalut(e);
    setSelectedAdminNames(null)
    console.log(CommonData, "////////////////////");
    setAdminNames([])
    if (e === "Super Admin User") {
      setShowAdminDropDown(false);
      setCommonDataFilter(CommonData.filter((a) => a.UserTypeName=== "Super Admin User"))
    } else if (e === "Employee") {
      setShowAdminDropDown(true);
      setAdminNames(CommonData.filter((a) => a.UserTypeName=== "Admin"))
    } else {
      setShowAdminDropDown(false);
      setCommonDataFilter(CommonData.filter((a) => a.UserTypeName=== "Admin"))
    }
  };

  const onChangeAdminNames =async(e)=>{
    setSelectedAdminNames(e)
    // /user?UserType=A&UserId=2
    let userData=await dispatch(getBasedAdminUserData(e)).unwrap();
    if(userData.data.statusCode==1){
      setCommonDataFilter(userData.data.data)
    }
    else{
      setCommonDataFilter([])
    }
    

  }

  useEffect(()=>{
   if(UserType!="Admin"){
    dispatch(getUserData()).unwrap();

   }

  },[RadioDefalut])

  useEffect(()=>{
    if(RadioDefalut===null ){
    setCommonDataFilter(CommonData)
  }

  },[CommonData])

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      if (UserType === "Admin") {
        dispatch(getBasedUserData(UserId)).unwrap();
      } else {
        dispatch(getUserData()).unwrap();
      }
      if (location?.state?.Notiffy) {
        setMessageType(location?.state?.Notiffy.messageType);
        setMessageData(location?.state?.Notiffy.messageData);
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);

  const [form] = Form.useForm();
  const actionsFormatter = async (row, rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigateTo(
        `${subDirectory}setting/user-master/update`,
        { state: { editstate: row } },
        { key: rowIndex }
      );
    }
  };

  const statusFormatter = async (row) => {
    let deleteData = {
      UserId: row.UserId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData("UserId") || 7,
    };
    let response = await dispatch(deleteUserData(deleteData)).unwrap();
    if (response.data.statusCode == 1) {
      // dispatch(getUserData()).unwrap();
      if (UserType === "Admin") {
        dispatch(getBasedUserData(UserId)).unwrap();
      } else {
        dispatch(getUserData()).unwrap();
      }
      setMessageType("success");
      setMessageData(
        row.ActiveStatus == "A"
          ? "In-Activated Successfully"
          : "Activated Successfully"
      );
    }
  };

  const columns = [
    {
      title: "SI.NO",
      key: "sno",
      align: "center",
      width: "100px",
      render: (text, object, index) => (
        <a style={{ color: "black" }}>{index + 1}</a>
      ),
    },

    {
      title: "User Name",
      dataIndex: "UserName",
      key: "UserName",
      width: "170px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.UserName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.CompName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.BrName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.MobileNo).toLowerCase().includes(value.toLowerCase())
        );
      },
      sorter: (a, b) => a.UserName.localeCompare(b.UserName),
      sortOrder: sortedInfo.columnKey === "UserName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    // {
    //   title: "Company Name",
    //   dataIndex: "CompName",
    //   key: "CompName",

    //   width: "170px",
    //   align: "center",
    //   render: (text) => <a style={{ color: "black" }}>{text}</a>,
    //   sorter: (a, b) => a.CompName.localeCompare(b.CompName),
    //   sortOrder: sortedInfo.columnKey === "CompName" ? sortedInfo.order : null,
    //   ellipsis: true,
    // },
    // {
    //   title: "Branch Name",
    //   dataIndex: "BrName",
    //   key: "BrName",

    //   width: "170px",
    //   align: "center",
    //   render: (text) => <a style={{ color: "black" }}>{text}</a>,
    //   sorter: (a, b) => a.BrName.localeCompare(b.BrName),
    //   sortOrder: sortedInfo.columnKey === "BrName" ? sortedInfo.order : null,
    //   ellipsis: true,
    // },
    
    {
      title: "Email Id",
      dataIndex: "MailId",
      key: "MailId",

      width: "170px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.MobileNo - b.MobileNo,
      sortOrder: sortedInfo.columnKey === "MailId" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Mobile Number",
      dataIndex: "MobileNo",
      key: "MobileNo",

      width: "170px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.MobileNo - b.MobileNo,
      sortOrder: sortedInfo.columnKey === "MobileNo" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record, index) =>
        CommonData.length >= 1 ? (
          <Space size="middle">
            {record.ActiveStatus === "A" ? (
              <a>
                <EditFilled onClick={() => actionsFormatter(record, index)} />
              </a>
            ) : (
              ""
            )}
            <a>
              {record.ActiveStatus === "A" ? (
                <DeleteFilled
                  style={{
                    color: "#EF5350",
                  }}
                  onClick={() => statusFormatter(record)}
                />
              ) : (
                <ReloadOutlined
                  style={{
                    color: "Green",
                  }}
                  onClick={() => statusFormatter(record)}
                />
              )}
            </a>
          </Space>
        ) : null,
    },
  ];
  const data = CommonDataFilter;

  const handelAddButton=()=>{
    navigateTo(`${subDirectory}setting/user-master/new`)
  }

  return (
    <div className="userPageTable">
      <div className="userPageContent">
        <Messages
          messageType={messageType}
          messageData={messageData}
          onComplete={onComplete}
        />
        <div className="formAddNew">
          <div>
            <FormHeader title={"User Creation"} />
          </div>

          <div className="searchAddDiv">
            <div className="formSearch">
              <Search
                placeholder="Search"
                onSearch={onSearch}
                onSearchChange={onSearchChange}
              />
            </div>
            {UserType!="Admin"?
           
            <DropDowns
              options={content?.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              placeholder="Select Roles"
              label="Select Roles"
              className="field-DropDown"
              isOnchanges={RadioDefalut ? true : false}
              onChangeFunction={(e) => onChange(e)}
              valueData={RadioDefalut}
              disabled={false}
            />:null
          }
            {ShowAdminDropDown ? (
              <DropDowns
                options={AdminNames?.map((option) => ({
                  value: option.UserId,
                  label: option.UserName?option.UserName:option.MobileNo,
                }))}
                placeholder="Admin Name"
                label="Admin Name"
                className="field-DropDown"
                isOnchanges={SelectedAdminNames ? true : false}
                onChangeFunction={(e) => onChangeAdminNames(e)}
                valueData={SelectedAdminNames}
                disabled={false}
              />
            ) : null}
            <Buttons
                  buttonText={"Add New"}
                    handleSubmit={()=>handelAddButton()}
                  color="901D77"
                  icon={<PlusOutlined />}
                  >
                  OPEN
              </Buttons>
          </div>
        </div>
        <div className="reportTable">
          <Tables
            columns={columns}
            data={data}
            dataSource={data}
            onChange={handleChange}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default UserList;
