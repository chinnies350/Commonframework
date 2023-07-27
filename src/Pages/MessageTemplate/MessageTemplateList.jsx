import { useState, useEffect,useCallback} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { Space} from "antd";
import { EditFilled,PlusOutlined} from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table";
import { Search } from "../../Components/Forms/Search";
import  Buttons  from '../../Components/Forms/Buttons';
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { getMessagetemplateData, messagetemplateSelector } from '../../features/MessageTemplates/MessageTemplate';


const subDirectory = import.meta.env.ENV_BASE_URL

const MessageTemplateList = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const MessagetemplateData=useSelector(messagetemplateSelector)

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
      name: "MessageTemplates",
      link: `${subDirectory}setting/message-template`,
    },
  
  ];
  
  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getMessagetemplateData()).unwrap();
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
      navigateTo(`${subDirectory}setting/message-template/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
    
  };
  
//   const statusFormatter = async (row) => {
//     let deleteData = {
//       AppId: row.AppId,
//       ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
//       UpdatedBy: getCookieData('UserId') || 7
//     };
//     let response=await dispatch(deleteApplicationData(deleteData)).unwrap()
//     if (response.data.statusCode == 1){
//         dispatch(getApplicationData()).unwrap()
//         setMessageType("success")
//         setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
//     }
//   };

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
      title: "Message Header",
      dataIndex: "MessageHeader",
      key: "MessageHeader",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.MessageHeader)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.Subject)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.TemplateType)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
    
      sorter: (a, b) =>a.MessageHeader.localeCompare(b.MessageHeader),
      sortOrder: sortedInfo.columnKey === "MessageHeader" ? sortedInfo.order : null,
      ellipsis: true,
      
    },
    {
        title: "Subject",
        dataIndex: "Subject",
        key: "Subject",
  
        width: "200px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.Subject.localeCompare(b.Subject),
        sortOrder:
          sortedInfo.columnKey === "Subject" ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
      title: "Message Body",
      dataIndex: "MessageBody",
      key: "MessageBody",

      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.MessageBody.localeCompare(b.MessageBody),
      sortOrder:
        sortedInfo.columnKey === "MessageBody" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
        title: "Template Type",
        dataIndex: "TemplateType",
        key: "TemplateType",
  
        width: "200px",
        align: "center",
        render: (text) => <a style={{ color: "black" }}>{text}</a>,
        sorter: (a, b) => a.TemplateType.localeCompare(b.TemplateType),
        sortOrder:
          sortedInfo.columnKey === "TemplateType" ? sortedInfo.order : null,
        ellipsis: true,
      },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record,index) =>
      MessagetemplateData.length >= 1 ? (
          <Space size="middle">
           <a>
              <EditFilled
                onClick={() => actionsFormatter(record,index)}
              />
            </a> 
            {/* <a>
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
              
            </a> */}
          </Space>
        ) : null,
    },
  ];
  const handelAddButton=()=>{
    navigateTo(`${subDirectory}setting/message-template/new`)
  }

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Message Templates"} />
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
          <Tables columns={columns} data={MessagetemplateData} dataSource={MessagetemplateData}  onChange={handleChange} />{" "}
        </div>
        
      </div>
    </div>
  );

}

export default MessageTemplateList;