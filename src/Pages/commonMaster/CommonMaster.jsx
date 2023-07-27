import React, { useState, useEffect, useCallback, useRef  } from "react";
import { Form} from "antd";
import { InputField } from "../../Components/Forms/InputField"
import { DropDowns } from "../../Components/Forms/DropDown";
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'antd';
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import { Space } from "antd";
import  Buttons  from "../../Components/Forms/Buttons";
import { Tables } from "../../Components/Tables/Table";
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined,UploadOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages";
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import FormHeader from '../pageComponents/FormHeader.jsx'
import Imageupload from "../../Components/Forms/Upload.jsx";
import { Search } from "../../Components/Forms/Search";
import { getCookieData } from "../../Services/others";
import {configDataSelector,getConfiguration,deleteConfiguration,postConfiguration, putConfiguration, postBulkConfiguration} from "../../features/configmasterPage/configmasterPage.js";
import {configTypeActiveDataSelector, getActiveConfigTypeNames} from "../../features/configtypepage/configtypepage.js";
import {emptyExcelData} from "../../features/exceluploadPage/exceluploadPage.js";
import HomeComponent from './ExceUpload.jsx';
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import "../../Components/Forms/main.scss";


const subDirectory = import.meta.env.BASE_URL
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "ConfigMaster",
      link: `${subDirectory}setting/config-master`,
    },

  ];


const CommonMaster = () => {
   const CommonData=useSelector(configDataSelector)

    const [open, setOpen] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [EditState, setEditState] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [isOnchange, setIsOnchange] = useState(false);
    const [searchedText, setSearchedText] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [messageData, setMessageData] = useState(null);
    const [CommonDataFilter, setCommonDataFilter] = useState([]);
    const [showHomeComponent, setShowHomeComponent] = useState(false);
    const [dataToSubmit, setDataToSubmit] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [radioValue, setRadioValue] = useState('single');
    
  

    
    const TypeNames=useSelector(configTypeActiveDataSelector)
    
    
   


  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getConfiguration()).unwrap();
      dispatch(getActiveConfigTypeNames()).unwrap();
     
      
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    setCommonDataFilter(CommonData)

  }, [CommonData]);


  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);


  }, [])


  const handleResetExcelData = () => {
    dispatch(emptyExcelData());
        
  };


  const updateImageUrl = (url) => {
    setImageUrl(url)
  }


  const [form] = Form.useForm();



const handleSubmit = async () => {
  if (radioValue === 'single') {
    const values = await form.validateFields();
    const postData = {
      TypeId: values.TypeId,
      ConfigName: values.ConfigName,
      AlphaNumFld: values.AlphaNumFld,
      NumFld: values.NumFld,
      SmallIcon: imageUrl,
      CreatedBy: getCookieData('UserId') || 7,
    };

    let response = {};
    if (!EditState) {
      response = await dispatch(postConfiguration(postData)).unwrap();
    } else {
      if (selectedRow) {
        const putData = {
          ConfigId: selectedRow.ConfigId,
          TypeId: selectedRow.TypeId,
          UpdatedBy: getCookieData('UserId') || 7,
          ...postData,
        };
        response = await dispatch(putConfiguration(putData)).unwrap();
      }
    }

    if (response.data.statusCode == 1) {
      setImageUrl("");
      setMessageType("success");
      setMessageData(response.data.response);
      handleCancel();
      dispatch(getConfiguration()).unwrap();
    } else {
      setImageUrl("");
      setMessageType("error");
      setMessageData(response.data.response);
    }
  } else if (radioValue === 'multiple') {
    if (dataToSubmit && dataToSubmit.length > 0) {
      const hasMissingConfigName = dataToSubmit.some((data) => !data.configName || data.configName.trim() === '');
      if (hasMissingConfigName) {
        setMessageType("error");
        setMessageData("Please enter Config Name");
      }else{
      const formattedData = dataToSubmit.map((data) => ({
        TypeId: parseInt(data.TypeId),
        ConfigName: data.configName,
        AlphaNumFld: data.AlphaNumFId,
        NumFld: parseInt(data.NumFId),
        SmallIcon: data.SmallIcon,
      }));

      const postData = {
        ConfigMasterDetails: formattedData,
      };

      let response = await dispatch(postBulkConfiguration(postData)).unwrap();
      if (response.data.statusCode == 1) {
        setMessageType("success");
        setMessageData(response.data.response);
      } else {
        setMessageType("error");
        setMessageData(response.data.response);
      }

      handleResetExcelData();
      handleCancel();
      dispatch(getConfiguration()).unwrap();
      // Handle success response
    }} else {
      setMessageType("error");
      setMessageData("No data to submit. Please upload an Excel file.");
    }
  }
};

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
      setImageUrl(row.SmallIcon);
      form.setFieldsValue(row);
      setSelectedRow(row);


    }
  };


  const statusFormatter = async (row) => {
    let deleteData = {
      ConfigId: row.ConfigId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteConfiguration(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getConfiguration()).unwrap()
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
    setImageUrl("");
    setOpen(false);
    handleResetExcelData();
  };
  

  const handleSubmitbulk = (excelData) => {
    setDataToSubmit(excelData);
  };
    

  const handleDropDownChange = (value) => {
    form.setFieldsValue({TypeId:value})

  };


  const ConfigSelect = async (e) => {
    if (e === "Select") {
      // If "Select" is chosen, display all data
      setCommonDataFilter(CommonData);
    } else {
      // Filter the data based on the selected Config Type
      const filteredItems = CommonData.filter(
        (item) => item.TypeId === parseInt(e)
      );
      setCommonDataFilter(filteredItems);
    }
  };

  const handleRadioChange = (value) => {
    setRadioValue(value);

    // Reset the form values
    form.resetFields();
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
      width:"200px",
      render: (text, object, index) =><a style={{color:"black"}}>{index + 1}</a>

    },

    {
      title: "Type Name",
      dataIndex: "TypeName",
      key: "TypeName",
      width:"200px",
      align: 'center',
      render: (text) => <a style={{color:"black", width:"200px"}}>{text}</a>,
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.TypeName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.ConfigName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
      sorter: (a, b) => a.TypeName.localeCompare(b.TypeName),
      sortOrder: sortedInfo.columnKey === 'TypeName' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Config Name",
      dataIndex: "ConfigName",
      key: "ConfigName",

      width:"200px",
      align: 'center',
      render: (text) => <a style={{color:"black"}}>{text}</a>,
      sorter: (a, b) => a.ConfigName.localeCompare(b.ConfigName),
      sortOrder: sortedInfo.columnKey === 'ConfigName' ? sortedInfo.order : null,
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
      <div className="userPageTable">
        <div className="userPageContent">
        <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}
        />
        <div className="formAddNew">
              <div>
                  <FormHeader title={"Config Master"} />
              </div>
              <div className='searchAddDiv'>
                <div className="formSearch">
                    <Search
                      placeholder='Search'
                      onSearch={onSearch}
                      onSearchChange={onSearchChange}
                    />
                  </div>
                  <Form.Item
                        name="Config Type"
                        
                        rules={[
                            {
                            required: true,
                            message:"Please Select Config Type",
                            },
                        ]}
                        >
                        <DropDowns
                            options={[
                              { value: "Select", label: "All" }, // Add "Select" option
                              ...TypeNames?.map((option) => ({
                                value: option.TypeId,
                                label: option.TypeName,
                              })),
                            ]}
                            defaultValue="Select" // Set "Select" as the default value
                            placeholder="Config Type"
                            label="ConfigType"
                            onChangeFunction={(e)=>ConfigSelect(e)}
                            isOnchanges={true}
                            className='field-DropDown'
                            onFilter={(value, record) =>
                              String(record.TypeName)
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            }
                        />
                  </Form.Item>
                  <Buttons
                      buttonText="Add New"
                      color="901D77"
                      handleSubmit={openModal}
                      icon={<PlusOutlined />}>
                      OPEN
                  </Buttons>
              </div>


          </div>
          <div className="reportTable">
            <Tables columns={columns} data={CommonDataFilter}  onChange={handleChange} />
          </div>
        </div>

        <DefaultModal
            open={open}
            title="Config Master"
            footer={true}
            children={
              <>
              {!EditState && (
                <div className="radio-buttons">
                <RadioGrpButton
                  content={[
                    { value: "single", label: "Single" },
                    { value: "multiple", label: "Multiple" },
                  ]}
                  fieldState={true}
                  defaultSelect={radioValue}
                  Header={" Select ConfigType "}
                  onSelectFuntion={(value) => {
                    handleRadioChange(value);
                    // Set showHomeComponent to true when radio value is 'multiple'
                    if (value === 'multiple') {
                      setShowHomeComponent(true);
                    } else {
                      setShowHomeComponent(false);
                    }
                  }}
                />
                </div>
                )}
                 {(radioValue === 'single' || EditState) && (
                  // Render the content for the "Single" option
                  <div>
                    <Form form={form}>
                    <Row
                  >
                    <Col className="gutter-row" span={11}>
                    <Form.Item
                      name="TypeId"
                      rules={[
                        {
                          required: true,
                          message:"Please Select Config Type",
                        },
                      ]}
                    >
                    <DropDowns
                        options={[
                          { value: "Select", label: "All" }, // Add "Select" option
                          ...TypeNames?.map((option) => ({
                            value: option.TypeId,
                            label: option.TypeName,
                          })),
                        ]}
                        placeholder="ConfigType"
                        label="ConfigType"
                        optionsNames={{ value: "TypeId", label: "TypeName" }}
                        className='field-DropDown'
                        isOnchanges={true}
                        onChangeFunction={handleDropDownChange}
                        defaultValue="Select" // Set "Select" as the default value
                        valueData={EditState ? selectedRow?.TypeId : undefined}
                        disabled={!!EditState}
                    />
                  </Form.Item>

                  <Form.Item
                      name="AlphaNumFld"
                      rules={[
                        { max: 20, 
                          pattern:/^(?!\s*$).+/,
                          message: 'Please Enter Alpha Numeric ld' }
                      ]}
                    >
                      <InputField

                        field="AlphaNumFld"
                        label="Alpha NumericId"
                        className="Input"
                        fieldState={EditState? true : fieldState}
                        fieldApi={fieldApi}
                        autocomplete="off"
                        isOnChange={EditState ? true : false}

                      />
                    </Form.Item>

                    <div className="upload_btn">
                      <p>Upload Icon</p>
                      <Imageupload singleImage={true} updateImageUrl={updateImageUrl} ImageLink={
                        // EditState ? selectedRow?.SmallIcon : ""
                        imageUrl?imageUrl:""
                        }/>
                        {/* Support for a single or bulk upload. <br /> */}
                        {/* Strictly prohibited from uploading company
                        <br /> data or other banned files. */}
                    </div>

                    </Col>
                    <Col className="gutter-row" span={11}>
                    <Form.Item
                      name="ConfigName"
                      rules={[
                        {
                          required: true,
                          pattern:/^(?!\s*$).+/,
                          message:"Please Enter Config Name",
                        },
                      ]}
                    >
                      <InputField

                        field="ConfigName"
                        name="test"
                        label="Config Name"
                        className="Input"
                        fieldState={EditState? true : fieldState}
                        fieldApi={fieldApi}
                        autocomplete="off"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>

                    <Form.Item
                      name="NumFld"
                    >
                      <InputField

                        field="NumFld"
                        name="test"
                        label="Numeric Id"
                        type="number"
                        className="Input"
                        fieldState={EditState? true : fieldState}
                        fieldApi={fieldApi}
                        autocomplete="off"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>
                    </Col>

                    </Row>
                    </Form>
                  </div>
                )}
                {radioValue === 'multiple' && !EditState && (
                  // Render the content for the "Multiple" option
                  <div>
                    <HomeComponent handleSubmit={handleSubmitbulk} showHomeComponent={showHomeComponent} />
                  </div>
                )}
              </>
            }
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
          />

      </div>
    );



};

export default CommonMaster;