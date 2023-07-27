import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleFilled, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const [excelData, setExcelData] = useState(null);
const [excelFile, setExcelFile] = useState(null);
const [excelFileError, setExcelFileError] = useState(null);

const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        };
      } else {
        setExcelFileError('Please select only excel file types');
        setExcelFile(null);
      }
    } else {
      console.log('Please select a file');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    } else {
      setExcelData(null);
    }
  };
  
  const handleExport = () => {
    if (excelData !== null) {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelData, 'exported_data.xlsx');
    }
  };

const Modals = ({ open, title, handleCancel, children, footer }) => {
    return (
      <Modal
        visible={open}
        title={title}
        onCancel={handleCancel}
        footer={
          footer ? (
            [
              <Button key="submit" type="primary" onClick={handleSubmit}>
                Submit
              </Button>,
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
            ]
          ) : (
            footer
          )
        }
      >
        {children}
        <div>
          <h4>Import Excel</h4>
          <input type="file" onChange={handleFile} />
          {excelFileError && <div className="error">{excelFileError}</div>}
          <Button type="primary" icon={<ImportOutlined />} onClick={handleSubmit}>
            Import
          </Button>
        </div>
        <div>
          <h4>Export Excel</h4>
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button>
        </div>
      </Modal>
    );
  };
  
  export default Modals;
  
  
  
  
  