import React,{ useState, useEffect,useCallback} from 'react'; 
import { useDispatch,useSelector } from 'react-redux'
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Form } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import { Col, Row } from 'antd';
import { EditFilled, DeleteFilled,ReloadOutlined} from "@ant-design/icons";
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import { Tables } from "../../Components/Tables/Table";
import { Space } from "antd";
import Search from '../../Components/Forms/Search.jsx';
import FormHeader from '../pageComponents/FormHeader.jsx';
import { PlusOutlined  } from '@ant-design/icons';
import { configTypeDataSelector,getConfigurationType,deleteConfigTypeData,postConfigurationType,putConfigurationType} from '../../features/configtypepage/configtypepage.js';
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.BASE_URL
const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "ConfigType",
      link: `${subDirectory}setting/config-type`,
    },

  ];




const ConfigTypeForm = () => {

  const [open, setOpen] = useState(false);
  const [EditData, setEditData] = useState([]);
  const [editState, setEditState] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const CommonData=useSelector(configTypeDataSelector)
  

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

 

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const postData = {
      TypeName: values.TypeName,
      CreatedBy: getCookieData('UserId') || 7,
    };
    let response={}
    if (!editState){
      response=await dispatch(postConfigurationType(postData)).unwrap()
  }
    else{
      if(selectedRow){
        const putData = {
          TypeId: selectedRow.TypeId,
          TypeName: selectedRow.TypeName,
          UpdatedBy: getCookieData('UserId') || 7,
          ...postData,
        };
        response=await dispatch(putConfigurationType(putData)).unwrap()
      }

    }
  if (response.data.statusCode == 1){
        setMessageType("success");
        setMessageData(response.data.response);
        handleCancel()
        dispatch(getConfigurationType()).unwrap();
}else{
  setMessageType("error")
  setMessageData(response.data.response)
}
};

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getConfigurationType()).unwrap();
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])


  const [form] = Form.useForm();
  

  var fieldState = ""
  var fieldApi = [
    {
      setValue: "s",
      setTouched: true,
    },
  ];

  
  
  //edit
  const actionsFormatter = async (row) => {    
    if (row.ActiveStatus !== "D") {
      await setOpen(true);
      await setEditData(row);
      await setEditState(true);
      form.setFieldsValue(row);
      setSelectedRow(row);
      
    }
  };

  const statusFormatter = async (row) => {
    let deleteData = {
      TypeId: row.TypeId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteConfigTypeData(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getConfigurationType()).unwrap()
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
    }
  };

 
  const openModal = () => {
    setOpen(true);
    form.resetFields();
    // Reset the editState to false
    setEditState(false);
  };
  const handleCancel = () => {
    setOpen(false);
   
  };

  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }


  const columns = [
    {   
      title:'SI.NO',
      align: "center",
      key: 'sno',
      render: (text, object, index) => <a className="tableText">{index + 1}</a>,

  },
  {   
    title:'Type Name',
    dataIndex: 'TypeName',
    key: 'TypeName',
    align: "center",
    render: (text) => <a className="tableText">{text}</a>,
    filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.TypeName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) 
                                        
                )},
      sorter: (a, b) => a.TypeName.localeCompare(b.TypeName),
      sortOrder: sortedInfo.columnKey === 'TypeName' ? sortedInfo.order : null,
      ellipsis: true,

},

{
  title: 'Action',
  dataIndex: 'Action',
  align: "center",
  key: 'Action',
  render: (_, record,index) => 
  CommonData.length >= 1 ? (
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
      return(
        <div className="userPageTable">
          <div className="userPageContent">
          <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}
        />
          <div className="formAddNew">
                <div>
                    <FormHeader title={"Config Type"} />
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
                        handleSubmit={openModal}
                        icon={<PlusOutlined />}
                        >
                        OPEN
                    </Buttons>
                </div>
            </div>
            <div className="reportTable">
              <Tables columns={columns} data={CommonData} dataSource={CommonData}  onChange={handleChange} />{" "}
            </div>
          </div>

      <DefaultModal
        open={open}
        title="Config Type"
        footer={true}
        children={
          
          <Form form={form}>
            <Row
          >
            <Col className="gutter-row" span={6}>
            <Form.Item
              name="TypeName"
              rules={[
                {
                  required: true,
                  pattern:/^(?!\s*$).+/,
                  message:"Please Enter Type Name "
                },
              ]}
            >
           
              <InputField
                field="TypeName"
                label="Type Name"
                className="Input"
                fieldState={editState ? true: fieldState}
                fieldApi={fieldApi}
                autocomplete="off" 
                isOnChange={editState ? true : false}
              />
            
            </Form.Item>
            </Col>               
            </Row>
           
          </Form>
        }
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
      </div>
      
  )
    
};

export default ConfigTypeForm;