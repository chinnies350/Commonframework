import { useState, useEffect,useCallback } from "react";
import { useDispatch } from "react-redux";
import { Space, Form } from "antd";
import { EditFilled, DeleteFilled,ReloadOutlined } from "@ant-design/icons";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { Tables } from "../../Components/Tables/Table";
import FormHeader from "../pageComponents/FormHeader.jsx";
import Search from "../../Components/Forms/Search.jsx";
import { Link } from 'react-router-dom';
import  Buttons  from '../../Components/Forms/Buttons';
import { PlusOutlined  } from '@ant-design/icons';
import { Messages } from "../../Components/Notifications/Messages";
import { useNavigate,useLocation } from "react-router-dom";
import { getCookieData } from "../../Services/others";
import {getpricingAppFeatMap,deleteFeatureMapping} from "../../features/featureMapping/featureMapping.js";


const subDirectory = import.meta.env.BASE_URL


const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "FeatureMapping",
    link: `${subDirectory}setting/feature-mapping`,
  },
];

const AppPriceFeatureMapping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [TableData, setTableData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");

  const [form] = Form.useForm();

  async function fetchData() {      
    const gettingTableData = await dispatch(getpricingAppFeatMap()).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      
      await setTableData(gettingTableData.data.data.filter(a=>a.ActiveStatus==='A'));
    }
  }

  useEffect(() => {
    try {
      if(location?.state?.Notiffy){
        setMessageType(location?.state?.Notiffy.messageType)
        setMessageData(location?.state?.Notiffy.messageData)
        
      }
      fetchData();

    } catch (err) {
      console.log(err, "err");
    }
  }, []);


  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);


  const handleChange = (pagination, filters, sorter) => {
    
    setSortedInfo(sorter);
  };

  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }

  //edit
  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigate(`${subDirectory}setting/feature-mapping/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
      
    }
    
  };
 //Delete
 const statusFormatter = async (row) => {
  let deleteData = {
    AppId: row.AppId ,
    PricingId:row.PricingId,
    ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
    UpdatedBy: getCookieData('UserId') || 7
  };
  let response=await dispatch(deleteFeatureMapping(deleteData)).unwrap()
  if (response.data.statusCode == 1){
      
      setMessageType("success")
      setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
      fetchData();
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
            .includes(value.toLowerCase())

)},

      sorter: (a, b) => a.AppName.localeCompare(b.AppName),
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
      sorter: (a, b) => a.PricingName.localeCompare(b.PricingName),
      sortOrder:
        sortedInfo.columnKey === "PricingName" ? sortedInfo.order : null,
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
  const data = TableData;

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
  }, [])

  const handelAddButton=()=>{
    navigate(`${subDirectory}setting/feature-mapping/new`)
  }

  return (
    <div className="userPageTable">
    <div className="userPageContent">
    <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
    <div className="formAddNew">
          <div>
              <FormHeader title={"Feature Mapping"} />
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
        <Tables columns={columns} data={TableData} dataSource={TableData}  onChange={handleChange} />
      </div>
    </div>
  </div>
  );
};

export default AppPriceFeatureMapping;
