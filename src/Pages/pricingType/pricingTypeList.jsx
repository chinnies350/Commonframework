import { useState, useEffect, useRef,useCallback } from "react";
import { useDispatch } from "react-redux";
import { Space, Form } from "antd";
import { EditFilled, DeleteFilled,PlusOutlined,ReloadOutlined } from "@ant-design/icons";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { Tables } from "../../Components/Tables/Table";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { useNavigate,useLocation } from "react-router-dom";
import Search from '../../Components/Forms/Search.jsx';
import { Link } from 'react-router-dom';
import  Buttons  from '../../Components/Forms/Buttons';
import {getPricingType,deletePriceType} from "../../features/priceType/priceType.js";
import { getCookieData } from "../../Services/others";
import { Messages } from "../../Components/Notifications/Messages";
const subDirectory = import.meta.env.BASE_URL

const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "PricingType",
    link: `${subDirectory}setting/pricing`,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [TableData, setTableData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");


  async function fetchData() {
    if(location?.state?.Notiffy){
      setMessageType(location?.state?.Notiffy.messageType)
      setMessageData(location?.state?.Notiffy.messageData)
      
    }
   
    const gettingTableData =  await dispatch(getPricingType()).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      setTableData(gettingTableData.data.data);
    }
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (err) {
      console.log(err, "err");
    }
  }, []);



  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);



  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  

  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigate(`${subDirectory}setting/pricing/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
      
    }
    
  };

  //Delete
  const statusFormatter = async (row) => {
    let deleteData = {
      PricingId: row.PricingId ,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deletePriceType(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        fetchData();
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
        
    }
  };

  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }

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
      title: "App Name",
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
                                    String(record.PricingName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.Price)
                                            .toLowerCase()
                                            .includes(value.toLowerCase()) 
                          
                )},
      sorter: (a, b) => a.AppName.length - b.AppName.length,
      sortOrder: sortedInfo.columnKey === "AppName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Pricing Name",
      dataIndex: "PricingName",
      key: "PricingName",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.PricingName || null,
      onFilter: (value, record) => record.PricingName.includes(value),
      sorter: (a, b) => a.PricingName.length - b.PricingName.length,
      sortOrder:
        sortedInfo.columnKey === "PricingName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Net Price",
      dataIndex: "NetPrice",
      key: "NetPrice",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.NetPrice || null,
      onFilter: (value, record) => record.NetPrice.includes(value),
      sorter: (a, b) => a.NetPrice.length - b.NetPrice.length,
      sortOrder: sortedInfo.columnKey === "NetPrice" ? sortedInfo.order : null,
      ellipsis: true
    },

    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.Price || null,
      onFilter: (value, record) => record.Price.includes(value),
      sorter: (a, b) => a.Price.length - b.Price.length,
      sortOrder: sortedInfo.columnKey === "Price" ? sortedInfo.order : null,
      ellipsis: true,
    },
    
    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record,index) =>
        TableData.length >= 1 ? (
      

          <Space size="middle">
          {/* edit cmd */}
           {/* {record.ActiveStatus === "A" ? <a>
              <EditFilled
                onClick={() => actionsFormatter(record,index)}
              />
            </a> : "" }  */}
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
  const data = TableData;

 

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
  }, [])

  const handelAddButton=()=>{
    navigate(`${subDirectory}setting/pricing/new`)
  }

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Pricing Type"} />
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
          <Tables columns={columns} data={TableData} dataSource={TableData}  onChange={handleChange} />{" "}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
