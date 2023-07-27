import React, { useState, useEffect, useCallback  } from "react";
import { useDispatch } from "react-redux";
import { Form, Space } from "antd";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { EditFilled, DeleteFilled, PlusOutlined,ReloadOutlined } from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table.jsx";
import Search from "../../Components/Forms/Search.jsx";
import { getConfigName } from "../../Services/CarouselService.js";
import { Link } from "react-router-dom";
import { getFeature, deleteFeature } from "../../features/feature/feature.js";
import { getCookieData } from "../../Services/others";
import { Messages } from "../../Components/Notifications/Messages";
import { useNavigate, useLocation } from "react-router-dom";

// import '../../styles/user/userForm.scss'

import FormHeader from "../pageComponents/FormHeader.jsx";
const subDirectory = import.meta.env.BASE_URL;

const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "Feature",
    link: `${subDirectory}setting/feature-master`,
  },
];

const FeatureList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [TableData, setTableData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  async function fetchData() {
    if (location?.state?.Notiffy) {
      setMessageType(location?.state?.Notiffy.messageType);
      setMessageData(location?.state?.Notiffy.messageData);
    }

    const gettingTableData = await dispatch(getFeature()).unwrap();
    if (gettingTableData.data.statusCode === 1) {
      await setTableData(gettingTableData.data.data);
    }
  }

  const onSearch = (value) => {
    setSearchedText(value);
  };
  const onSearchChange = (e) => {
    setSearchedText(e.target.value);
  };

  useEffect(() => {
    try {
      fetchData();
      dispatch(changeBreadCrumb({ items: items }));
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  const actionsFormatter = async (row, rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigate(
        `${subDirectory}setting/feature-master/update`,
        { state: { editstate: row } },
        { key: rowIndex }
      );
    }
  };

  //Delete
  const statusFormatter = async (row) => {
    let deleteData = {
      FeatId: row.FeatId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData("UserId") || 7,
    };
    let response = await dispatch(deleteFeature(deleteData)).unwrap();
    if (response.data.statusCode == 1) {
      setMessageType("success");
      setMessageData(
        row.ActiveStatus == "A"
          ? "In-Activated Successfully"
          : "Activated Successfully"
      );
      fetchData();
    }
  };

  const columns = [
    {
      title: "SI.NO",
      key: "sno",
      align: "center",
      width: "100px",
      render: (text, object, index) => (
        <a style={{ color: "black" }}>{index + 1}</a>
      ),
    },

    {
      title: "Feature Name",
      dataIndex: "FeatName",
      key: "FeatName",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {return (
                                    String(record.FeatName)
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                )},
    
      sorter: (a, b) => a.FeatName.localeCompare(b.FeatName),
      sortOrder: sortedInfo.columnKey === "FeatName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Feature Category",
      dataIndex: "FeatCatName",
      key: "FeatCatName",

      width: "200px",
      align: "center",
      filteredValue: filteredInfo.FeatCatName || null,
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.FeatCatName.length - b.FeatCatName.length,
      sortOrder:
        sortedInfo.columnKey === "FeatCatName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Feature Type",
      dataIndex: "FeatTypeName",
      key: "FeatTypeName",
      filteredValue: filteredInfo.FeatTypeName || null,

      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a.FeatTypeName.length - b.FeatTypeName.length,
      sortOrder:
        sortedInfo.columnKey === "FeatTypeName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "200px",
      align: "center",
      render: (_, record, index) =>
        TableData.length >= 1 ? (
          <Space size="middle">
            {/* edit cmd */}
            {record.ActiveStatus === "A" ? (
              <a>
                <EditFilled onClick={() => actionsFormatter(record, index)} />
              </a>
            ) : (
              ""
            )}
            <a>
              {record.ActiveStatus === "A" ? (
                <DeleteFilled
                  style={{
                    color: "#EF5350",
                  }}
                  onClick={() => statusFormatter(record)}
                />
              ) : (
                <ReloadOutlined
                  style={{
                    color: "Green",
                  }}
                  onClick={() => statusFormatter(record)}
                />
              )}
            </a>
          </Space>
        ) : null,
    },
  ];
  const data = TableData;

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
    
  }, [])

  const handelAddButton=()=>{
    navigate(`${subDirectory}setting/feature-master/new`)
  }

  return (
    <div className="userPageTable">
      <div className="userPageContent">
      <Messages messageType={messageType} messageData={messageData} onComplete={onComplete}/>
        <div className="formAddNew">
          <div>
            <FormHeader title={"Feature"} />
          </div>
          <div className="searchAddDiv">
            <div className="formSearch">
              <Search
                placeholder="Search"
                onSearch={onSearch}
                onSearchChange={onSearchChange}
              />
            </div>
            <Buttons
              buttonText={"Add New"}
              handleSubmit={()=>handelAddButton()}
              color="901D77"
              icon={<PlusOutlined />}
            >
              OPEN
            </Buttons>
          </div>
        </div>
        <div className="reportTable">
          <Tables
            columns={columns}
            data={TableData}
            dataSource={TableData}
            onChange={handleChange}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default FeatureList;
