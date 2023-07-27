import { useState, useEffect, useCallback } from 'react'; 
import { useDispatch , useSelector} from 'react-redux'
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Form } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import { Col, Row } from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined} from "@ant-design/icons";
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import React from 'react';
import { Tables } from "../../Components/Tables/Table";
import { Space } from "antd";
import Search from '../../Components/Forms/Search.jsx';
import { currencyDataSelector,getCurrency,deleteCurrency,postCurrency,putCurrency} from '../../features/currencyPage/currencyPage.js';
import { getCookieData } from "../../Services/others";
import FormHeader from '../pageComponents/FormHeader.jsx'

const subDirectory = import.meta.env.BASE_URL

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "Currency",
      link: `${subDirectory}setting/currency`,
    },

    
  ];




const CurrencyForm = () => {

  const [open, setOpen] = useState(false);
  const [EditData, setEditData] = useState([]);
  const [editState, setEditState] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const CommonData=useSelector(currencyDataSelector)
  

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  const handleSubmit = async () => {
    const values = await form.validateFields();
    const postData = {
      CurrName: values.CurrName,
      CurrShName: values.CurrShName,
      ConvRate: values.ConvRate,
      CreatedBy: getCookieData('UserId') || 7,
    };
    let response={}
    if (!editState){
      response=await dispatch(postCurrency(postData)).unwrap()
  }
    else{
      if(selectedRow){
        const putData = {
          CurrId: selectedRow.CurrId,
          UpdatedBy: getCookieData('UserId') || 7,
          ...postData,
        };
        response=await dispatch(putCurrency(putData)).unwrap()
      }

    }
  if (response.data.statusCode == 1){
        setMessageType("success");
        setMessageData(response.data.response);
        handleCancel()
        dispatch(getCurrency()).unwrap();
}else{
  setMessageType("error")
  setMessageData(response.data.response)
}
};
  
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getCurrency()).unwrap();
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
  //   var style={backgroundColor:"red"}
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
      CurrId: row.CurrId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteCurrency(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getCurrency()).unwrap()
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
    }
  };

  const style = { width: "100px", height: "20px" };
  const openModal = () => {
    setOpen(true);
    form.resetFields();
    // Reset the editState to false
    setEditState(false);

  };

  const handleCancel = () => {
    setOpen(false);
    // setIsOpen(false);
  };

  const onSearch = (value) => {
    setSearchedText(value)
  }
  const onSearchChange =(e) => {
    setSearchedText(e.target.value)
  }


  const columns = [
    {
      title: 'SI.NO',
      key: 'sno',
      align: 'center',
      width:"100px",
      render: (text, object, index) =><a style={{color:"black"}}>{index + 1}</a>
    
    },
 
    {
      title: "Currency Name",
      dataIndex: "CurrName",
      key: "CurrName",
      width:"200px",
      align: 'center',
      render: (text) => <a style={{color:"black", width:"200px"}}>{text}</a>,
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.CurrName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.CurrShName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                        String(record.ConvRate)
                                            .toLowerCase()
                                            .includes(value.toLowerCase())
                )},
      sorter: (a, b) => a.CurrName.localeCompare(b.CurrName),
      sortOrder: sortedInfo.columnKey === 'CurrName' ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
        title: "Short Name",
        dataIndex: "CurrShName",
        key: "CurrShName",
        
        width:"200px",
        align: 'center',
        render: (text) => <a style={{color:"black"}}>{text}</a>,
        sorter: (a, b) => a.CurrShName.localeCompare(b.CurrShName),
        sortOrder: sortedInfo.columnKey === 'CurrShName' ? sortedInfo.order : null,
        ellipsis: true,
        
      },
      {
        title: "Conversion Rate",
        dataIndex: "ConvRate",
        key: "ConvRate",
        
        width:"200px",
        align: 'center',
        render: (text) => <a style={{color:"black"}}>{text}</a>,
        sorter: (a, b) => a.ConvRate-(b.ConvRate),
        sortOrder: sortedInfo.columnKey === 'ConvRate' ? sortedInfo.order : null,
        ellipsis: true,
        
      },
        
    {
      title: "Action",
      key: "Action",
      dataIndex: "Action", 
      width:"200px",
      align: 'center',
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

    return (
      <div className='userPageTable'>        
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}
        />
      <div className="formAddNew">
            <div>
                <FormHeader title={"Currency"} />
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
        title="Currency"
        footer={true}
        children={
          <Form form={form}>
            <Row
          >
            <Col className="gutter-row" span={11}>
            <Form.Item
              name="CurrName"
              rules={[
                {
                  required: true,
                  pattern: /^(?!\s*$).+/,
                  message:"Please Enter Currency Name"
                },
                {
                  validator: (_, value) => {
                    if (value && value.length > 50) {
                      return Promise.reject("Currency Name should not exceed 50 characters");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputField

                field="CurrName"
                label="Currency Name"
                className="Input"
                fieldState={editState ? true: fieldState}
                fieldApi={fieldApi}
                autocomplete="off"
                isOnChange={editState ? true : false}
              />
            </Form.Item>

            <Form.Item
              name="ConvRate"
            >
              <InputField

                field="ConvRate"
                name="test"
                label="Conversion rates"
                className="Input"
                type="number"
                fieldState={editState ? true: fieldState}
                fieldApi={fieldApi}
                autocomplete="off"
                isOnChange={editState ? true : false}
              />
            </Form.Item>
            </Col>

            <Col className="gutter-row" span={11}>
            <Form.Item
              name="CurrShName"
              rules={[
                {
                  required: true,
                  pattern: /^(?!\s*$).+/,
                  message:"Please Enter Short Name"
                },
                {
                  validator: (_, value) => {
                    if (value && value.length > 3) {
                      return Promise.reject("Short Name should not exceed 3 characters");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputField

                field="CurrShName"
                name="test"
                label="Short Name"
                className="Input"
                fieldState={editState ? true : fieldState}
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
  );
};

export default CurrencyForm;