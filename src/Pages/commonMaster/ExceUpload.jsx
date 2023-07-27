import React, { useState,useRef, useEffect  } from "react";  
import { read, utils, writeFile } from 'xlsx';
import ExcelJS from 'exceljs';
import { Table } from "antd";
import TertiaryButton from "../../Components/Forms/tertiaryButton";
import { useDispatch, useSelector } from 'react-redux'
import "../../Components/Forms/main.scss";
import {emptyExcelData,excelDataSelector,excelFileSelector,excelFileErrorSelector,fileInputRefSelector,uploadExcel} from "../../features/exceluploadPage/exceluploadPage.js";



const HomeComponent = ({ handleSubmit, showHomeComponent }) => {
const excelData = useSelector(excelDataSelector)
const excelFile = useSelector(excelFileSelector)
const excelFileError = useSelector(excelFileErrorSelector)
const fileInputRef =  useRef(fileInputRefSelector)
    

const dispatch = useDispatch();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1,raw: false });
        const header = jsonData[0]; // Extract the header row
        const rows = jsonData.slice(1); // Remove the header row from data
        
        const formattedData = rows.map((row) => {
          return header.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {});
        });
           
        dispatch(uploadExcel({ file, jsonData }));
        handleSubmit(formattedData);
        
      };
      reader.readAsArrayBuffer(file);
    }else {
      dispatch(emptyExcelData());
    }
  };

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // Define columns
    worksheet.columns = [
      { header: 'TypeId', key: 'typeId'  },
      { header: 'configName', key: 'configName' },
      { header: 'AlphaNumF Id', key: 'alphaNumFld' },
      { header: 'NumF Id', key: 'numFld'  },
      { header: 'SmallIcon', key: 'smallIcon'},
    ];
  
    // Add data rows
    worksheet.addRow({
      typeId: 47,
      configName: 'testdata',
      alphaNumFld: 'A1',
      numFld: 1,
      smallIcon: 'http://saveme.live/paypre-image-api/upload?fileId=6467539ee38476fbe75e9622.jpg',
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
  
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filename = 'configData.xlsx';
  
    if (typeof window !== 'undefined') {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE browser
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // For other browsers
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename;
        downloadLink.click();
      }
    }
  };
  

  // File upload submit handler
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile === null) {
      excelFileError("Please select an Excel file.");
    } else {
      handleSubmit(excelData);
    }
  };


  const handleCancelData = () => {
    dispatch(emptyExcelData());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
  };


  // const columns = excelData
  // ? excelData[0].map((column, index) => ({ title: column, dataIndex: index, key: index }))
  // : [];
  // const dataSource = excelData && excelData.length > 1
  // ? excelData.slice(1).map((row, index) =>
  //     row.reduce(
  //       (obj, cell, columnIndex) => ({ ...obj, [columnIndex]: cell }),
  //       { key: index }
  //     )
  //   )
  // : [];

  const smallIconColumnTitle = "SmallIcon"; // Replace with the actual column title
  const columns = excelData
    ? excelData[0].map((column, index) => ({ title: column, dataIndex: index, key: index,
    }))
    : [];
  
  const smallIconColumnIndex = columns.findIndex((column) => column.title === smallIconColumnTitle);

  
  const dataSource = excelData && excelData.length > 1
    ? excelData.slice(1).map((row, index) =>
        row.reduce(
          (obj, cell, columnIndex) => {
            if (columnIndex === smallIconColumnIndex) {
              obj[columnIndex] = <img src={cell} alt="Small Icon" style={{ width: "50%", height: "auto", maxHeight: "50px" }} />; // Apply styling for fixed size & Render Image
            } else {
              obj[columnIndex] = cell;
            }
            return obj;
          },
          { key: index }
        )
      )
    : [];

  return (
    <div className="container">
      <div className="form">
        <form className="form-group" autoComplete="off" onSubmit={handleFileSubmit}>
        {/* <TertiaryButton 
        // type="button" className="btn btn-danger" style={{ marginTop: "2px", marginLeft: "35rem"}}
          buttonText="CANCEL" 
          handleSubmit={handleCancelData}>
          Cancel
        </TertiaryButton> */}
          <label>
            <h5>Upload Excel file</h5>
          </label> 
          <br />
          {(!excelData || excelData.length === 0) && ( // Only render the input if excelData is empty
        <input type="file" className="form-control" onChange={handleFileUpload} required ref={fileInputRef} />
      )}
      <button className="download-link" onClick={handleDownload}>
          Download File
        </button>
      <button className="cancel-link" onClick={handleCancelData} style={{ marginLeft: '140px' }}>
        <span role="img" aria-label="cancel-symbol">&#10060;</span>
          Remove File
        </button>

      {/* <button onClick={handleDownload} >Download File</button> */}
          {excelFileError && (
            <div className="text-danger" style={{ marginTop: "5px" }}>
              {excelFileError}
            </div>
          )}
          
        </form>
      </div>

      {showHomeComponent && (
      <div className="viewer" style={{ maxHeight: "500px", overflow: "auto" }}>
      {excelData && excelData.length > 0 ? (
          <Table className="xltable" columns={columns} dataSource={dataSource} scroll={{ y: "auto" }} />
        ) : (
          <p></p>
        )}
      </div>
     )}
    </div>
    
  );
};
export default HomeComponent;


