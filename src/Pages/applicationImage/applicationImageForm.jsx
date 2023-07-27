import { useState, useEffect, useRef,useCallback } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Form ,Space} from "antd";
import { ArrowRightOutlined,PlusOutlined,EditFilled, DeleteFilled,ReloadOutlined } from "@ant-design/icons";
import { InputField } from "../../Components/Forms/InputField.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import Imageupload from "../../Components/Forms/Upload.jsx";
import { Drawers } from "../../Components/Drawer/Drawer.jsx";
import { Tables } from "../../Components/Tables/Table";
import { DropDowns } from '../../Components/Forms/DropDown.jsx';
import { Search } from "../../Components/Forms/Search";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import {applicationImageDataSelector, getApplicationImageData,postApplicationImageData,
   putApplicationImageData,deleteApplicationImageData} 
   from "../../features/applicationImagePage/applicationImagePage.js"
import {applicationActiveDataSelector, getActiveApplicationData} from "../../features/applicationPage/applicationPage.js"
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL

const ApplicationImageForm = () => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const applicationData=useSelector(applicationActiveDataSelector)
  const applicationImageData=useSelector(applicationImageDataSelector)

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sortedInfo, setSortedInfo] = useState({});
  const [SelectedApplication, setSelectedApplication] = useState(null);
  const [searchedText, setSearchedText] = useState("");
  const [imageUrl, setImageUrl] = useState([]);

  const [editstate, setEditstate] = useState([]);
  const [formType, setFormType] = useState('add');
  const [imageType, setImageType] =  useState("I")
  
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "ApplicationImage",
      link: `${subDirectory}setting/application-image`,
    },
    
  ];
  
  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getApplicationImageData()).unwrap()
      dispatch(getActiveApplicationData()).unwrap()
      
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    try {
      if(applicationData.length===1){
        selectApplication(applicationData[0]?.["AppId"])
      }

    } catch (err) {
      console.log(err, "err");
    }
  }, [SelectedApplication,applicationData]);


  const handleSubmit = () => {
    setMessageType("success");
    setMessageData("Data Added Successfully");
  };

  const showDrawer = () => {
    formRef.current?.resetFields();
    setFormType('add')
    setSelectedApplication(null)
    setImageUrl("")
    setDrawerOpen(true);
  };
  const onClose = () => {
    formRef.current?.resetFields();
    setImageUrl("")
    setDrawerOpen(false);
    // setImageType(null)
    setEditstate([])
    
    
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
  const selectApplication = async(e)=>{
    formRef.current?.setFieldsValue({AppId:e})
    await setSelectedApplication(e)
    
  }
  const selectImageType = async (e) => {
    formRef.current?.setFieldsValue({ImageType:e})
    await setImageType(e);
  };
  const updateImageUrl = (url) => {
    setImageUrl(url)
  }

  
  const onFinish = async (values) => {
    let postData={}
    postData["ImageLink"] = imageUrl
    postData["ImageType"] =imageType
    postData["ImageName"] =values.ImageName
    postData["AppId"] =values.AppId

    
    
    let response={}
    if (formType === "edit") {
        postData["ImageId"]=editstate.ImageId
        postData["updatedBy"] = getCookieData('UserId') || 7
        try{
          response=await dispatch(putApplicationImageData(postData)).unwrap()
        }catch(err){
          if(err["message"]=="Request failed with status code 422"){
            response={data:{"statusCode": 0,
            "response": "Please Give Required Fields",
            'data': []}}
          }
        }
    }else{
        postData["CreatedBy"] = getCookieData('UserId') || 7
        try{
          response=await dispatch(postApplicationImageData(postData)).unwrap()
        }catch(err){
          
          if(err["message"]=="Request failed with status code 422"){
            response={data:{"statusCode": 0,
            "response": "Please Give Required Fields",
            'data': []}}
          }
        }
    }
    if (response.data.statusCode == 1){
        onClose()
        dispatch(getApplicationImageData()).unwrap()
        setMessageType("success")
        setMessageData(response.data.response)
        
      
  }else{
    setMessageType("error")
    setMessageData(response.data.response)
  }
  }

  const actionsFormatter = async (row,rowIndex) => {
    formRef.current?.resetFields();
    if (row.ActiveStatus !== "D") {
      // setImageType(row.ImageType);
      formRef.current?.setFieldsValue({ImageType:row.ImageType})
      setImageType(row.ImageType);
    //  await selectImageType(row.ImageType)
      setEditstate(row)
      setFormType('edit')
      formRef.current?.setFieldsValue({AppId:row.AppId,ImageName:row.ImageName})
      setSelectedApplication(row.AppId)
      setImageUrl(row?.ImageLink)
      
     
      setDrawerOpen(true);

      
    }
    
  };
  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, [])
  
  

  const statusFormatter = async (row) => {
    let deleteData = {
      ImageId: row.ImageId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteApplicationImageData(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getApplicationImageData()).unwrap()
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
    }
  };
  const columns = [
    {
      title: "SI.No",
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
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.AppName)
                                          .toLowerCase()
                                          .includes(value.toLowerCase()) ||
                                    String(record.ImageName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.ImageTypeName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.ImageLink)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
      sorter: (a, b) => a.AppName.localeCompare(b.AppName),
      sortOrder:
        sortedInfo.columnKey === "AppName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Image Name",
      dataIndex: "ImageName",
      key: "ImageName",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      sorter: (a, b) => a.ImageName.localeCompare(b.ImageName),
      sortOrder: sortedInfo.columnKey === "ImageName" ? sortedInfo.order : null,
      ellipsis: true,
      
    },
    {
      title: "Image Type",
      dataIndex: "ImageTypeName",
      key: "ImageTypeName",

      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.ImageTypeName.localeCompare(b.ImageTypeName),
      sortOrder:
        sortedInfo.columnKey === "ImageTypeName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Image",
      dataIndex: "ImageLink",
      key: "ImageLink",

      maxWidth: "20px",
      align: "center",
      render: (t, r) => <img style={{maxWidth: "46px"}} src={`${r.ImageLink!="" && r.ImageLink!=null?r.ImageLink:"http://saveme.live/paypre-image-api/upload?fileId=64b536df06bfb6b6b9922bbc.webp"}`} alt={r.ImageLink} />
    },
    

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record,index) =>
      applicationImageData.length >= 1 ? (
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
                <FormHeader title={"Application Image"} />
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
                    handleSubmit={showDrawer}>
                    OPEN
                </Buttons>
            </div>
        </div>

        <div className="reportTable">
          <Tables columns={columns} data={applicationImageData} dataSource ={applicationImageData} onChange={handleChange} />{" "}
        </div>
        <Drawers
          open={drawerOpen}
          placement={placement}
          title="Application Image"
          children={
            <div className="formDiv">
             
              <Form ref={formRef} className="formDivAnt"  onFinish={onFinish} initialValues={editstate}>
                <div className="formDivS">
                <div className="inputForm">
                    <Form.Item
                        name="AppId"
                        
                        rules={[
                            {
                            required: true,
                            message:"Please Select Application ",
                            },
                        ]}
                        >
                        <DropDowns
                            options={applicationData?.map((option) => ({
                              value: option.AppId,
                              label: option.AppName,
                            }))}
                            label="Application"
                            onChangeFunction={selectApplication}
                            // optionsNames={{ value: "AppId", label: "AppName" }}
                            className='field-DropDown'
                            isOnchanges={SelectedApplication?true:false}
                            valueData={SelectedApplication}
                            
                        />
                    </Form.Item>
                    
                    <Form.Item
                        name="ImageName"
                        
                        rules={[
                          {
                            required: true,
                            pattern:/^(?!\s*$).+/,
                            message:"Please Enter Image Name ",
                          },
                          {
                            validator: (_, value) => {
                              if (value && value.length > 50) {
                                return Promise.reject("Image Name should not exceed 50 characters");
                              }
                              return Promise.resolve();
                            },
                          },

                        ]}
                      >
                        <InputField
                          field="ImageName"
                          autoComplete="off"
                          label="Image Name"
                          fieldState={true}
                          fieldApi={true}
                          isOnChange={formType == "edit" ? true :false}
                          
                          
                        />
                      </Form.Item>

                      <Form.Item
                        name="ImageType"
                        // hasFeedback
                        // rules={[
                        //     {
                        //     required: true,
                        //     },
                        // ]}
                        >
                    
                          <RadioGrpButton
                                content={[
                                  { value: "I", label: "Image" },
                                  { value: "C", label: "Icon" },
                                ]}
                                fieldState={true}
                                defaultSelect={imageType}
                                Header={"Select Image Type"}
                                onSelectFuntion={(e) => selectImageType(e)}
                                // valueData={imageType}
                              />
                      </Form.Item>
                      <div className="upload_btn">
                      <p>Upload {imageType==='I'?"App Image":"App Icon"}</p>
                          
                          <Imageupload singleImage={true} updateImageUrl={updateImageUrl} ImageLink={imageUrl?imageUrl:""}/>
                        </div>
                  </div>
                </div>

                <div className="submitButton">
                  <Buttons
                    buttonText="Submit"
                    icon={<ArrowRightOutlined />}
                    htmlType={true}
                    // handleSubmit={handleSubmit}
                  />
                </div>
              </Form>
            </div>
          }
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default ApplicationImageForm;
