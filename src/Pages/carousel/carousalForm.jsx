
import { useState, useEffect, useCallback } from 'react'; 
import { useDispatch , useSelector} from 'react-redux'
import { InputField } from "../../Components/Forms/InputField.jsx";
import { Form } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import { DropDowns } from '../../Components/Forms/DropDown.jsx';
import { Col, Row } from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined} from "@ant-design/icons";
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import React from 'react';
import { Tables } from "../../Components/Tables/Table";
import { Space } from "antd";
import Search from '../../Components/Forms/Search.jsx';
import {carouselDataSelector,getCarouselData, deleteCarouselData, postCarouselData, putCarouselData, ConfigNamesSelector, getConfigNames} from "../../features/carouselPage/carouselPage.js";
import { getCookieData } from "../../Services/others";
import FormHeader from '../pageComponents/FormHeader.jsx'

  const subDirectory = import.meta.env.BASE_URL
  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "Carousel",
      link: `${subDirectory}setting/carousel`,
    },

  ];




const CarouselForm = () => {

  const [open, setOpen] = useState(false);
  const [EditData, setEditData] = useState([]);
  const [editState, setEditState] = useState(false);
  const formRef = React.useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [isOnchange, setIsOnchange] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedConfigName, setSelectedConfigName] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const CommonData=useSelector(carouselDataSelector)
  const ConfigNames=useSelector(ConfigNamesSelector) 
  
  const [form] = Form.useForm();


  var fieldState = ""

  var fieldApi = [
    {
      setValue: "s",
      setTouched: true,
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  
  const handleSubmit = async () => {
    
    const values = await form.validateFields();
    console.log("ScreenId",values)
    const postData = {
      ScreenId: values.ScreenId,
      Carousel: values.Carousel,
      CreatedBy: getCookieData('UserId') || 7,
    };
    let response={}
    if (!editState){
      response=await dispatch(postCarouselData(postData)).unwrap()
  }
    else{
      if(selectedRow){
        const putData = {
          CarouselId: selectedRow.CarouselId,
          UpdatedBy: getCookieData('UserId') || 7,
          ...postData,
        };
        response=await dispatch(putCarouselData(putData)).unwrap()
      }

    }
  if (response.data.statusCode == 1){
        setMessageType("success");
        setMessageData(response.data.response);
        handleCancel()
        dispatch(getCarouselData()).unwrap();
    }else{
      setMessageType("error")
      setMessageData(response.data.response)
    }
}
    
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getCarouselData()).unwrap();
      dispatch(getConfigNames()).unwrap();

    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  // useEffect(() => {
  //   try {
  //     if(ConfigNames.length===1){
  //       console.log("ConfigNamesConfigNames",ConfigNames[0]?.["ConfigId"])
  //       setSelectedConfigName(ConfigNames[0]?.["ConfigId"])
  //       form.setFieldsValue({ScreenId:ConfigNames[0]?.["ConfigId"]})
  //     }

  //   } catch (err) {
  //     console.log(err, "err");
  //   }
  // }, [selectedConfigName,ConfigNames]);

  const handleDropDownChange = async (value) => {
    form.setFieldsValue({ScreenId:value})
    setSelectedConfigName(value)
  };

  // useEffect(() => {
  //   if (ConfigNames.length===1){
  //     dispatch(getConfigNames()).unwrap()
  //     // setSelectedRow(ConfigNames[0]?.["ConfigId"])
  //     // dispatch(changeApp({ AppId:appData[0]?.["AppId"] }))
  //     // dispatch(changeStore({ storeId: null }));
  //     // dispatch(changeBranch({ BranchId: null }));
  //   }
  // },[ConfigNames])
  

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])


  


 
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
      CarouselId: row.CarouselId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData('UserId') || 7
    };
    let response=await dispatch(deleteCarouselData(deleteData)).unwrap()
    if (response.data.statusCode == 1){
        dispatch(getCarouselData()).unwrap()
        setMessageType("success")
        setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
    }
  };

  const openModal = () => {
    setOpen(true);
    
    form.resetFields();
    if(ConfigNames.length===1){
      console.log("ConfigNamesConfigNames",ConfigNames[0]?.["ConfigId"])
      setSelectedConfigName(ConfigNames[0]?.["ConfigId"])
      form.setFieldsValue({ScreenId:ConfigNames[0]?.["ConfigId"]})
    }
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
      title: "Screen Name",
      dataIndex: "ScreenName",
      key: "ScreenName",
      width:"200px",
      align: 'center',
      render: (text) => <a style={{color:"black", width:"200px"}}>{text}</a>,
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.ScreenName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase()) ||
                                    String(record.Carousel)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
      sorter: (a, b) => a.ScreenName.localeCompare(b.ScreenName),
      sortOrder: sortedInfo.columnKey === 'ScreenName' ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
        title: "Carousel",
        dataIndex: "Carousel",
        key: "Carousel",
        
        width:"200px",
        align: 'center',
        render: (text) => <a style={{color:"black"}}>{text}</a>,
        sorter: (a, b) => a.Carousel.localeCompare(b.Carousel),
        sortOrder: sortedInfo.columnKey === 'Carousel' ? sortedInfo.order : null,
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
    <>
      <div className='userPage'>        
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}
        />
      <div className="formAddNew">
            <div>
                <FormHeader title={"Carousel"} />
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
        title="Carousel"
        footer={true}
        name='Add'
        children={
          <Form form={form}>
            <Row
          >{console.log('form',form.getFieldValue("ScreenId"))}
            <Col className="gutter-row" span={11}>
            <Form.Item
              name="ScreenId"
              // hasFeedback
              rules={[
                {
                  required: true,
                  message:"Please Select Screen Name"
                },
              ]}
            >
              {console.log("ConfigNames",ConfigNames)}
            <DropDowns
                options={ConfigNames?.map((option) => ({
                    value: option.ConfigId,
                    label: option.ConfigName,
                    }))}
                placeholder="ScreenId"
                label="Screen Name"
                className='field-DropDown'
                // isOnchanges={selectedConfigName ? true : false}
                onChangeFunction={handleDropDownChange}
                valueData={selectedConfigName}
                isOnchanges={(editState || selectedConfigName)? true:false}
                // valueData={editState ? selectedRow?.ScreenId : undefined}
                // valueData={ConfigNames.length === 1 ? ConfigNames[0].ConfigId : selectedRow?.ScreenId}
                disabled={!!editState}
                
            />
           </Form.Item>
            </Col>
            <Col className="gutter-row" span={11}>
            <Form.Item
              name="Carousel"
              
              rules={[
                {
                  required: true,
                  pattern: /^(?!\s*$).+/,
                  message:"Please Enter Carousel"
                },
                {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject("Carousel should not exceed 150 characters");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputField

                field="Carousel"
                name="test"
                label="Carousel"
                className="Input"
                fieldState={editState ? true: fieldState}
                fieldApi={fieldApi}
                autoComplete="off"
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
    </>
  );
};

export default CarouselForm;


// import { useState, useEffect, useCallback } from 'react'; 
// import { useDispatch , useSelector} from 'react-redux'
// import { InputField } from "../../Components/Forms/InputField.jsx";
// import { Form } from "antd";
// import Buttons from "../../Components/Forms/Buttons.jsx";
// import { Messages } from "../../Components/Notifications/Messages";
// import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
// import { DropDowns } from '../../Components/Forms/DropDown.jsx';
// import { Col, Row } from 'antd';
// import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined} from "@ant-design/icons";
// import { DefaultModal } from "../../Components/Modal/DefaultModal";
// import React from 'react';
// import { Tables } from "../../Components/Tables/Table";
// import { Space } from "antd";
// import Search from '../../Components/Forms/Search.jsx';
// import {carouselDataSelector,getCarouselData, deleteCarouselData, postCarouselData, putCarouselData, ConfigNamesSelector, getConfigNames} from "../../features/carouselPage/carouselPage.js";
// import { getCookieData } from "../../Services/others";
// import FormHeader from '../pageComponents/FormHeader.jsx'

//   const subDirectory = import.meta.env.BASE_URL
//   const items = [
//     {
//       name: "Home",
//       link: `${subDirectory}landing-page/home`,
//     },
  
//     {
//       name: "Carousel",
//       link: `${subDirectory}setting/carousel`,
//     },

//   ];




// const CarouselForm = () => {

//   const [open, setOpen] = useState(false);
//   const [EditData, setEditData] = useState([]);
//   const [editState, setEditState] = useState(false);
//   const formRef = React.useRef(null);
//   const [filteredInfo, setFilteredInfo] = useState({});
//   const [sortedInfo, setSortedInfo] = useState({});
//   const [searchedText, setSearchedText] = useState("");
//   const [isOnchange, setIsOnchange] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [messageType, setMessageType] = useState(null);
//   const [messageData, setMessageData] = useState(null);
//   const CommonData=useSelector(carouselDataSelector)
//   const ConfigNames=useSelector(ConfigNamesSelector) 
  

//   const handleChange = (pagination, filters, sorter) => {
//     console.log('Various parameters', pagination, filters, sorter);
//     setFilteredInfo(filters);
//     setSortedInfo(sorter);
//   };


  
//   const handleSubmit = async () => {
//     const values = await form.validateFields();
//     const postData = {
//       ScreenId: values.ScreenId,
//       Carousel: values.Carousel,
//       CreatedBy: getCookieData('UserId') || 7,
//     };
//     let response={}
//     if (!editState){
//       response=await dispatch(postCarouselData(postData)).unwrap()
//   }
//     else{
//       if(selectedRow){
//         const putData = {
//           CarouselId: selectedRow.CarouselId,
//           UpdatedBy: getCookieData('UserId') || 7,
//           ...postData,
//         };
//         response=await dispatch(putCarouselData(putData)).unwrap()
//       }

//     }
//   if (response.data.statusCode == 1){
//         setMessageType("success");
//         setMessageData(response.data.response);
//         handleCancel()
//         dispatch(getCarouselData()).unwrap();
// }else{
//   setMessageType("error")
//   setMessageData(response.data.response)
// }
// };
    
//   const dispatch = useDispatch();

//   useEffect(() => {
//     try {
//       dispatch(changeBreadCrumb({ items: items }));
//       dispatch(getCarouselData()).unwrap();
//       dispatch(getConfigNames()).unwrap();

//     } catch (err) {
//       console.log(err, "err");
//     }
//   }, []);

//   const handleDropDownChange = async (value) => {
//     form.setFieldsValue({ScreenId:value})
//   };
  

//   const onComplete = useCallback(() => {
//     setMessageData(null);
//     setMessageType(null);
    
    
//   }, [])


//   const [form] = Form.useForm();


//   var fieldState = ""

//   var fieldApi = [
//     {
//       setValue: "s",
//       setTouched: true,
//     },
//   ];


 
//   const actionsFormatter = async (row) => {    
//     if (row.ActiveStatus !== "D") {
//       await setOpen(true);
//       await setEditData(row);
//       await setEditState(true);
//       form.setFieldsValue(row);
//       setSelectedRow(row);
      
      
//     }
//   };

//   const statusFormatter = async (row) => {
//     let deleteData = {
//       CarouselId: row.CarouselId,
//       ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
//       UpdatedBy: getCookieData('UserId') || 7
//     };
//     let response=await dispatch(deleteCarouselData(deleteData)).unwrap()
//     if (response.data.statusCode == 1){
//         dispatch(getCarouselData()).unwrap()
//         setMessageType("success")
//         setMessageData(row.ActiveStatus == "A" ? "In-Activated Successfully": "Activated Successfully")
//     }
//   };

//   const openModal = () => {
//     setOpen(true);
//     form.resetFields();
//     // Reset the editState to false
//     setEditState(false);
//   };
//   const handleCancel = () => {
//     setOpen(false);
//     // setIsOpen(false);
//   };

  

//   const onSearch = (value) => {
//     setSearchedText(value)
//   }
//   const onSearchChange =(e) => {
//     setSearchedText(e.target.value)
//   }


//   const columns = [
//     {
//       title: 'SI.NO',
//       key: 'sno',
//       align: 'center',
//       width:"100px",
//       render: (text, object, index) =><a style={{color:"black"}}>{index + 1}</a>
    
//     },
 
//     {
//       title: "Screen Name",
//       dataIndex: "ScreenName",
//       key: "ScreenName",
//       width:"200px",
//       align: 'center',
//       render: (text) => <a style={{color:"black", width:"200px"}}>{text}</a>,
//       filteredValue: [searchedText],
//       onFilter: (value, record) => {return (
//                                     String(record.ScreenName)
//                                         .toLowerCase()
//                                         .includes(value.toLowerCase()) ||
//                                     String(record.Carousel)
//                                         .toLowerCase()
//                                         .includes(value.toLowerCase())
//                 )},
//       sorter: (a, b) => a.ScreenName.localeCompare(b.ScreenName),
//       sortOrder: sortedInfo.columnKey === 'ScreenName' ? sortedInfo.order : null,
//       ellipsis: true,
//     },

//     {
//         title: "Carousel",
//         dataIndex: "Carousel",
//         key: "Carousel",
        
//         width:"200px",
//         align: 'center',
//         render: (text) => <a style={{color:"black"}}>{text}</a>,
//         sorter: (a, b) => a.Carousel.localeCompare(b.Carousel),
//         sortOrder: sortedInfo.columnKey === 'Carousel' ? sortedInfo.order : null,
//         ellipsis: true,
        
//       },
        
//     {
//       title: "Action",
//       key: "Action",
//       dataIndex: "Action", 
//       width:"200px",
//       align: 'center',
//       render: (_, record,index) =>
//       CommonData.length >= 1 ? (
//         <Space size="middle">
//         {record.ActiveStatus === "A" ? <a>
//           <EditFilled
//             onClick={() => actionsFormatter(record,index)}
//           />
//         </a> : "" } 
//         <a>
//           {record.ActiveStatus === "A" ? <DeleteFilled
//             style={{
//               color:"#EF5350",
//             }}
//             onClick={() => statusFormatter(record)}
//           /> : <ReloadOutlined
//                   style={{
//                     color:"Green",
//                   }}
//                   onClick={() => statusFormatter(record)}
//                 />
//             }
          
//         </a>
//       </Space>
//     ) : null,
//     },

    
//   ];
    
//     return (
//     <>
//       <div className='userPage'>        
//       <div className="userPageContent">
//       <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}
//         />
//       <div className="formAddNew">
//             <div>
//                 <FormHeader title={"Carousel"} />
//             </div>
//             <div className='searchAddDiv'>
//               <div className="formSearch">
//                   <Search
//                     placeholder='Search'
//                     onSearch={onSearch}
//                     onSearchChange={onSearchChange}
//                   />
//                 </div>
//                 <Buttons
//                     buttonText="Add New"
//                     color="901D77"
//                     handleSubmit={openModal}
//                     icon={<PlusOutlined />}
//                     >
//                     OPEN
//                 </Buttons>
//             </div>
//         </div>
//         <div className="reportTable">
//           <Tables columns={columns} data={CommonData} dataSource={CommonData}  onChange={handleChange} />{" "}
//         </div>
//       </div>
    
//     <DefaultModal
//         open={open}
//         title="Carousel"
//         footer={true}
//         name='Add'
//         children={
//           <Form form={form}>
//             <Row
//           >
//             <Col className="gutter-row" span={11}>
//             <Form.Item
//               name="ScreenId"
//               rules={[
//                 {
//                   required: true,
//                   message:"Please Select Screen Name"
//                 },
//               ]}
//             >
//             <DropDowns
//                 options={ConfigNames?.map((option) => ({
//                     value: option.ConfigId,
//                     label: option.ConfigName,
//                     }))}
//                 placeholder="ScreenId"
//                 label="Screen Name"
//                 className='field-DropDown'
//                 isOnchanges={(editState || selectedRow?.ScreenId)? true:false}
//                 onChangeFunction={handleDropDownChange}
//                 valueData={editState ? selectedRow?.ScreenId : undefined}
//                 disabled={!!editState}
                
//             />
//            </Form.Item>
//             </Col>
//             <Col className="gutter-row" span={11}>
//             <Form.Item
//               name="Carousel"
//               rules={[
//                 {
//                   required: true,
//                   message:"Please Enter Carousel"
//                 },
//               ]}
//             >
//               <InputField

//                 field="Carousel"
//                 name="test"
//                 label="Carousel"
//                 className="Input"
//                 fieldState={editState ? true: fieldState}
//                 fieldApi={fieldApi}
//                 autocomplete="off"
//                 isOnChange={editState ? true : false}
//               />
//             </Form.Item>
//             </Col>
                           
//             </Row>
           
//           </Form>
//         }
//         handleCancel={handleCancel}
//         handleSubmit={handleSubmit}
//       />
                      
//       </div>
//     </>
//   );
// };

// export default CarouselForm;