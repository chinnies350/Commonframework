import { useState, useEffect,useCallback} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Space} from "antd";
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined} from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table";
import { Search } from "../../Components/Forms/Search";
import  Buttons  from '../../Components/Forms/Buttons';
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
// import { getMessagetemplateData, messagetemplateSelector } from '../../features/MessageTemplates/MessageTemplate';
import { getPaymentUPIDetails, PaymentUPIDetailsSelector,deletePaymentUPIDetails,AdminPaymentUPIDataSelector,getAdminPaymentUPIDetails } from '../../features/paymentUPIdetails/paymentUPIdetails';
import { getCookieData } from "../../Services/others";


const subDirectory = import.meta.env.ENV_BASE_URL

const PaymentUPIDetailsList = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const PaymentUPIDetails=useSelector(PaymentUPIDetailsSelector)
  console.log('PaymentUPIDetails',PaymentUPIDetails)
  const AdminPaymentUPIDetails=useSelector(AdminPaymentUPIDataSelector)
  console.log('AdminPaymentUPIDetails',AdminPaymentUPIDetails)

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
      name: "PaymentUPIDetails",
      link: `${subDirectory}setting/PaymentUPIDetails`,
    },
  
  ];
  
  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getPaymentUPIDetails()).unwrap();
      if(location?.state?.Notiffy){
        setMessageType(location?.state?.Notiffy.messageType)
        setMessageData(location?.state?.Notiffy.messageData)
        
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    dispatch(getAdminPaymentUPIDetails(getCookieData('UserId')));
  }, [getCookieData('UserId')]);


  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])

  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
        navigateTo(`${subDirectory}setting/PaymentUPIDetails/update`,
                      {state:{editstate: row}},
                      {key:rowIndex}
                  )
        
      }
    
  };
  
  const statusFormatter = async (row) => {
    let deleteData = {
      PaymentUPIDetailsId: row.PaymentUPIDetailsId,
      CompId:row.CompId,
      BranchId:row.BrId,
      ActiveStatus: row.activeStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deletePaymentUPIDetails(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
        if (UserType === "Admin") {
          dispatch(getAdminPaymentUPIDetails(getCookieData('UserId')));
        } else {
          await dispatch(getPaymentUPIDetails()).unwrap()
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

    // {
    //   title: "Mobile Number",
    //   dataIndex: "MobileNo",
    //   key: "MobileNo",
    //   width: "150px",
    //   align: "center",
    //   render: (text) => (
    //     <a style={{ color: "black", width: "200px" }}>{text}</a>
    //   ),
    //   filteredValue: [searchedText],
    //   onFilter: (value, record) => {return (
    //                                 String(record.MobileNo)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) ||
    //                                 String(record.Name)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) ||
    //                                 String(record.UPIId)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) ||
    //                                 String(record.AdminName)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) ||
    //                                 String(record.CompName)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) ||
    //                                 String(record.BrName)
    //                                     .toLowerCase()
    //                                     .includes(value.toLowerCase()) 
                                    
    //             )},
    
    //   sorter: (a, b) =>a.MobileNo.localeCompare(b.MobileNo),
    //   sortOrder: sortedInfo.columnKey === "MobileNo" ? sortedInfo.order : null,
    //   ellipsis: true,
      
    // },
    {
        title: "UPI Id",
        dataIndex: "UPIId",
        key: "UPIId",
  
        width: "150px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.UPIId.localeCompare(b.UPIId),
        sortOrder:
          sortedInfo.columnKey === "UPIId" ? sortedInfo.order : null,
        ellipsis: true,
    },

    {
        title: "Admin Name",
        dataIndex: "AdminName",
        key: "AdminName",
        width: "150px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.AdminName.localeCompare(b.AdminName),
        sortOrder:
          sortedInfo.columnKey === "AdminName" ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
      title: "Organization Name",
      dataIndex: "CompName",
      key: "CompName",

      width: "150px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.CompName.localeCompare(b.CompName),
      sortOrder:
        sortedInfo.columnKey === "CompName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
        title: "Branch Name",
        dataIndex: "BrName",
        key: "BrName",
  
        width: "150px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.BrName.localeCompare(b.BrName),
        sortOrder:
          sortedInfo.columnKey === "BrName" ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: "Mode",
        dataIndex: "ModeName",
        key: "ModeName",
  
        width: "150px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.ModeName.localeCompare(b.ModeName),
        sortOrder:
          sortedInfo.columnKey === "ModeName" ? sortedInfo.order : null,
        ellipsis: true,
      },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "150px",
      align: "center",
      render: (_, record,index) =>
      PaymentUPIDetails.length >= 1 ? (
          <Space size="middle">
           {record.activeStatus === "A" ? <a>
              <EditFilled
                onClick={() => actionsFormatter(record,index)}
              />
            </a> : "" }  
            <a>
              {record.activeStatus === "A" ? <DeleteFilled
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
    navigateTo(`${subDirectory}setting/PaymentUPIDetails/new`)
  }


  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Payment UPI Details"} />
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
          {/* <Tables columns={columns} data={PaymentUPIDetails} dataSource={PaymentUPIDetails}  onChange={handleChange} />{" "} */}
          {UserType === 'Admin' || UserType === 'Admin User' ? (
              <Tables columns={columns} data={AdminPaymentUPIDetails} dataSource={AdminPaymentUPIDetails} onChange={handleChange} />
            ) : (
              // Render the table for other user types
              <Tables columns={columns} data={PaymentUPIDetails} dataSource={PaymentUPIDetails} onChange={handleChange} />
            )}
        </div>
        
      </div>
    </div>
  );

}

export default PaymentUPIDetailsList;