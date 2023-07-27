import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../Components/Forms/InputField.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Messages } from "../../Components/Notifications/Messages";
import { Form } from "antd";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { DropDowns } from "../../Components/Forms/DropDown.jsx";
import {
  getPricingTag,
  getTaxdata,
  getCurrData,
  postPriceType,
  putPriceType
} from "../../features/priceType/priceType.js";
import {
  getApplication
} from "../../features/appMenu/appMenu.js";
import { getCookieData } from "../../Services/others";
import { useNavigate, useLocation } from "react-router-dom";
const subDirectory = import.meta.env.BASE_URL;


const PricingForm = ({ formType }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;
  const editstate = state?.editstate;


  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [appDropDown, setappDropDown] = useState([]);
  const [PriceTagDropDown, setPriceTagDropDown] = useState([]);
  const [TaxDropDown, setTaxDropDown] = useState([]);
  const [currDropDown, setcurrTaxDropDown] = useState([]);
  const [FeatureList, setFeatureList] = useState([]);
  const [selectedValues, setselectedValues] = useState([]);
  const [SelectedPrice, setSelectedPrice] = useState(null);
  const [SelectedTaxamount, setSelectedTaxamount] = useState(null);
  const [selectedAppData, setSelectedAppData] = useState(
    editstate ? editstate.AppId : null
  );
  const [selectedPriceDropDown, setselectedPriceDropDown] = useState(
    editstate ? (editstate.PriceTag != 0 ? editstate.PriceTag : null) : null
  );
  const [selectedTaxId, setselectedTaxId] = useState(
    editstate ? (editstate.TaxId != 0 ? editstate.TaxId : null) : null
  );
  const [selectedCurrId, setselectedCurrId] = useState(
    editstate ? (editstate.CurrId != 0 ? editstate.CurrId : null) : null
  );
  

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "PricingType",
      link: `${subDirectory}setting/pricing`,
    },
    {
      name: editstate ? "Edit" : "New",
      link:  editstate
      ? `${subDirectory}setting/pricing/update`
      : `${subDirectory}setting/pricing/new`,
    },
  ];




  const onFinish = async (values) => {
    console.log(values,"value of data")
    let postData = values;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    

    let response = {};
    if (formType === "add") {
      postData["AppId"] = values.AppName;
      postData["TaxId"] = values.Tax;
      response = await dispatch(postPriceType(postData)).unwrap();
    } else if (formType === "edit") {
      if (editstate) {
        postData["AppId"] = editstate.AppId;
        postData["PricingId"] = editstate?.PricingId;
        postData["TaxId"] = values.Tax;
      }
      postData["UpdatedBy"] = getCookieData("UserId") || 7;

      response = await dispatch(putPriceType(postData)).unwrap();
    }

    if (response.data.statusCode == 1) {
      navigate(`${subDirectory}setting/pricing/`, {
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
    const gettingappDropDown = await dispatch(getApplication()).unwrap()
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
        // 
        if (editstate) {
          
          console.log(editstate,"editstateeditstate")
          appDropDownChange(editstate.AppId);
          PriceTagDropDownChange(editstate.PriceTag)
          TaxDropDownChange(editstate.TaxId)
          CurrDropDownChange(editstate.CurrId)
          // TaxAmount
          formRef.current?.setFieldsValue(
            editstate
            // LevelTwo: editstate.Level2Id,
          );
        } else {
          navigate(`${subDirectory}setting/app-menu/`);
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
    console.log(e,"taxIddsssss")
    formRef.current?.setFieldsValue({ AppName: e });
    setSelectedAppData(e)
    
    const gettingPriceTagDropDown = await dispatch(getPricingTag()).unwrap()
    if (gettingPriceTagDropDown.data.statusCode === 1) {
      let finalPriceTagDropDowndata = gettingPriceTagDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );

      setPriceTagDropDown(finalPriceTagDropDowndata);
    }
  };

  const TaxDropDownChange = async (e) => {
    console.log(e,"ssss")
    // setselectedTaxId(null)
    await setselectedTaxId(e)
    formRef.current?.setFieldsValue({ Tax: e });
    console.log(typeof(e),"typeof")
    
    const taxAmount = TaxDropDown.filter((value) => (value.TaxId === parseInt(e)));
    console.log(taxAmount,"taxAmount")
    // ROUND(330/118*9,2)
    // Math.round(formRef.current?.getFieldsValue()?.NetPrice/118*taxAmount[0]?.TaxPercentage,2)
    const finalTaxAmount = formRef.current?.getFieldsValue()?.NetPrice
      ? Math.round(
          (formRef.current?.getFieldsValue()?.NetPrice / 118) *
            taxAmount[0]?.TaxPercentage,
          2
        )
      : 0;
    const netPrice =
      parseInt(formRef.current?.getFieldsValue()?.NetPrice) -
      parseInt(finalTaxAmount);
      
    formRef.current?.setFieldsValue({
      TaxAmount: finalTaxAmount,
      Price: netPrice ? netPrice : 0,
    });
    setSelectedPrice(netPrice ? netPrice : 0)
    setSelectedTaxamount(finalTaxAmount)
    
    const gettingCurrDropDown = await dispatch(getCurrData()).unwrap()
    if (gettingCurrDropDown.data.statusCode === 1) {
      let finalCurrDropDowndata = gettingCurrDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setcurrTaxDropDown(finalCurrDropDowndata);
    }
    console.log("tesyinggg")
  };

  const CurrDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ CurrId: e });
    setselectedCurrId(e)
  };

  const PriceOnChange = async () => {
    const TaxId = formRef.current?.getFieldsValue()?.Tax;
    const taxAmount = TaxId
      ? TaxDropDown.filter((value) => (value.TaxId = TaxId))
      : 0;
    const finalTaxAmount = formRef.current?.getFieldsValue()?.NetPrice
      ? Math.round(
          (formRef.current?.getFieldsValue()?.NetPrice / 118) *
            taxAmount[0]?.TaxPercentage,
          2
        )
      : 0;
    const netPrice =
      parseInt(formRef.current?.getFieldsValue()?.NetPrice) -
      parseInt(finalTaxAmount);
      
    formRef.current?.setFieldsValue({
      TaxAmount: finalTaxAmount ? finalTaxAmount : 0,
      Price: netPrice ? netPrice : 0,
    });
    setSelectedPrice(netPrice ? netPrice : 0)
    setSelectedTaxamount(finalTaxAmount ? finalTaxAmount : 0)
  };

  const PriceTagDropDownChange = async (e) => {
    formRef.current?.setFieldsValue({ PriceTag: e });
    setselectedPriceDropDown(e)
    
    const gettingTaxDropDown = await dispatch(getTaxdata()).unwrap()
    if (gettingTaxDropDown.data.statusCode === 1) {
      let finalTaxDropDowndata = gettingTaxDropDown.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setTaxDropDown(finalTaxDropDowndata);
    }
  };

  return (
    <div className="pageOverAll">
    <div className="userPage">
      <div className="userPageContent">
        <Messages messageType={messageType} messageData={messageData} />
        <div className="formName">
          <FormHeader title={"Pricing Type"} />
        </div>

        <div className="formDiv">
          {console.log("Selected values",SelectedPrice,SelectedTaxamount)}
          <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={{ ...editstate }}>
            <div className="formDivS">
              <div className='inputForm'>
              <Form.Item
                name="AppName"
                
                rules={[
                  {
                    required: true,
                    message: "Please Select App Name ",
                  },
                ]}
              >
                <DropDowns
                  options={appDropDown?.map((option) => ({
                    value: option.AppId,
                    label: option.AppName,
                  }))}
                  label="App Name"
                  id="AppName"
                  field="AppName"
                  fieldState={true}
                  fieldApi={true}
                  onChangeFunction={(e) => appDropDownChange(e)}
                  isOnchanges={formType == "edit" ? true : false}
                  valueData={selectedAppData}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "AppId", label: "AppName" }}
                  className="field-DropDown"
                />
              </Form.Item>

              <Form.Item
                name="PricingName"
                
                rules={[
                  {
                    required: true,
                    pattern: /^(?!\s*$).+/,
                    message: "Please Enter Pricing Name ",
                  },
                ]}
              >
                <InputField
                  field="PricingName"
                  name="PricingName"
                  label="Pricing Name"
                  fieldState={true}
                  fieldApi={true}
                  id="error2"
                  autocomplete="off"
                  isOnChange={formType == "edit" ? true : false}
                />
              </Form.Item>

              <Form.Item
                name="NetPrice"
                
                rules={[
                  {
                    validator: (_, value) => {
                      if (value >= 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Please Enter Valid Net Price ");
                      }
                    },
                  },
                ]}
              >
                <InputField
                  field="NetPrice"
                  name="Net Price"
                  type="number"
                  label="Net Price"
                  fieldState={true}
                  fieldApi={true}
                  onChange={PriceOnChange}
                  id="error2"
                  autocomplete="off"
                  isOnChange={formType == "edit" ? true : false}
                />
              </Form.Item>

              <Form.Item
                name="DisplayPrice"
                
                rules={[
                  {
                    validator: (_, value) => {
                      if (value >= 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Enter Valid Display Price ");
                      }
                    },
                  },
                ]}
              >
                <InputField
                  field="DisplayPrice"
                  name="DisplayPrice"
                  type="number"
                  label="Display Price"
                  fieldState={true}
                  fieldApi={true}
                  id="error2"
                  autocomplete="off"
                  isOnChange={formType == "edit" ? true : false}
                />
              </Form.Item>

              <Form.Item
                name="PriceTag"
                
                rules={[
                  {
                    required: true,
                    message: "Please Select Price Tag ",
                  },
                ]}
              >
                <DropDowns
                  options={PriceTagDropDown?.map((option) => ({
                    value: option.ConfigId,
                    label: option.ConfigName,
                  }))}
                  label="Price Tag"
                  id="PriceTag"
                  field="PriceTag"
                  fieldState={true}
                  fieldApi={true}
                  onChangeFunction={(e) => PriceTagDropDownChange(e)}
                  isOnchanges={formType == "edit" ? true : false}
                  valueData={selectedPriceDropDown}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "ConfigId", label: "ConfigName" }}
                  className="field-DropDown"
                />
              </Form.Item>

              <Form.Item
                name="Tax"
                
                rules={[
                  {
                    required: true,
                    message: "Please Select Tax ",
                  },
                ]}
              >
                <DropDowns
                  options={TaxDropDown?.map((option) => ({
                    value: option.TaxId,
                    label: option.TaxName,
                  }))}
                  label="Tax"
                  id="Tax"
                  field="Tax"
                  fieldState={true}
                  fieldApi={true}
                  onChangeFunction={(e) => TaxDropDownChange(e)}
                  isOnchanges={formType == "edit" ? true : false}
                  valueData={selectedTaxId}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "TaxId", label: "TaxName" }}
                  className="field-DropDown"
                />
              </Form.Item>

              <Form.Item
                name="Price"
                
                rules={[
                  {
                    validator: (_, value) => {
                      if (value >= 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(" Valid Price is Required ");
                      }
                    },
                  },
                ]}
              >
                <InputField
                  field="Price"
                  name="Price"
                  type="number"
                  label="Price"
                  fieldState={true}
                  fieldApi={true}
                  id="error2"
                  autocomplete="off"
                  isOnChange={SelectedPrice !=null?true:false}
                  
                  disabled
                />
              </Form.Item>
              {/* TaxAmount */}

              <Form.Item
                name="TaxAmount"
                
                rules={[
                  {
                    validator: (_, value) => {
                      if (value >= 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Valid Tax Amount is Required ");
                      }
                    },
                  },
                ]}
              >
                <InputField
                  field="TaxAmount"
                  name="Tax Amount"
                  type="number"
                  label="Tax Amount"
                  fieldState={true}
                  fieldApi={true}
                  disabled
                  id="error2"
                  autocomplete="off"
                  isOnChange={SelectedTaxamount!=null?true:false}
                />
              </Form.Item>

              {/* currDropDown */}

              <Form.Item
                name="CurrId"
                
                rules={[
                  {
                    required: true,
                    message: "Please Select Currency ",
                  },
                ]}
              >
                <DropDowns
                  options={currDropDown?.map((option) => ({
                    value: option.CurrId,
                    label: option.CurrName,
                  }))}
                  label="Currency"
                  id="CurrId"
                  field="CurrId"
                  fieldState={true}
                  fieldApi={true}
                  onChangeFunction={(e) => CurrDropDownChange(e)}
                  isOnchanges={formType == "edit" ? true : false}
                  
                  valueData={selectedCurrId}
                  // defaultValue={LastSelectConfig}

                  optionsNames={{ value: "CurrId", label: "CurrName" }}
                  className="field-DropDown"
                />
              </Form.Item>
              {/* NoOfDays */}

              <Form.Item
                name="NoOfDays"
                
                rules={[
                  {
                    validator: (_, value) => {
                      if (value >= 0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Please Enter  No of Days ");
                      }
                    },
                  },
                ]}
              >
                <InputField
                  field="NoOfDays"
                  name="NoOfDays"
                  type="number"
                  label="No of Days"
                  fieldState={true}
                  fieldApi={true}
                  id="error2"
                  autocomplete="off"
                  isOnChange={formType == "edit" ? true : false}
                />
              </Form.Item>
              </div>
            </div>

            <div className="submitButton">
              <Buttons
                buttonText="SUBMIT"
                color="901D77"
                icon={<ArrowRightOutlined />}
                // handleSubmit={handleSubmit}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PricingForm;
