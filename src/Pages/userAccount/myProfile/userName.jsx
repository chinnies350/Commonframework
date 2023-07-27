import { useSelector, useDispatch } from "react-redux"
import { changeUserData, updateUserData, userDataByUserId } from "../../../features/userAccount/userAccount"
import {BsPencil} from 'react-icons/bs';
import {AiOutlineArrowLeft} from 'react-icons/ai'
import { ArrowRightOutlined } from "@ant-design/icons";
import { useState, useCallback } from "react";
import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { InputField } from "../../../Components/Forms/InputField";
import Imageupload from "../../../Components/Forms/Upload.jsx";
import Buttons from "../../../Components/Forms/Buttons.jsx";
import { Messages } from "../../../Components/Notifications/Messages";
import { getCookieData } from "../../../Services/others";
// import DefaultProfile from "../../../Images/DefaultProfile.wepb";
import DefaultProfile from '../../../Images/DefaultProfile.png'


const UserName = () => {
    const userData = useSelector(userDataByUserId)
    const dispatch = useDispatch()

    const [showData, setShowData] = useState(true)
    const [editData, setEditData] = useState(false)
    const [imageUrl, setImageUrl] = useState(userData.UserImage && userData.UserImage!=""?userData.UserImage:DefaultProfile)
    const [messageType, setMessageType] = useState(null);
    const [messageData, setMessageData] = useState(null);

    const formRef = useForm()
    
    const onFinish = async (values) => {
   
        values["UserImage"] = imageUrl?imageUrl:DefaultProfile

        // values["UserImage"] = imageUrl?imageUrl: userData.UserImage!=""?userData.UserImage:'https://saveme.live/paypre-image-api/upload?fileId=64a52cde06bfb6b6b992286e.webp'
        values["UserId"] = getCookieData('UserId') ?? 1
        values["UpdatedBy"] = getCookieData('UserId') ?? 1
        const res = await dispatch(updateUserData(values)).unwrap()
        if (res.data.statusCode) {
            setMessageData(res.data.response)
            setMessageType('success')
            setShowData(true)
            setEditData(false)
            dispatch(changeUserData({userData: values}))
        } else {
            setMessageData(res.data.response)
            setMessageType('error')
        }
       

    }

    const editstate = {"UserName": userData.UserName,
                        "MailId": userData.MailId,
                        "MobileNo": userData.MobileNo}
    const updateImageUrl = (url) => {
       
                                setImageUrl(url?url:null)
                                }

    const onComplete = useCallback(() => {
        setMessageData(null);
        setMessageType(null);
        
        
        }, [])


    
    

    
    return (
        <div className="userAccountUserName">
            {showData && <div className="showData">
                <div className="profileImage userAccountField">
                    <img src={userData.UserImage?userData.UserImage:DefaultProfile} alt="profile image" width='150px' height='150px' style={{borderRadius: 'inherit'}}/>
                </div>
                <div className="userNameDiv userAccountField">
                    <p className="heading">Full Name</p>
                    <p>{userData.UserName}</p>
                </div>
                <div className="userEmailAddress userAccountField">
                    <p className="heading">Email Address</p>
                    <p>{userData.MailId}</p>
                </div>
                <div className="userAccountField">
                    <p className="heading">Phone</p>
                    <p>{userData.MobileNo}</p>
                </div>
                <div className="userAccountButton">
                    <button onClick={() => {setShowData(false)
                                            setEditData(true)}}>Edit <span><BsPencil/> </span></button>
                </div>
            </div>}

            {editData && 
                <div className="editData">
                    <div className="backClassUser" onClick={() => {setShowData(true)
                                                                    setEditData(false)
                                                                }}
                                                                    >
                        <AiOutlineArrowLeft/> &nbsp; Back
                    </div>
                    
                    <Form ref={formRef} className="formDivAnt" onFinish={onFinish} initialValues={editstate}>
                        <Form.Item  
                                name="UserName"
                                rules={[{ pattern:/^(?!\s*$).+/,message:"Please Enter User Name" }]}
                        >
                            <InputField
                            field="UserName"
                            autoComplete="off"
                            label="Full Name"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={true}
                        />

                        </Form.Item>
                        <Form.Item  
                        name="MailId"
                        rules={[
                            {
                              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                              message: 'Enter a Valid MailId',
                              required: true,
                            },
                          ]}
                        >
                            <InputField
                            field="MailId"
                            autoComplete="off"
                            label="Email Address"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={true}
                        />
                        </Form.Item>
                        <Form.Item  
                        name="MobileNo"
                        rules={[
                            {
                              pattern: /^[0-9]{10}$/,
                              message: 'Enter a Valid MobileNo',
                              required: true,
                            },
                          ]}
                  
                        >
                            <InputField
                            field="MobileNo"
                            autoComplete="off"
                            maxLength="10"
                            label="Phone"
                            fieldState={true}
                            fieldApi={true}
                            isOnChange={true}
                        />
                        </Form.Item>
                        <div className="upload_btn">
                            <p>Upload Profile</p>
                            <Imageupload singleImage={true} updateImageUrl={updateImageUrl} ImageLink={userData.UserImage? userData.UserImage : DefaultProfile}/>
                        </div>
                        <div className='submitButton'>
                            <Buttons
                            buttonText="SUBMIT"
                            color="901D77"
                            icon={<ArrowRightOutlined />}
                            htmlType={true}
                            />
                        </div>
                    
                    </Form>
                </div>}
            <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
        </div>
    )
}

export default UserName;