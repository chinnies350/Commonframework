import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Toggle } from '../../Components/Forms/Switch'
// import Sliders from './Components/Slider'
import giftimg from '../../images/giftimg.png'
import priceadd from '../../images/priceadd.png'
import { ArrowRightOutlined  } from '@ant-design/icons';
import { Messages } from '../../Components/Notifications/Messages';
import { pricingTypeSelector, getPricingType, postFreeOption, getPricingFeatures, pricingTypeFeatSelector } from '../../features/pricingType/pricingType'
import moment from 'moment';
import { useLocation, useNavigate } from "react-router-dom";
// import { getCookieData } from "../../Services/others";
import { getCookieData, storeCookieData } from '../../Services/others';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Table } from 'antd';
import '../../Components/table.scss';
import '../../Components/restaurant.scss'


const Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};



const subDirectory = import.meta.env.ENV_BASE_URL
const HomesubDirectory = import.meta.env.ENV_HOME_BASE_URL

const PricingDetails = () => {
  // const [sliderValue, setSliderValue] = useState(100);
  const [toggleValue, setToggleValue] = useState('Y');
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const navigate = useNavigate()
  const location = useLocation()

  console.log(location, 'location')

  const appName = location?.state?.appName

  console.log('appName', appName)



  const dispatch = useDispatch();

  const pricingTypeSelector = (state) => state.pricingType.PricingType;

  const pricingData = useSelector(pricingTypeSelector);

  const [AppId, setAppId] = useState(
    getCookieData("AppId") ? getCookieData("AppId") : null
  );

  const [UserId, setUserId] = useState(
    getCookieData("UserId") ? getCookieData("UserId") : null
  );




  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);


  }, [])




  // const handleSliderChange = (value) => {
  //   setSliderValue(value);
  //   dispatch(getPricingType({ sliderValue: value, toggleValue }));

  // };

  // const handleToggleChange = (checked) => {
  //   const newToggleValue = checked ? 'M' : 'Y';
  //   setToggleValue(newToggleValue);
  //   dispatch(getPricingType({ sliderValue, toggleValue: newToggleValue }));

  // };

  const handleToggleChange = (checked) => {
    const newToggleValue = checked ? 'Y' : 'M';
    setToggleValue(newToggleValue);
    dispatch(getPricingType({ toggleValue: newToggleValue, AppId, UserId }));


  };

  // useEffect(() => {
  //   dispatch(getPricingType({ sliderValue, toggleValue }));
  // }, [sliderValue, toggleValue, dispatch]);

  useEffect(() => {
    dispatch(getPricingType({ toggleValue, AppId, UserId }));

  }, [toggleValue, AppId, UserId, dispatch]);




  const handleStartNow = async (pricingData) => {

    const currentDate = new Date();
    const purDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
    const validityStartDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
    const validityEndDate = moment(currentDate).add(pricingData["NoOfDays"], 'days').format('YYYY-MM-DD HH:mm:ss');

    if (getCookieData("UserId")) {
      const postData = {

        UserId: getCookieData("UserId"),
        AppId: getCookieData("AppId"),
        PricingId: pricingData["PricingId"],
        PurDate: purDate,
        PaymentMode: 27,
        PaymentStatus: "S",
        LicenseStatus: "A",
        Price: pricingData["Price"],
        ValidityStart: validityStartDate,
        ValidityEnd: validityEndDate,
        CreatedBy: getCookieData("UserId") || 7,
      };
      const response = await dispatch(postFreeOption(postData)).unwrap()
      if (response.data.statusCode == 1) {
        setMessageType("success");
        setMessageData(response.data.response);
        if (getCookieData("UserId")) {
          await reloadhome()
        } else {

          await reloadPublicSignin()

        }
      } else {
        setMessageType("error")
        setMessageData(response.data.response)
      }
    }
    else {
      navigate(`${HomesubDirectory}public-signin`);
      window.location.reload()
    }
  };

  const reloadhome = () => {
    navigate(`${HomesubDirectory}landing-page/home`);
    window.location.reload()
  }
  const reloadPublicSignin = () => {
    navigate(`${HomesubDirectory}public-signin`);
    window.location.reload()
  }
  const handleSubmit = useCallback((pricingData) => {
    storeCookieData('AppId', pricingData["AppId"]);
    storeCookieData('PricingId', pricingData["PricingId"]);
    if (getCookieData("UserId")) {
      navigate(`/${appName}/invoice-detail`);
    } else {
      navigate(`${HomesubDirectory}public-signup`);
    }
    
  },[]);

  return (
    <div className='pricing'>
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete} />
      <div>
        <p>PRICING</p>
        <div className='pricingtext'><p>Simple, transparent pricing</p></div>
        <div className='pricingtoggle'>
          <div className='pricingsubtext'><p>Choose the package that suits you.<span>No Contracts. No surprise fees.</span> </p>

          </div>
          <div className='subtoggle'>
            <div className='monthtext'>Monthly  <Toggle defaultChecked={true}
              functionName={handleToggleChange}
            /></div>

            <div className='yeartext'>Yearly
              <button className='discountdiv'> 10% Discount </button>
            </div>
          </div>
        </div>
        <div className='sliderdiv'>
          {/* <Sliders 
        value={sliderValue} 
        onChange={handleSliderChange} 
        /> */}
        </div>

        <div className='pricingcont'>


          <div>
            <div className='pricingdiv' >
              <div className='pricingcardsdiv'>
              {pricingData?.map((featureP, i) => ( featureP["PricingName"].toUpperCase() === "FEATURENAME" && <div key={i} className='pricingcardsFeature'>
                        <div className='pricingname'>
                          <p>{featureP["PricingName"].toUpperCase()}</p>
                        </div>
                        
                        <div className='divFeature'>
                              {featureP['FeatureDetail']?.map((feature, index) => ( 
                                <React.Fragment key={index} >
                                  {/* {index === 0 && <p className="small-font" style={{ color: "green" }}>No of Users</p>} */}
                                  {index === 0 && <p className="small-font" style={{ lineHeight: "0.1em", margin: "1px 0" }}>&nbsp;</p>} {/* Add a smaller gap */}
                                  <p className="small-font">
                                    
                                    {feature.Status == "Y"?<CheckOutlined />: feature.Status == undefined? feature.FeatName : ""}
                                    </p>
                                  {/* <p className="small-font">{feature.FeatName}</p>
                            <p className="small-font">{"No of Users: " + feature.FeatConstraint}</p> */}
                                </React.Fragment>
                              ))}
                          </div>
                      </div>)) }
                <div className='pricingFeaturesCards'>
                    {[
                      //  pricingData.find((val) => val["PricingName"].toUpperCase() === "FEATURENAME"),
                      pricingData.find((val) => val["PricingName"].toUpperCase() === "FREE"), // Free pricing card object
                      ...pricingData.filter((val) => val["PricingName"].toUpperCase() !== "FREE" && val["PricingName"].toUpperCase() != "FEATURENAME"), // Other pricing card objects
                    ].map((val, i) => {
                      if (val) {
                        return (
                          <div key={i} className={val["PricingName"].toUpperCase() === "FEATURENAME" ? 'pricingcardsFeature ' :'pricingcards' }>
                            <div className='pricingname'>
                              <p>{val["PricingName"].toUpperCase()}</p>
                            </div>
                            <div className='pricingcontent'>
                              <div>{val["PricingName"].toUpperCase() == "FREE" ?
                                (<img className='gitfimg' src={giftimg}></img>) : 
                                val["PricingName"].toUpperCase() == "FEATURENAME" ? 
                                ((
                                  <div className='divFeatureDetails'>
                                    <span className="net-price"></span>
                                    <span className="net-price-strike"></span>
                                  </div>
                                )):
                                ((
                                  <div>
                                    <span className="net-price">₹{val["NetPrice"]}</span>
                                    <span className="net-price-strike">₹{val["DisplayPrice"]}</span>
                                  </div>
                                ))}
                              </div>

                            </div>

                            <div className='pricingstart'>
                              {val["PricingName"].toUpperCase() === "FREE" ? (
                                <div className={`freebtn ${val["Status"] === "Already Used" ? "disabled" : ""}`} onClick={() => handleStartNow(val)}>
                                  {val["Status"] === "Already Used" ? (
                                    <button className="disabled-button-free" disabled>
                                      Already Used
                                    </button>
                                  ) : (
                                    <>
                                      <p>Start Now</p>
                                      <ArrowRightOutlined />
                                    </>
                                  )}
                                </div>
                              )  : val["PricingName"].toUpperCase() === "FEATURENAME" ? ( <div >
                            </div>) : (
                                <div className='btntext' onClick={() => handleSubmit(val)}>
                                  {val["Status"] === "Extend Pack" ? "Extend Pack" : "Start Now"} <ArrowRightOutlined />
                                </div>

                              )}
                            </div>
                            
                            
                            <div className='divFeature'>
                              
                              {val["PricingName"].toUpperCase() !== "FREE" && (
                                <>
                                {console.log(val['FeatureDetail']?.slice(1, val['FeatureDetail']?.lenght), 'features')}
                                  {val['FeatureDetail']?.map((feature, index) => ( 
                                    <React.Fragment key={index} >
                                      {/* {index === 0 && <p className="small-font" style={{ color: "green" }}>No of Users</p>} */}
                                      {index === 0 && <p className="small-font" style={{ lineHeight: "0.1em", margin: "1px 0" }}>&nbsp;</p>} {/* Add a smaller gap */}
                                      <p className="small-font">
                                        
                                        {feature.Status == "Y"?<CheckOutlined />: feature.Status == undefined? feature.FeatName : ""}
                                        </p>
                                      {/* <p className="small-font">{feature.FeatName}</p>
                                <p className="small-font">{"No of Users: " + feature.FeatConstraint}</p> */}
                                    </React.Fragment>
                                  ))}
                                </>
                              )}</div>
                          </div>
                        );

                      } else {
                        return null; // Handle the case where pricingData is empty or does not contain the Free pricing card
                      }
                    })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PricingDetails




