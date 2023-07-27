import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Pdfdoc.scss";
// import logo from "../../images/payprelogo1.svg"
import logo from "../../images/Api images/payprelogo1.png";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import moment from "moment";

const PdfPage = ({ printingdata, CompanyName, zipcode, address, City }) => {
  return (
    <>
      <div className="Pdf-body" id="Pdfbody">
        <div className="Pdf-Div">
          <div className="Pdf-head-div">
            <img
              src={logo}
              className="headlogo-img"
            />
            <div>
              <p className="Pdf-head"> Invoice </p>
              <p> PayPre Private Limited </p>
            </div>
            <span class="square"></span>
          </div>

          <div className="Pdf-amt-details">
            <p>
              {" "}
              Invoice Number :{" "}
              <span className="Pdf-amt-digit">
                {" "}
                {printingdata ? printingdata?.UniqueId : null}{" "}
              </span>{" "}
            </p>
            <p>
              {" "}
              Amount:{" "}
              <span className="Pdf-amt-digit">
                ₹ {printingdata ? printingdata?.NetPrice : 0}{" "}
              </span>{" "}
            </p>
          </div>
          <div className="Pdf-amt-details">
            <p>
              {" "}
              Payment Method :{" "}
              <span className="Pdf-amt-digit">
                {" "}
                {printingdata ? printingdata.PaymentModeName : null}{" "}
              </span>
            </p>
            <p>
              {" "}
              Date :{" "}
              <span className="Pdf-amt-digit">
                {" "}
                {printingdata
                  ? moment(printingdata.PurDate).format("l")
                  : null}{" "}
              </span>{" "}
            </p>
          </div>
        </div>

        <div className="Pdf-Cont-Div">
          <div className="Pdf-cont">
            <div className="Pdf-cont-txt">
              <p className="Pdf-cont-subhead"> Billed From</p>
              <p className="Pdf-cont-text">
                Paypre , 51, Step colony, Dharga, Hosur - 635 126, Tamilnadu,
                India.
                <p>Phone : +91 9344644484, 9445222716</p>
              </p>
            </div>
            <div className="Pdf-cont-txt">
              <p className="Pdf-cont-subhead"> Billed To </p>
              <p className="Pdf-cont-text">
                {printingdata
                  ? printingdata.UserName != null
                    ? printingdata.UserName
                    : printingdata.MobileNo
                  : "hh"}
                ,<br />
                <p className="Pdf-cont-text">
                  {CompanyName != null ? CompanyName : null}
                </p>
                {address != null ? address : null} {City != null ? City : null}{" "}
                {zipcode != null ? zipcode : null}
                <p>Phone : {printingdata ? printingdata.MobileNo : null}</p>
              </p>
            </div>
          </div>
        </div>

        <hr class="new3" />

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
                <td data-label="Account">
                  {printingdata ? printingdata.AppName : null}
                </td>
                <td data-label="Due Date">
                  {printingdata
                    ? moment(printingdata.PurDate).format("l")
                    : null}
                </td>
                <td data-label="Period">
                  {printingdata
                    ? moment(printingdata.ValidityStart).format("l")
                    : null}{" "}
                  -{" "}
                  {printingdata
                    ? moment(printingdata.ValidityEnd).format("l")
                    : null}
                </td>
                <td data-label="Amount">
                  ₹{printingdata ? printingdata.NetPrice : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr class="new3" />

        <div className="Pdf-Table-Div">
          <table>
            <tbody>
              <tr>
                <th> </th>
                <th> </th>
                <th data-label="Sub Total">Sub Total</th>
                <td>₹{printingdata ? printingdata.Price : 0}</td>
              </tr>

              <tr>
                <td> </td>
                <td> </td>
                <th data-label="Tax">Tax </th>
                <td>₹{printingdata ? printingdata.TaxAmount : 0}</td>
              </tr>

              <tr>
                <th> </th>
                <th> </th>
                <th data-label="Total">Total</th>
                <td>₹{printingdata ? printingdata.NetPrice : 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="Pdf-footer-div">
          <div>
            <p className="Pdf-footer-txt1"> Terms & Conditions </p>
            <p className="Pdf-footer-txt">
              These Buying Terms and Conditions (the "Agreement") set forth the
              terms and conditions governing the purchase of goods or services
              (collectively referred to as "Products") from a seller or vendor
              (referred to as the "Seller") by a buyer (referred to as the
              "Buyer"). By placing an order for Products, the Buyer agrees to be
              bound by this Agreement.
            </p>
          </div>

          <div className="Pdf-footer-subdiv">
            <div className="Pdf-footer-subdiv-txt-div">
              <p className="Pdf-footer-subdiv-txt">
                {" "}
                <PhoneOutlined /> &nbsp; 87569876216
              </p>
              <p className="Pdf-footer-subdiv-txt">
                {" "}
                <MailOutlined /> &nbsp; paypre@info.com
              </p>
              <p className="Pdf-footer-subdiv-txt">
                {" "}
                <EnvironmentOutlined /> &nbsp; Hosur-Tamilnadu, India.{" "}
              </p>
            </div>

            <div>
              <img
                src={
                  "data:image/jpeg;base64,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"
                }
                width="70"
                height="100"
                className="logo-img"
              />
            </div>
          </div>
        </div>

        <hr className="new4" />
      </div>
    </>
  );
};

export default PdfPage;
