import { useState, useEffect,useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Space} from "antd";
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined} from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table";
import { Search } from "../../Components/Forms/Search";
import { Messages } from "../../Components/Notifications/Messages";
import  Buttons  from '../../Components/Forms/Buttons';
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import {companyDataSelector, getCompanyData,deleteCompanyData, getAdminUsers, AdminUsersSelector} from "../../features/companyPage/companyPage.js";
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL
const CompanyList = () => {

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const companyData=useSelector(companyDataSelector)



  const Adminusers = useSelector(AdminUsersSelector)

  //local states
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );
  
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "Organization",
      link: `${subDirectory}setting/Organization-master`,
    },
  
  ];

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getCompanyData()).unwrap();
      if(location?.state?.Notiffy){
        setMessageType(location?.state?.Notiffy.messageType)
        setMessageData(location?.state?.Notiffy.messageData)
        
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);
  
  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])

  const handleNavigate = () =>{
    navigateTo(`${subDirectory}setting/Organization-master/new`)
  }

  useEffect(() => {
    dispatch(getAdminUsers(getCookieData('UserId')));
  }, [getCookieData('UserId')]);
  


  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigateTo(`${subDirectory}setting/Organization-master/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
      
    }
    
  };
  
  const statusFormatter = async (row) => {
    let deleteData = {
      CompId: row.CompId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteCompanyData(deleteData)).unwrap()
    if (response.data.statusCode == 1){

        
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
        if (UserType === "Admin") {
          dispatch(getAdminUsers(getCookieData('UserId')));
        } else {
          await dispatch(getCompanyData()).unwrap()
        }
    }
  };
  const handleChange = (pagination, filters, sorter) => {
    
    setSortedInfo(sorter);
  };

  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }
  const columns = [
    {
      title: "Si.No",
      key: "sno",
      align: "center",
      width: "100px",
      render: (text, object, index) => (
        <a style={{ color: "black" }}>{index + 1}</a>
      ),
    },

    {
      title: "Organization Name",
      dataIndex: "CompName",
      key: "CompName",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.CompName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.CompShName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
    
      sorter: (a, b) => a.CompName.localeCompare(b.CompName),
      sortOrder: sortedInfo.columnKey === "CompName" ? sortedInfo.order : null,
      ellipsis: true,
      
    },
    {
      title: "Short Name",
      dataIndex: "CompShName",
      key: "CompShName",

      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.CompShName.localeCompare(b.CompShName),
      sortOrder:
        sortedInfo.columnKey === "CompShName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record,index) =>
      companyData.length >= 1 ? (
          <Space size="middle">
           {record.ActiveStatus === "A" ? <a>
              <EditFilled
                onClick={() => actionsFormatter(record,index)}
              />
            </a> : "" } 
            <a>
              {record.ActiveStatus === "A" ? <DeleteFilled
                style={{
                  color:"#EF5350",
                }}
                onClick={() => statusFormatter(record)}
              /> : <ReloadOutlined
                      style={{
                        color:"Green",
                      }}
                      onClick={() => statusFormatter(record)}
                    />
                }
              
            </a>
          </Space>
        ) : null,
    },
  ];
  

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Organization"} />
            </div>
            <div className='searchAddDiv'>
              <div className="formSearch">
                  <Search
                    placeholder='Search'
                    onSearch={onSearch}
                    onSearchChange={onSearchChange}
                  />
                </div>
                <Buttons
                    buttonText="Add New"
                    color="901D77"
                    icon={<PlusOutlined />}
                    handleSubmit={handleNavigate}
                    >
                    OPEN
                </Buttons>
            </div>
        </div>
        <div className="reportTable">
          {/* <Tables columns={columns} data={companyData} dataSource={companyData}  onChange={handleChange} />{" "} */}
          {UserType === 'Admin' || UserType === 'Admin User' ? (
              <Tables columns={columns} data={Adminusers} dataSource={Adminusers} onChange={handleChange} />
            ) : (
              // Render the table for other user types
              <Tables columns={columns} data={companyData} dataSource={companyData} onChange={handleChange} />
            )}
        </div>
      </div>
    </div>
  );

}

export default CompanyList;