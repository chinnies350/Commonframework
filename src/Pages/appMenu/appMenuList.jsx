import { useState, useEffect, useRef,useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Space, Form } from "antd";
import { EditFilled, DeleteFilled,ReloadOutlined } from "@ant-design/icons";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { Tables } from "../../Components/Tables/Table";
import FormHeader from "../pageComponents/FormHeader.jsx";
// import { getAppMenuList } from "../../Services/AppMenuService.js";
import { useNavigate,useLocation } from "react-router-dom";
import Search from "../../Components/Forms/Search.jsx";
import { Link } from 'react-router-dom';
import  Buttons  from '../../Components/Forms/Buttons';
import { PlusOutlined  } from '@ant-design/icons';
import {getAppMenuList,deleteAppMenu} from "../../features/appMenu/appMenu.js";
import { getCookieData } from "../../Services/others";
import { Messages } from "../../Components/Notifications/Messages";
const subDirectory = import.meta.env.BASE_URL

const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "ApplicationMenu",
    link: `${subDirectory}setting/app-menu`,
  },

];

const AppMenu = () => {
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
    if(location?.state?.Notiffy){
      setMessageType(location?.state?.Notiffy.messageType)
      setMessageData(location?.state?.Notiffy.messageData)
      
    }
    const gettingTableData = await dispatch(getAppMenuList()).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      await setTableData(gettingTableData.data.data);
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


  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };



  const actionsFormatter = async (row,rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigate(`${subDirectory}setting/app-menu/update`,
                    {state:{editstate: row}},
                    {key:rowIndex}
                )
      
    }
    
  };

//Delete
  const statusFormatter = async (row) => {
    let deleteData = {
      MenuId: row.MenuId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteAppMenu(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        fetchData();
        setMessageType("success")
        setMessageData(row.ActiveStatus === "A" ? "In-Activated Successfully": "Activated Successfully")
        
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
      filteredValue: filteredInfo.TaxName || null,
      // onFilter: (value, record) => record.AppName.includes(value),
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
        String(record.AppName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
        String(record.MenuName)
            .toLowerCase()
            .includes(value.toLowerCase())

)},
      sorter: (a, b) => a.AppName.length - b.AppName.length,
      sortOrder: sortedInfo.columnKey === "AppName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Menu Name",
      dataIndex: "MenuName",
      key: "MenuName",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      // filteredValue: filteredInfo.MenuName || null,
      // onFilter: (value, record) => record.MenuName.includes(value),
      sorter: (a, b) => a.MenuName.length - b.MenuName.length,
      sortOrder: sortedInfo.columnKey === "MenuName" ? sortedInfo.order : null,
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
    navigate(`${subDirectory}setting/app-menu/new`)
  }

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
      <div className="formAddNew">
            <div>
                <FormHeader title={"Application Menu"} />
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

export default AppMenu;
