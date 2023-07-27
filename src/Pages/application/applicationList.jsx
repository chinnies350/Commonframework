import { useState, useEffect,useCallback} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Space} from "antd";
import { EditFilled, DeleteFilled,PlusOutlined,ReloadOutlined} from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table";
import { Search } from "../../Components/Forms/Search";
import  Buttons  from '../../Components/Forms/Buttons';
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import {applicationDataSelector, getApplicationData,deleteApplicationData} from "../../features/applicationPage/applicationPage.js"
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL

const ApplicationList = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const applicationData=useSelector(applicationDataSelector)

  //local states
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "Application",
      link: `${subDirectory}setting/application-master`,
    },
  
  ];
  
  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getApplicationData()).unwrap();
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

  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigateTo(`${subDirectory}setting/application-master/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
      
    }
    
  };
  
  const statusFormatter = async (row) => {
    let deleteData = {
      AppId: row.AppId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteApplicationData(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getApplicationData()).unwrap()
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
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
      title: "Application Name",
      dataIndex: "AppName",
      key: "AppName",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.AppName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.CateName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.SubCateName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
    
      sorter: (a, b) =>a.AppName.localeCompare(b.AppName),
      sortOrder: sortedInfo.columnKey === "AppName" ? sortedInfo.order : null,
      ellipsis: true,
      
    },
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",

      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.CategoryName.localeCompare(b.CategoryName),
      sortOrder:
        sortedInfo.columnKey === "CategoryName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
        title: "Sub Category",
        dataIndex: "SubCategoryName",
        key: "SubCategoryName",
  
        width: "200px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.SubCategoryName.localeCompare(b.SubCategoryName),
        sortOrder:
          sortedInfo.columnKey === "SubCategoryName" ? sortedInfo.order : null,
        ellipsis: true,
      },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record,index) =>
      applicationData.length >= 1 ? (
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

  const handelAddButton=()=>{
    navigateTo(`${subDirectory}setting/application-master/new`)
  }
  

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Application"} />
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
          <Tables columns={columns} data={applicationData} dataSource={applicationData}  onChange={handleChange} />{" "}
        </div>
        
      </div>
    </div>
  );

}

export default ApplicationList;