import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Space } from "antd";
import {
  EditFilled,
  DeleteFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Tables } from "../../Components/Tables/Table";
import { Search } from "../../Components/Forms/Search";
import Buttons from "../../Components/Forms/Buttons";
import { Messages } from "../../Components/Notifications/Messages";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import {
  branchDataSelector,
  getBranchData,
  deleteBranchData,
  getBranchAdminUsers,
  BranchAdminSelector,
} from "../../features/branchPage/branchPage.js";
import { getCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL;

const BranchList = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const branchData = useSelector(branchDataSelector);
  console.log(branchData, "testinfconsos");

  const BranchAdminusers = useSelector(BranchAdminSelector);

  //local states
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);

  const [UserType, setUserType] = useState(
    getCookieData("UserType") ? getCookieData("UserType") : null
  );

  const items = [
    {
      name: "Home",
      link: `${subDirectory}landing-page/home`,
    },

    {
      name: "Branch",
      link: `${subDirectory}setting/branch-master`,
    },
  ];

  useEffect(() => {
    try {
      dispatch(changeBreadCrumb({ items: items }));
      dispatch(getBranchData()).unwrap();
      if (location?.state?.Notiffy) {
        setMessageType(location?.state?.Notiffy.messageType);
        setMessageData(location?.state?.Notiffy.messageData);
      }
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);
  const actionsFormatter = async (row, rowIndex) => {
    if (row.ActiveStatus !== "D") {
      navigateTo(
        `${subDirectory}setting/branch-master/update`,
        { state: { editstate: row } },
        { key: rowIndex }
      );
    }
  };

  useEffect(() => {
    dispatch(getBranchAdminUsers(getCookieData("UserId")));
  }, [getCookieData("UserId")]);

  const statusFormatter = async (row) => {
    let deleteData = {
      BrId: row.BrId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData("UserId") || 7,
    };
    let response = await dispatch(deleteBranchData(deleteData)).unwrap();
    if (response.data.statusCode == 1) {
      setMessageType("success");
      setMessageData(
        row.ActiveStatus == "A"
          ? "In-Activated Successfully"
          : "Activated Successfully"
      );
      if (UserType === "Admin") {
        dispatch(getBranchAdminUsers(getCookieData("UserId")));
      } else {
        await dispatch(getBranchData()).unwrap();
      }
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };
  const onSearch = (value) => {
    setSearchedText(value);
  };
  const onSearchChange = (e) => {
    setSearchedText(e.target.value);
  };

  const columns = [
    {
      title: "Si.No",
      key: "sno",
      align: "center",
      width: "100px",
      render: (text, object, index) => (
        <a style={{ color: "black" }}>{index + 1}</a>
      ),
    },

    {
      title: "Branch Name",
      dataIndex: "BrName",
      key: "BrName",
      width: "150px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.BrName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.City).toLowerCase().includes(value.toLowerCase()) ||
          String(record.Dist).toLowerCase().includes(value.toLowerCase()) ||
          String(record.State).toLowerCase().includes(value.toLowerCase())
        );
      },
      sorter: (a, b) => a.BrName.localeCompare(b.BrName),
      sortOrder: sortedInfo.columnKey === "BrName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "City",
      dataIndex: "City",
      key: "City",

      width: "150px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a?.City?.localeCompare(b?.City),
      sortOrder: sortedInfo.columnKey === "City" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "District",
      dataIndex: "Dist",
      key: "Dist",

      width: "150px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a?.Dist?.localeCompare(b?.Dist),
      sortOrder: sortedInfo.columnKey === "Dist" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "State",
      dataIndex: "State",
      key: "State",

      width: "150px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      sorter: (a, b) => a?.State?.localeCompare(b?.State),
      sortOrder: sortedInfo.columnKey === "State" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Action",
      key: "Action",
      dataIndex: "Action",
      width: "150px",
      align: "center",
      render: (_, record, index) =>
        branchData.length >= 1 ? (
          <Space size="middle">
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
  const handelAddButton = () => {
    navigateTo(`${subDirectory}setting/branch-master/new`);
  };

  return (
    <div className="userPageTable">
      <div className="userPageContent">
        <Messages
          messageType={messageType}
          messageData={messageData}
          onComplete={onComplete}
        />
        <div className="formAddNew">
          <div>
            <FormHeader title={"Branch"} />
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
              handleSubmit={() => handelAddButton()}
              color="901D77"
              icon={<PlusOutlined />}
            >
              OPEN
            </Buttons>
          </div>
        </div>

        <div className="reportTable">
          {/* <Tables columns={columns} data={branchData} dataSource={branchData} onChange={handleChange} />{" "} */}
          {UserType === "Admin" || UserType === "Admin User" ? (
            <Tables
              columns={columns}
              data={BranchAdminusers}
              dataSource={BranchAdminusers}
              onChange={handleChange}
            />
          ) : (
            // Render the table for other user types
            <Tables
              columns={columns}
              data={branchData}
              dataSource={branchData}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchList;
