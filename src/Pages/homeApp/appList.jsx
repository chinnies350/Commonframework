import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchasedApp,getTypePurchasedApp, getAppAccess, putDeafaulBranch, getDeafaulBranch } from "../../features/homePage/homePage";
import { getActiveApplicationData } from "../../features/applicationPage/applicationPage";
import { getCookieData, storeCookieData } from "../../Services/others";
import { useNavigate } from "react-router-dom";
import { DefaultModal } from "../../Components/Modal/DefaultModal";
import { Form } from "antd";
import { Col, Row, Checkbox } from 'antd';
import '../../fonts/Gilroy/stylesheet.css'
import { ClockCircleOutlined } from '@ant-design/icons';
import { DropDowns } from '../../Components/Forms/DropDown.jsx';

import { appCompanyDataSelector, appBranchDataSelector, getActiveAppCompanyData, getActiveAppBranchData } from "../../features/appAccessPage/appAccessPage.js";
import PricingDetails from "../pricingTypeRestaurant/Pricing";
import '../../Pages/homeApp/Homeapp.scss'



const subDirectory = import.meta.env.ENV_BASE_URL


const AppList = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const [purchasedApp, setPurchasedApp] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [branchVisible, setBranchVisible] = useState(false);
    const [checked, setChecked] = useState(false);
    const [eachApp, setEachApp] = useState(null);


    const UserId = getCookieData('UserId') || 1
    const companyData = useSelector(appCompanyDataSelector)
    const branchData = useSelector(appBranchDataSelector)

    const [UserType, setUserType] = useState(
        getCookieData("UserType") ? getCookieData("UserType") : null
    );


    const handleCancel = () => {
        form.resetFields();
        setModalVisible(false);
        setBranchVisible(false);
    };

    const handleSubmit = useCallback(() => {
        setModalVisible(false);
        setBranchVisible(false);
        form.resetFields();
        if (eachApp && eachApp.AppName) {
            storeCookieData('AppId', eachApp.AppId)
            navigate(`/${eachApp.AppName?.toLowerCase()}/`);
            window.location.reload()
        }
    }, [eachApp]);


    useEffect(() => {
        async function getApiData() {
            let res;
            if (UserType === 'Employee' || UserType === 'Super Admin User') {
                res = await dispatch(getAppAccess({ UserId })).unwrap();
            } else if (UserType === 'Super Admin') {
                res = await dispatch(getActiveApplicationData()).unwrap();
            } else {
                res = await dispatch(getPurchasedApp({ UserId })).unwrap();
                await dispatch(getTypePurchasedApp({ UserId })).unwrap();
            }
            console.log('res', res);
            if (res.data.statusCode) {
                setPurchasedApp(res.data.data);
            }
            // if (res.)
        }

        getApiData()
    }, [])

    const getDefaultFun = async (AppId, UserId, AppName,eachApp) => {
        let GetDefault = await dispatch(getDeafaulBranch({ "AppId": AppId, "UserId": UserId })).unwrap();

        let DefaultBranch = GetDefault.data.statusCode;


        if (DefaultBranch == "1") {    
            navigate(`/${AppName?.toLowerCase() }/`);
            window.location.reload()
        }
        else {
            if (UserType === 'Admin' || UserType === 'Employee' || UserType === 'Super Admin User') {
                dispatch(getActiveAppCompanyData({ "AppId": AppId, "UserId": UserId })).unwrap();
            } else {
                dispatch(getActiveAppCompanyData({ "AppId": AppId })).unwrap();
            }

            setModalVisible(true);
            // console.log(eachApp,"eachAppeachApp")
            setEachApp(eachApp);

            if (eachApp.RemainingDays < 0) {
                // setPricingmodalVisible(true)
                navigate(`${subDirectory}pricing-details`, {
                    state: { appName: AppName },
                    // replace: true
                })
                storeCookieData('AppId', AppId)
            }


        }


    }

    const applicationNavigate = useCallback((eachApp) => {
        let data = getDefaultFun(eachApp.AppId, UserId, eachApp.AppName,eachApp)

    }, [])

    const handleDropDownChange = async (value) => {
        // debugger
        if (UserType === 'Employee') {
            dispatch(getActiveAppBranchData({ "AppId": eachApp.AppId, "UserId": UserId, "CompId": value })).unwrap();
            setBranchVisible(true);
        } else {
            storeCookieData('CompId', value)
            handleSubmit();
        }
    };

    const handleBranchDropDownChange = async (value) => {
        if (checked === false) {
            if (eachApp && eachApp.AppName) {
                storeCookieData('CompId', eachApp.CompId)
                storeCookieData('BranchId', value)
                console.log("eachAppeachApp", eachApp)
                navigate(`/${eachApp.AppName?.toLowerCase()}/`);
                window.location.reload()
            }
        }
        else {
            if (eachApp && eachApp.AppName) {
                storeCookieData('CompId', eachApp.CompId)
                storeCookieData('BranchId', value)
                console.log("eachAppeachApp", eachApp)
                let response = await dispatch(putDeafaulBranch({
                    "CompId": eachApp.CompId,
                    "BranchId": value,
                    "UserId": UserId,
                    "DefaultBranch": "Y"
                })).unwrap();

                if (response.data.statusCode == 1) {
                    navigate(`/${eachApp.AppName?.toLowerCase()}/`);
                    window.location.reload()
                }


            }
        }



    };


    const onChange = (e) => {
        console.log("getting checked value", e)
        setChecked(e.target.checked)
    };

    const purchasedAppCard = purchasedApp.map((eachApp) => {
        console.log('image link', eachApp?.ImageLink.length > 0 ? eachApp?.ImageLink[0]?.ImageLink : "http://saveme.live/paypre-image-api/upload?fileId=6479bc59e38476fbe75e9b39.png", eachApp.UniqueId, eachApp)
        let divColour = "appCard";
        let Day = "";
        if(UserType == "Admin"){
        if (eachApp.RemainingDays <= 5) {
            Day = <div className="divExpire"><ClockCircleOutlined /> expires in {eachApp.RemainingDays} days</div>
            divColour = "appCardexpired"
        }

        if (eachApp.RemainingDays < 0) {
            divColour = "appCardexpire"
            Day = <div className="divExpired"><ClockCircleOutlined /> expired </div>
        }

        if (eachApp.RemainingDays == 0) {
            divColour = "appCardexpire"
            Day = <div className="divExpire"><ClockCircleOutlined />  expires in Today </div>
        }
    }

        return (
            <div key={eachApp.UniqueId} className={divColour}
                onClick={() => applicationNavigate(eachApp)}>
                <div>
                    {/* {console.log("Img",JSON.parse(JSON.stringify(eachApp?.ImageLink))[0])} */}
               
                    {console.log("Imgss",typeof(eachApp?.ImageLink),eachApp?.ImageLink)}
                    {/* {console.log("Img",JSON.parse(eachApp?.ImageLink)[0]?.ImageLink)} */}
                    <img className="appimg" src={eachApp?.ImageLink.length > 0 ? JSON.parse(JSON.stringify(eachApp?.ImageLink))[0]?.ImageLink : "http://saveme.live/paypre-image-api/upload?fileId=6479bc59e38476fbe75e9b39.png"} alt="App Logo" />
                </div>
                <p>{eachApp.AppName}</p>
                <div>{Day}</div>
            </div>
        )
    })

    if (UserType === 'Employee') {

    }

    return (
        <div className="appListComponent">
            {purchasedApp.length > 0 && purchasedAppCard}

            <DefaultModal
                open={modalVisible}
                title="Organization Name"
                footer={false}
                children={

                    <Form form={form}>
                        <Row gutter={[24, 24]}>
                            {branchVisible ?
                                <Col className="appCheckbox" span={24}>
                                    <Checkbox className="appCheckboxText" onChange={onChange}>Default Branch</Checkbox>
                                </Col> : null
                            }
                            <Col className="gutter-row" span={12}>
                                <Form.Item
                                    name="CompanyName"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <DropDowns
                                        options={companyData?.map((option) => ({
                                            value: option.CompId,
                                            label: option.CompName,
                                        }))}
                                        defaultValue="Select"
                                        label="Organization Name"
                                        className="field-DropDown appdropdown"
                                        isOnchanges={true}
                                        onChangeFunction={handleDropDownChange}
                                    />

                                </Form.Item>

                            </Col>
                            {branchVisible ?
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        name="BranchName"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DropDowns
                                            options={branchData?.map((option) => ({
                                                value: option.BrId,
                                                label: option.BrName,
                                            }))}
                                            defaultValue="Select"
                                            label="Branch Name"
                                            className="field-DropDown appdropdown"
                                            isOnchanges={true}
                                            onChangeFunction={handleBranchDropDownChange}
                                        />

                                    </Form.Item>

                                </Col> : null

                            }

                        </Row>



                    </Form>
                }
                handleCancel={handleCancel}
            />




        </div>
    )
}

export default AppList;










