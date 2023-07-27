import { useState, useEffect, useRef,useCallback } from 'react';
import { useDispatch,useSelector } from 'react-redux'
import {useLocation, useNavigate } from 'react-router-dom';
import { Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { InputField } from "../../Components/Forms/InputField.jsx";
import { TextAreaInput } from "../../Components/Forms/TextArea.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from '../pageComponents/FormHeader.jsx';
import { changeBreadCrumb } from '../../features/appPage/centerPage.js';
import { RadioGrpButton } from "../../Components/Forms/RadioGroup.jsx";
import { postMessageTemplates, putMessageTemplates } from '../../features/MessageTemplates/MessageTemplate.js';
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL




const MessageTemplateForm = ({formType}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const formRef = useRef(null);
  const state = location?.state
  const editstate = state?.editstate

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [Selectedtemplatetype, setSelectedtemplatetype] = useState('S');

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },
  
    {
      name: "MessageTemplates",
      link: `${subDirectory}setting/message-template/`,
    },
    {
      name:  editstate ? "Edit" : "New",
      link: editstate ? `${subDirectory}setting/message-template/update` : `${subDirectory}setting/message-template/new`,
    },
  
  ];
  


  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
    if (editstate) {
      formRef.current?.setFieldsValue({TemplateType:editstate.TemplateType})
    } 
  }, []);

  const onFinish = async (values) => {
    let postData=values
    // postData["TemplateType"] = values.TemplateType === "2" ? 'S' : 'M';
    postData["CreatedBy"] = getCookieData('UserId') || 7
    let response={}
    if (formType === "add") {
        try{
          response=await dispatch(postMessageTemplates(postData)).unwrap()
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
      
      postData["UniqueId"] = editstate?.UniqueId
      postData["UpdatedBy"] = getCookieData('UserId') || 7
      try{
          response=await dispatch(putMessageTemplates(postData)).unwrap()
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
      navigate(`${subDirectory}setting/message-template/`, {state: {Notiffy: {
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

  const selecttemplatetype = async(e)=>{
    formRef.current?.setFieldsValue({TemplateType:e})
    await setSelectedtemplatetype(e)
    
  }
  
  return (
    <div className='pageOverAll'>
    <div className='userPage'>
      <div className='userPageContent'>
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
        <div className="formName">
          <FormHeader title={'Message Templates'} />
        </div>
        <div className='formDiv'>
          <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
            {/* <div > */}
            <div className='formDivS'>
            <div className='inputForm'>
              <Form.Item
                name="MessageHeader"
                
                rules={[
                  {
                    required: true,
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Message Header"
                  },
                  {
                    validator: (_, value) => {
                      if (/^.{1,50}$/.test(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject('Please Enter MessageHeader');
                      }
                    },
                    //message: "Please Enter Message Header",
                  },

                ]}
              >
                <InputField
                  field="MessageHeader"
                  autoComplete="off"
                  label="Message Header"
                  fieldState={true}
                  fieldApi={true}
                  isOnChange={formType == "edit" ? true :false}

                />
              </Form.Item>
              <Form.Item
                name="Subject"
                
                rules={[
                  {
                    required: true,
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Subject"
                  },
                  {
                    validator: (_, value) => {
                      if (/^.{1,150}$/.test(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject('Please Enter Subject');
                      }
                    },
                   // message: "Please Enter Subject",
                  },

                ]}
              >
                <InputField
                  field="Subject"
                  autoComplete="off"
                  label="Subject"
                  fieldState={true}
                  fieldApi={true}
                  isOnChange={formType == "edit" ? true :false}

                />
              </Form.Item>
              <Form.Item
                name="MessageBody"
                
                rules={[
                  {
                    required: true,
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Message Body"
                  },
              ]}>
                  <TextAreaInput
                    field="MessageBody"
                    autoComplete="off"
                    label="Message Body"
                    fieldState={true}
                    fieldApi={true}
                    isOnChange={formType == "edit" ? true :false}
                    />
                
              </Form.Item>
              <Form.Item
                name="Peid"
                rules={[
                  {
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Peid"
                  }]}
                
              >
                <InputField
                  field="Peid"
                  autoComplete="off"
                  label="Peid"
                  fieldState={true}
                  fieldApi={true}
                  isOnChange={formType == "edit" ? true :false}

                />
              </Form.Item>
              <Form.Item
                name="Tpid"
                rules={[
                  {
                    pattern: /^(?!\s*$).+/,
                    message:"Please Enter Tpid"
                  }]}
                
              >
                <InputField
                  field="Tpid"
                  autoComplete="off"
                  label="Tpid"
                  fieldState={true}
                  fieldApi={true}
                  isOnChange={formType == "edit" ? true :false}

                />
              </Form.Item>
              <Form.Item name="TemplateType">
                    <li className="drp_btn">
                      <RadioGrpButton
                        content={[
                          { value: "M", label: "Mail" },
                          { value: "S", label: "SMS" },
                          { value: "N", label: "Notification"}
                        ]}
                        fieldState={true}
                        onSelectFuntion={selecttemplatetype}
                        defaultSelect={editstate?.TemplateType?editstate?.TemplateType:'M'
                        }
                        Header={"Select TemplateType"}
                      />
                    </li>
                </Form.Item>
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

export default MessageTemplateForm;

