import { useState, useEffect, useRef,useCallback } from 'react';
import { useDispatch,useSelector } from 'react-redux'
import {useLocation, useNavigate } from 'react-router-dom';
import { Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import Imageupload from "../../Components/Forms/Upload.jsx";
import { DropDowns } from '../../Components/Forms/DropDown.jsx';
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import {getCategoryData,getSubCategoryData,categoryActiveDataSelector,subCategoryActiveDataSelector,postApplicationData, putApplicationData} from "../../features/applicationPage/applicationPage.js";
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL




const ApplicationForm = ({formType}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formRef = useRef(null);
  const state = location?.state
  const editstate = state?.editstate
  const categoryData = useSelector(categoryActiveDataSelector)
  const subCategoryData = useSelector(subCategoryActiveDataSelector)

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [SelectedCategory, setSelectedCategory] = useState(null);
  const [SelectedSubCategory, setSelectedSubCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "Application",
      link: `${subDirectory}setting/application-master/`,
    },
    {
      name:  editstate ? "Edit" : "New",
      link: editstate ? `${subDirectory}setting/application-master/update` : `${subDirectory}setting/application-master/new`,
    },
  
  ];
  


  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    dispatch(getCategoryData()).unwrap()
    dispatch(getSubCategoryData()).unwrap()
    if (editstate) {
      setImageUrl(editstate?.AppLogo)
      setBannerImageUrl(editstate?.BannerImage)
      formRef.current?.setFieldsValue({CateId:editstate.CateId,SubCateId:editstate.SubCateId})
      setSelectedCategory(editstate.CateId)
      setSelectedSubCategory(editstate.SubCateId)
    } 
  }, []);

  const onFinish = async (values) => {
    console.log(values,imageUrl,bannerImageUrl, "values");
    let postData=values
    postData["AppLogo"]=imageUrl
    postData["BannerImage"]=bannerImageUrl!="" ? bannerImageUrl : null
    postData["CreatedBy"] = getCookieData('UserId') || 7
    console.log("postData",postData)
    let response={}
    if (formType === "add") {
        try{
          response=await dispatch(postApplicationData(postData)).unwrap()
        }
        catch(err){
          if(err["message"]=="Request failed with status code 422"){
            response={data:{"statusCode": 0,
            "response": "Please Give Required Fields",
            'data': []}}
          }
        }
       
    }
    else if(formType === "edit"){
      
      postData["AppId"] = editstate?.AppId
      postData["UpdatedBy"] = getCookieData('UserId') || 7
      try{
          response=await dispatch(putApplicationData(postData)).unwrap()
      }catch(err){
        if(err["message"]=="Request failed with status code 422"){
          response={data:{"statusCode": 0,
          "response": "Please Give Required Fields",
          'data': []}}
        }
      }
    }
    console.log("response",response)
    if (response.data.statusCode == 1){
      navigate(`${subDirectory}setting/application-master/`, {state: {Notiffy: {
                    messageType: "success",
                    messageData: response.data.response,
                    
              }}
    })
  }else{
    setMessageType("error")
    setMessageData(response.data.response)
  }
  };
  

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
    
  }, [])

  const selectCategory = async(e)=>{
    formRef.current?.setFieldsValue({CateId:e})
    await setSelectedCategory(e)
    
  }
  const selectSubCategory = async(e)=>{
    formRef.current?.setFieldsValue({SubCateId:e})
    await setSelectedSubCategory(e)
  }
  
  return (
    <div className='pageOverAll'>
    <div className='userPage'>
      <div className='userPageContent'>
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
        <div className="formName">
          <FormHeader title={'Application'} />
        </div>
        <div className='formDiv'>
          <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
            {/* <div > */}
            <div className='formDivS'>
            <div className='inputForm'>
              <Form.Item
                name="AppName"
                
                rules={[
                  {
                    required: true,
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Application Name ",
                  },
                  {
                    validator: (_, value) => {
                      if (/^.{1,50}$/.test(value)) {
                        return Promise.resolve();
                      } 
                      else if(value!=""){
                        return Promise.reject('Please Enter Valid Application Name');
                      }
                      else{
                        return Promise.reject('');
                      }
                    },
                    // message: "Please Enter Valid Application Name ",
                  },

                ]}
              >
                <InputField
                  field="AppName"
                  autoComplete="off"
                  label="Application Name"
                  fieldState={true}
                  fieldApi={true}
                  isOnChange={formType == "edit" ? true :false}

                />
              </Form.Item>
              <Form.Item
                    name="CateId"
                    
                    rules={[
                        {
                        required: true,
                        message:"Please Select Category",
                        },
                    ]}
                    >
                    <DropDowns
                        options={categoryData?.map((option) => ({
                          value: option.ConfigId,
                          label: option.ConfigName,
                        }))}
                        label="Category"
                        onChangeFunction={selectCategory}
                        optionsNames={{ value: "ConfigId", label: "ConfigName" }}
                        className='field-DropDown'
                        isOnchanges={(formType == "edit" || SelectedCategory)?true:false}
                        valueData={SelectedCategory}
                        disabled={formType == "edit" ? true :false}
                        
                    />
                </Form.Item>
                <Form.Item
                    name="SubCateId"
                    
                    rules={[
                        {
                        required: true,
                        message:"Please Select Sub Category ",
                        },
                    ]}
                    >
                    <DropDowns
                        options={subCategoryData?.map((option) => ({
                          value: option.ConfigId,
                          label: option.ConfigName,
                        }))}
                        label="Sub Category"
                        onChangeFunction={selectSubCategory}
                        optionsNames={{ value: "ConfigId", label: "ConfigName" }}
                        className='field-DropDown'
                        isOnchanges={ (formType == "edit" || SelectedSubCategory)?true:false}
                        valueData={SelectedSubCategory}
                        disabled={formType == "edit" ? true :false}
                        
                    />
                </Form.Item>
              <Form.Item
                name="AppDescription"
                
                rules={[
                  {
                  required: true,
                  pattern: /^(?!\s*$).+/,
                  message:"Please Enter Application Description ",
                  },
              ]}>
                  <TextAreaInput
                    field="AppDescription"
                    autoComplete="off"
                    label="Description"
                    fieldState={true}
                    fieldApi={true}
                    isOnChange={formType == "edit" ? true :false}
                    />
                
              </Form.Item>
              
            <div className="upload_btn">
              <p>Upload Logo</p>
              <Imageupload singleImage={true} updateImageUrl={setImageUrl} ImageLink={formType == "edit" ? editstate?.AppLogo : ""}/>
            </div>
            <div className="upload_btn">
              <p>Upload Banner Image <i style={{color:"red"}}>*</i></p>
              
              <Imageupload singleImage={true} updateImageUrl={setBannerImageUrl} ImageLink={formType == "edit" ? editstate?.BannerImage : ""}/>
              
            </div>
            </div>
            </div>

            

            <div className='submitButton'>
              <Buttons
                buttonText="SUBMIT"
                color="901D77"
                icon={<ArrowRightOutlined />}
              //   handleSubmit={handleSubmit}
              />
            </div>







          </Form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ApplicationForm;