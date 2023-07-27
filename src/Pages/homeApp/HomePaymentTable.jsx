import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux"
import { Tables } from "../../Components/Tables/Table"
import { purchasedTypeAppSelector,getTypePurchasedApp } from "../../features/homePage/homePage"
import { Space } from "antd";
import {DownloadOutlined} from '@ant-design/icons';
import PdfPage from '../../Pages/paymentpdfPage/paymentpdfpage'
import { printDiv,getCookieData } from "../../Services/others";
import moment from "moment";


const style = `<style>
*{
  font-family:Poppins;
}
.Pdf-body{  
  background-color: #33585c1f;
  height: 100%;
  margin: 0vw 0vh;
  padding: 1vw 2vh;
}

@media *{
  element.class {
     font-family: "Courier New";
     font-size: 10pt;
  }
  /* You can add additional styles here which you need */
}

.Pdf-Div{
  padding: 1vw 1vh;
  background-color:rgb(255, 255, 255);
  border-radius: 8px; 
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;  
}

.Pdf-head-div{
  padding: 0vw 1vh;
  color: #2b2b2b;
}

.Pdf-head{
  font-size:45px;
  font-weight:600; 
  color: #000000; 
  line-height: 0;
}

.headlogo-img{ 
width: 70px;
}

.Pdf-amt-digit{
font-weight:600;
}
.square {
  height: 240px;
  width: 240px;
  // background-color: #851764;  
  background-color: #f5f5f5; 
  border-radius: 5%;
  display: inline-block; 
  position: relative;
  z-index: -1; 
  margin-top: -18rem;
  margin-left: -2rem;
}

.Pdf-Cont-Div{
  background-color: #ffffff; 
  padding: 0vw 2vh; 
  
}

.Pdf-cont{
  // background-color: #33585c1f;  
  margin: 0vw 0vh;
  padding: 0vw 0vh;
  display: flex;  
  // flex-wrap: wrap;
  row-gap: 1rem;
  justify-content: space-evenly; 
}

.Pdf-amt-details{
  text-align: right;
}


.Pdf-cont-txt{
  padding: 0vw 1vh; 
}

.Pdf-cont-subhead{
  font-size:20px;
  font-weight: 500;
}

.Pdf-cont-text{
  font-size:14px;
}



.Pdf-Table-Div{
  background-color: #ffffff; 
  padding: 3vw 0vh; 
  
}




table {
  // border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
  font-family:'Poppins';
}

table caption {
  font-size: 1.2em;
  margin: .0em 0 .95em;
  padding: 1vw 3vh;
  font-family: 'Poppins' !important;
  text-transform: uppercase;
  font-weight:600;
  letter-spacing:3px;
  background-color: #f5f5f5;
}

table tr {

  padding: .35em;
}

table th,
table td {
  padding: 1vw 1vh; 
  text-align: center;
}

table th {
  font-size: .85em;
  letter-spacing: .1em;
  text-transform: uppercase;
}


.table-2div{ 
  text-align: right;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.table-cont2{
  display: flex;
  justify-content: space-evenly;
}

.Pdf-footer-div{
  background-color: #ffffff; 
  padding: 0vw 0vh;  
  display: flex;
  flex-wrap: wrap;
  row-gap: 2rem;
  justify-content: center;
}

.Pdf-footer-subdiv{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  row-gap: 0rem;
  align-items: center;
  width:300px;
  justify-content: space-around;

}
.Pdf-footer-txt1{
  font-size:18px;
  width: 500px;
  font-weight: 600; 
}

.Pdf-footer-txt{
  font-size:13px;
  width: 500px;
}

.Pdf-footer-subdiv-txt-div{ 
  justify-content: space-evenly;
  font-size: 15px;
}

.Pdf-footer-subdiv-txt{
  display: flex;
  align-items: center;
  text-align: left;
  line-height: 0;
  justify-content: start; 
   
}


.logo-img{
  padding: 1vw 1vh;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }
  
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }
  
  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }
  
  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  table td:last-child {
    border-bottom: 0;
  }
}

hr.new3 { 
  border-top: 1px dotted   rgb(90, 90, 90); 
}

hr.new4 { 
  border :16px solid    #2e4f53; 
}




@media screen and (max-width: 976px) {

.Pdf-Div{
  display: flex !important; 
  margin: 0vw 0vh !important;  
  flex-direction: row;
  justify-content: space-between !important;
  row-gap: 3rem;
}

.Pdf-head-div{
  display: flex !important; 
  margin: 0vw 7vh !important;
  align-items: center;
  flex-direction: row;
  column-gap: 2rem;
}

.square{
display: none !important;   
}

.Pdf-footer-div { 
justify-content: space-around !important;
}

}
</style>`;


const HomePaymentTable = () => {
    const purchasedApp = useSelector(purchasedTypeAppSelector)
    const [printdata, setprintdata] = useState([]);
    // const UserId = getCookieData('UserId') || 1


    // useEffect(() => {
    //   async function getApiData() {
    //     await dispatch(getTypePurchasedApp({ UserId })).unwrap();
    //   }
    //   getApiData()
    // }, [])
    
    const columns = [
        {
            title: 'Payment Date',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            render: (text) => <a className="tableText">{moment(text).format('lll')}</a>,

        },
        {
            title: 'Price',
            dataIndex: 'NetPrice',
            key: 'NetPrice',
            render: (text) => <a className="tableText">{text}</a>
        },
        {
            title: 'Payment Mode',
            dataIndex: 'PaymentModeName',
            key: 'PaymentModeName',
            render: (text) => <a className="tableText">{text}</a>
        },
        {
            title: 'Status',
            dataIndex: 'PaymentStatus',
            key: 'PaymentStatus',
            render: (text) => {
                if (text == 'P') {
                    return (<a className="tableText Pending">Pending</a>)
                }
                if (text == 'S') {
                    return (<a className="tableText Success">Success</a>)
                }
                if (text == 'C') {
                    return (<a className="tableText Cancelled">Cancelled</a>)
                }
            }
        },
        {
            title: "Download",
            key: "Download",
            dataIndex: "Action",
            width: "200px",
            align: "center",
            render: (_, record, index) =>


                <Space size="middle">
                    <a>
                        <DownloadOutlined
                            style={{
                                color: "#EF5350",
                            }}
                            onClick={() => statusFormatter(record)}
                        />
                    </a>
                </Space>
        },
    ]

    //Downlaod
    const statusFormatter = async (row) => {
        console.log(row, "downloadrow")
        await setprintdata(row)
        await PrintReceipt()

    };

    const PrintReceipt = async () => {
        await printDiv("Pdfbody", style);
    };


    return (
        <><div style={{ display: "none" }}><PdfPage
            printingdata={printdata}
            CompanyName={null}
            zipcode={null}
            address={null}
            City={null}
        /></div>
            <div className="paymentHistoryTable">
                <Tables columns={columns} data={purchasedApp} />
            </div>
        </>


    )
}


export default HomePaymentTable