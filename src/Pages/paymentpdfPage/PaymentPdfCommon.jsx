import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Pdfdoc.scss"
// import logo from "../../images/payprelogo1.svg"
import logo from "../../images/Api images/payprelogo1.png";
import { PhoneOutlined,MailOutlined,EnvironmentOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Messages } from "../../Components/Notifications/Messages";
import { getUserMappDetails} from "../../../src/features/PaymentPdfPageCommon/paymentPdfPageCommon";
const subDirectory = import.meta.env.BASE_URL;
const PdfPageCommon =()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("paymentId");
  var CompanyName=null
  var address =null
  var City=null
  var zipcode =null

  const [BookingId, setBookingId] = useState(id ? id : null);
  const [BookingDeatils,setBookingDeatils]=useState([]);
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    PaymentDetailsByBookingId();
  }, []);

  const PaymentDetailsByBookingId = async () => {
    let response = await dispatch(getUserMappDetails(BookingId)).unwrap();
    if (response?.data?.statusCode === 1) {
  
      if (response?.data?.data[0].PaymentStatus === "S") {
        setBookingDeatils(response?.data?.data[0]);
      } else {
        setMessageType("error");
        setMessageData("Sorry, No details found");
        navigate(`${subDirectory}`)
      }
    }
  };

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);

    return (
        <>
         <Messages
        messageType={messageType}
        messageData={messageData}
        onComplete={onComplete}
      />
        <div className="Pdf-body" id="Pdfbody"> 
        <div className="Pdf-Div"> 
        <div className="Pdf-head-div">
                <img src={logo} className="headlogo-img" /> 
                <div> 
                <p className="Pdf-head"> Invoice </p>
                <p> PayPre Private Limited </p>
                </div>
                <span class="square"></span> 
            </div> 

            <div className="Pdf-amt-details">
                <p> Invoice Number : <span className="Pdf-amt-digit"> {BookingDeatils?BookingDeatils?.UniqueId:null} </span> </p>
                <p> Amount: <span className="Pdf-amt-digit">₹ {BookingDeatils?BookingDeatils?.NetPrice:0} </span> </p>
            </div>
            <div className="Pdf-amt-details"> 
                <p> Payment Method : <span className="Pdf-amt-digit"> {BookingDeatils?BookingDeatils.PaymentModeName:null} </span></p>
                <p> Date : <span className="Pdf-amt-digit"> {BookingDeatils?moment(BookingDeatils.PurDate).format('l'):null} </span> </p>
                
            </div>   
        </div> 

         
        <div className="Pdf-Cont-Div">  

            <div className="Pdf-cont"> 
            <div className="Pdf-cont-txt" >
                <p className="Pdf-cont-subhead" > Billed From</p>
                <p className="Pdf-cont-text"> 
                    Paypre ,
                    51, Step colony, Dharga, 
                    Hosur - 635 126, 
                    Tamilnadu, India. 
                    <p>Phone : +91 9344644484, 9445222716</p>   
                </p>
            </div>
            <div  className="Pdf-cont-txt" >
                <p className="Pdf-cont-subhead"> Billed To </p>
                <p className="Pdf-cont-text"> 
                
                {BookingDeatils?BookingDeatils.UserName!=null?BookingDeatils.UserName:BookingDeatils.MobileNo:"hh"},<br/>
                <p className="Pdf-cont-text"> 
                {CompanyName!=null?CompanyName:null}
                </p>
                {address!=null?address:null}{" "}
                {City!=null?City:null}{" "}
                {zipcode!=null?zipcode:null}
                    <p>Phone : {BookingDeatils?BookingDeatils.MobileNo:null}</p>   
                </p>
            </div> 

            </div>
            
        </div> 
 
 
        <hr class="new3"/>


        <div className="Pdf-Table-Div">  
            <table>
            <caption>Statement Summary</caption>
            <thead>
                <tr>
                <th scope="col">Description</th>
                <th scope="col">Purchase Date</th>
                <th scope="col">Period</th>
                <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td data-label="Account">{BookingDeatils?BookingDeatils.AppName:null}</td>
                <td data-label="Due Date">{BookingDeatils?moment(BookingDeatils.PurDate).format('l'):null}</td>
                <td data-label="Period">{BookingDeatils?moment(BookingDeatils.ValidityStart).format('l'):null} - {BookingDeatils?moment(BookingDeatils.ValidityEnd).format('l'):null}</td>
                <td data-label="Amount">₹{BookingDeatils?BookingDeatils.NetPrice:0}</td> 
                </tr>
            </tbody>    
            </table>    
        </div> 

        <hr class="new3"/>


        <div className="Pdf-Table-Div">  
            <table> 
        
            <tbody>
                <tr>
                <th> </th>
                <th> </th> 
                <th data-label="Sub Total">Sub Total</th>
                <td>₹{BookingDeatils?BookingDeatils.Price:0}</td>   
                </tr>

                <tr>
                <td> </td>
                <td> </td>
                <th data-label="Tax">Tax  </th>
                <td >₹{BookingDeatils?BookingDeatils.TaxAmount:0}</td> 
                </tr>

                <tr>
                <th> </th>
                <th> </th> 
                <th data-label="Total">Total</th>
                <td >₹{BookingDeatils?BookingDeatils.NetPrice:0}</td>   
                </tr>

            </tbody>    
            </table>    
        </div> 

        <div className="Pdf-footer-div"> 
            <div>
                <p className="Pdf-footer-txt1"> Terms & Conditions </p> 
                <p className="Pdf-footer-txt"> 
                These Buying Terms and Conditions (the "Agreement") 
                set forth the terms and conditions governing the purchase of 
                goods or services (collectively referred to as "Products") 
                from a seller or vendor (referred to as the "Seller") 
                by a buyer (referred to as the "Buyer"). By placing an order for Products, 
                the Buyer agrees to be bound by this Agreement.
                </p>
           </div>

           <div className="Pdf-footer-subdiv" >

              <div  className="Pdf-footer-subdiv-txt-div">
                    <p  className="Pdf-footer-subdiv-txt"> <PhoneOutlined /> &nbsp;  87569876216</p>
                    <p  className="Pdf-footer-subdiv-txt"> <MailOutlined/> &nbsp;  paypre@info.com</p>
                    <p  className="Pdf-footer-subdiv-txt"> <EnvironmentOutlined /> &nbsp;  Hosur-Tamilnadu, India. </p> 
             </div> 

             <div>
             <img src={logo} className="logo-img" /> 
             </div>

           </div> 
        </div>

        <hr className="new4"/>

        </div>
        </>
    )
}



export default PdfPageCommon;