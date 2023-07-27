import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages";
import { Form } from "antd";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import { Checkbox, Col, Row } from "antd";
import {
  getApplication,
  getPricingType,
  getFeatureList,
  postFeatureMapping,
  putFeatureMapping
} from "../../features/featureMapping/featureMapping.js";
import { getCookieData } from "../../Services/others";
import { useNavigate, useLocation } from "react-router-dom";
import { write } from "xlsx";
// import { genComponentStyleHook } from "antd/es/theme/internal.js";
const subDirectory = import.meta.env.BASE_URL;


const AppPriceFeatureMappingForm = ({ formType }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;
  const editstate = state?.editstate;
  // console.log(editstate.PricingId,"editstateeditstate")



  const [featureDetails, setfeatureDetails] = useState(editstate ? editstate?.FeatDetails: []);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [appDropDown, setappDropDown] = useState([]);
  const [priceDropDown, setpriceDropDown] = useState([]);
  const [FeatureList, setFeatureList] = useState([]);
  const [selectedValues, setselectedValues] = useState([]);
  const [selectedAppData, setSelectedAppData] = useState(
    editstate ? editstate.AppId : null
  );
  const [selectedPriceDropDown, setselectedPriceDropDown] = useState(
    editstate ? editstate.PricingId : null
  );
  const [checkedList, setCheckedList] = useState(editstate ? editstate.FeatDetails?.map(a=>a.FeatId) : []);
 
  

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "FeatureMapping",
      link: `${subDirectory}setting/feature-mapping`,
    },
    {
      name: editstate ? "Edit" : "New",
      link:  editstate
    ? `${subDirectory}setting/feature-mapping/update`
    : `${subDirectory}setting/feature-mapping/new`,
    },
  ];


  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    setselectedValues(checkedValues)
    const arr =checkedValues
    setCheckedList(arr)

    const obj=arr.map(d=>({"FeatId":d}))
    setfeatureDetails(obj)
  };

  


  const onFinish = async (values) => {
    console.log(selectedAppData,"value of data")
    let postData = values;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    

    let response = {};
    if (formType === "add") {
      postData["AppId"] = values.AppName;
      postData["PricingId"] = values.PriceName;
      postData["FeatDetails"]=featureDetails
      console.log(postData,"postData")
      response = await dispatch(postFeatureMapping(postData)).unwrap();
    } 
    else if (formType === "edit") {
      if (editstate) {
        postData["AppId"] = selectedAppData;
        postData["PricingId"] = values.PriceName;
        postData["FeatDetails"]=featureDetails
      }
      postData["UpdatedBy"] = getCookieData("UserId") || 7;

      response = await dispatch(postFeatureMapping(postData)).unwrap();
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/feature-mapping/`, {
        state: {
          Notiffy: {
            messageType: "success",
            messageData: response.data.response,
          },
        },
      });
    } else {
      setMessageType("error");
      setMessageData(response.data.response);
    }
  };

  async function fetchData() {
    
    const gettingappDropDown = await dispatch(getApplication()).unwrap();
    if (gettingappDropDown.data.statusCode === 1) {
      let finalAppDropDowndata = gettingappDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setappDropDown(finalAppDropDowndata);
    }
  }

  useEffect(() => {
    try {
      fetchData();
      if (formType === "edit") {
        if (editstate) {
          appDropDownChange(editstate.AppId);
          priceDropDownChange(editstate.PricingId)
          console.log(editstate,"editstateeditstate")
          setselectedValues(editstate ? editstate.FeatDetails?.map(a=>a.FeatId) : [])
          formRef.current?.setFieldsValue(
            editstate
          );
        } else {
          navigate(`${subDirectory}setting/feature-mapping/`);
        }
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);



  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);



  const appDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({AppName:e});
    setSelectedAppData(e)
    
    const gettingpriceDropDown = await dispatch(getPricingType(e)).unwrap();
    if (gettingpriceDropDown.data.statusCode === 1) {
      let finalpriceDropDowndata = gettingpriceDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setpriceDropDown(finalpriceDropDowndata);
    }
  };

  const priceDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({PriceName:e});
    setselectedPriceDropDown(e)
    
    const gettingFeatureList =await dispatch(getFeatureList()).unwrap();
    if (gettingFeatureList.data.statusCode === 1) {
      let finalFeatureList = gettingFeatureList.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setFeatureList(finalFeatureList);
    }
  };

  console.log(
    FeatureList?.map((option) => option.FeatName),
    "FeatureList"
  );

 

  // console.log(featureDetails,"checkedValues")
  // console.log(featureDetails,"mohantest1")

  return (
    <div className="pageOverAll">
    <div className="userPage">
      <div className="userPageContent">
        <Messages messageType={messageType} messageData={messageData} />
        <div className="formName">
          <FormHeader title={"Add Feature"} />
        </div>

        <div className="formDiv">
          <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={{ ...editstate }}>
            <div className="formDivS">
            <div className="inputForm" >
              <Form.Item
                name="AppName"
                
                // rules={[
                //   {
                //     required: true,
                //     // message: "Please Select Company Name!",
                //   },
                // ]}
              >
                <DropDowns
                  options={appDropDown?.map((option) => ({
                    value: option.AppId,
                    label: option.AppName,
                  }))}
                  label="App Name"
                  id="AppName"
                  onChangeFunction={(e) => appDropDownChange(e)}
                  valueData={selectedAppData}
                  isOnchanges={formType == "edit" ? true : false}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "AppId", label: "AppName" }}
                  className="field-DropDown"
                />
              </Form.Item>

              <Form.Item
                name="PriceName"
                
                // rules={[
                //   {
                //     required: true,
                   
                //   },
                // ]}
              >
                <DropDowns
                  options={priceDropDown?.map((option) => ({
                    value: option.PricingId,
                    label: option.PricingName,
                  }))}
                //   isOnchange={true}
                //   placeholder="Price Name"
                  label="Price Name"
                  id="PriceName"
                  onChangeFunction={(e) => priceDropDownChange(e)}
                  valueData={selectedPriceDropDown}
                  isOnchanges={formType == "edit" ? true : false}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "PricingId", label: "PricingName" }}
                  className="field-DropDown"
                  //   disabled={this.props?.editstate ? true : false}
                />

              </Form.Item>
              
              </div>
            </div>
            {FeatureList.length>0?
           
            
            <div style={{display: 'flex', flexWrap:"wrap", width:"100%"}}>
                 <div style={{paddingBottom:"10px",fontWeight:"500"}}>
                <p>Feature List</p>
                  </div>
                

              <Checkbox.Group
                style={{
                  width: "100%",
                }}
                onChange={onChange}
                value={checkedList}
              >
                <Row>
                    {FeatureList.map((value,key)=>
                  <Col span={10}>
                    <Checkbox style={{padding:"12px"}} value={value.FeatId} key={value.FeatId}>{value.FeatName}{" - "}{value.FeatConstraint}</Checkbox>
                  </Col>
                  )}
                 
                </Row>
              </Checkbox.Group>
            </div>
            :null}
            

            {selectedValues.length > 0? (
              <div className="submitButton">
                <Buttons
                  buttonText="SUBMIT"
                  color="901D77"
                  icon={<ArrowRightOutlined />}
                  // handleSubmit={handleSubmit}
                />
              </div>
            ) : null}
          </Form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AppPriceFeatureMappingForm;
