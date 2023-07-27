import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { InputField } from "../../Components/Forms/InputField.jsx";
import Buttons from "../../Components/Forms/Buttons.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Space, Form } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { DatePic } from "../../Components/Forms/DatePicker.jsx";
import { changeBreadCrumb } from "../../features/appPage/centerPage.js";
import { Drawers } from "../../Components/Drawer/Drawer.jsx";
import { Tables } from "../../Components/Tables/Table";
import Search from "../../Components/Forms/Search.jsx";
import { PlusOutlined } from "@ant-design/icons";
import FormHeader from "../pageComponents/FormHeader.jsx";
import { Messages } from "../../Components/Notifications/Messages";
import { useNavigate, useLocation } from "react-router-dom";

// import { getAdmin } from "../../Services/AdminTaxMasterService.js";
import { getAdmin, postTax, deleteTax } from "../../features/tax/tax.js";
import { getCookieData } from "../../Services/others";
import dayjs from "dayjs";
const subDirectory = import.meta.env.BASE_URL;

const items = [
  {
    name: "Home",
    link: `${subDirectory}landing-page/home`,
  },

  {
    name: "Tax",
    link: `${subDirectory}setting/tax-master`,
  },
];

const AdminTaxForm = ({ formType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const state = location?.state;
  const editstate = state?.editstate;

  const [messageType, setMessageType] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [AdminTaxData, setAdminTaxData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [EditData, setEditData] = useState([]);
  const [EditState, setEditState] = useState(false);
  const [searchedText, setSearchedText] = useState("");

  const onFinish = async (values) => {
    let postData = values;
    postData["CreatedBy"] = getCookieData("UserId") || 7;
    postData["EffectiveFrom"] = new Date(values.EffectiveFrom)
      .toISOString()
      .slice(0, 10);
    // dateTime.slice(0, 10);

    let response = {};
    // if (formType === "add") {
    response = await dispatch(postTax(postData)).unwrap();
    // }
    // else if (formType === "edit") {
    //   if (editstate) {
    //     postData["AppId"] = editstate.AppId;
    //     postData["PricingId"] = editstate?.PricingId;
    //     postData["TaxId"] = values.Tax;
    //   }
    //   postData["UpdatedBy"] = getCookieData("UserId") || 7;

    //   response = await dispatch(postTax(postData)).unwrap();
    // }

    if (response.data.statusCode == 1) {
      setMessageType("success");
      setMessageData(response.data.response);
      setDrawerOpen(false);
      fetchData();
    } else {
      setMessageType("error");
      setMessageData(response.data.response);
    }
  };

  async function fetchData() {
    const gettingAdminTax = await dispatch(getAdmin()).unwrap();
    if (gettingAdminTax.data.statusCode === 1) {
      await setAdminTaxData(gettingAdminTax.data.data);
    }
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  useEffect(() => {
    dispatch(changeBreadCrumb({ items: items }));
  }, []);

  const showDrawer = async () => {
    // const formRef = useRef(null);
    // formRef.resetFields();
    await formRef.current?.resetFields();
    setDrawerOpen(true);
    setEditData([]);
    //to clear all cache field value
    // formRef.resetFields();

    setEditState(false);
  };

  const onSearch = (value) => {
    setSearchedText(value);
  };
  const onSearchChange = (e) => {
    setSearchedText(e.target.value);
  };
  const onClose = () => {
    // formRef.current?.resetFields()
    setDrawerOpen(false);
    setEditState(false);
  };
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  //edit
  // const actionsFormatter = async (row,rowIndex) => {
  //   if (row.ActiveStatus !== "D") {
  //     navigate(`${subDirectory}feature-mapping/update`,
  //                   {state:{editstate: row}},
  //                   {key:rowIndex}
  //               )

  //   }

  // };
  //Delete
  const statusFormatter = async (row) => {
    let deleteData = {
      TaxId: row.TaxId,
      ActiveStatus: row.ActiveStatus == "A" ? "D" : "A",
      UpdatedBy: getCookieData("UserId") || 7,
    };
    let response = await dispatch(deleteTax(deleteData)).unwrap();
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
      title: "Tax Name",
      dataIndex: "TaxName",
      key: "TaxName",
      width: "200px",
      align: "center",
      render: (text) => (
        <a style={{ color: "black", width: "200px" }}>{text}</a>
      ),
      // filteredValue: filteredInfo.TaxName || null,
      filteredValue: [searchedText],
      // onFilter: (value, record) => record.TaxName.includes(value),
      // filteredValue: [searchedText],
      // filteredValue: filteredInfo.TaxName || null,
      onFilter: (value, record) => {
        return (
          String(record.TaxName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.TaxPercentage)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
      sorter: (a, b) => a.TaxName.length - b.TaxName.length,
      sortOrder: sortedInfo.columnKey === "TaxName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Tax Percentage",
      dataIndex: "TaxPercentage",
      key: "TaxPercentage",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.TaxPercentage || null,
      onFilter: (value, record) => record.TaxPercentage.includes(value),
      sorter: (a, b) => a.TaxPercentage.length - b.TaxPercentage.length,
      sortOrder:
        sortedInfo.columnKey === "TaxPercentage" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Effective From",
      dataIndex: "EffectiveFrom",
      key: "EffectiveFrom",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.EffectiveFrom || null,
      onFilter: (value, record) => record.EffectiveFrom.includes(value),
      sorter: (a, b) => a.EffectiveFrom.length - b.EffectiveFrom.length,
      sortOrder:
        sortedInfo.columnKey === "EffectiveFrom" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Reference No",
      dataIndex: "Reference",
      key: "Reference",
      width: "200px",
      align: "center",
      render: (text) => <a style={{ color: "black" }}>{text}</a>,
      filteredValue: filteredInfo.Reference || null,
      onFilter: (value, record) => record.Reference.includes(value),
      sorter: (a, b) => a.Reference.length - b.Reference.length,
      sortOrder: sortedInfo.columnKey === "Reference" ? sortedInfo.order : null,
      ellipsis: true,
    },

    // {
    //   title: "Action",
    //   key: "Action",
    //   dataIndex: "Action",
    //   width: "200px",
    //   align: "center",
    //   render: (_, record,index) =>
    //     AdminTaxData.length >= 1 ? (
    //       <Space size="middle">

    //        {record.ActiveStatus === "A" ? <a>
    //           <EditFilled
    //             onClick={() => actionsFormatter(record,index)}
    //           />
    //         </a> : "" }
    //         <a>
    //           {record.ActiveStatus === "A" ? <DeleteFilled
    //             style={{
    //               color:"#EF5350",
    //             }}
    //             onClick={() => statusFormatter(record)}
    //           /> : <ReloadOutlined
    //                   style={{
    //                     color:"Green",
    //                   }}
    //                   onClick={() => statusFormatter(record)}
    //                 />
    //             }

    //         </a>
    //       </Space>
    //     ) : null,
    // },

    // {
    //   title: "Active/Inactive",
    //   key: "Active/Inactive",

    //   render: (_, record) =>
    //     CommonDataFilter.length >= 1 ? (
    //       record.ActiveStatus === "A" ? (
    //         <h>Active</h>
    //       ) : (
    //         <h>Inactive</h>
    //       )
    //     ) : null,
    // },
  ];
  const data = AdminTaxData;

  const onComplete = useCallback(() => {
    setMessageData(null);
    setMessageType(null);
  }, []);

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
            <FormHeader title={"Tax"} />
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
              buttonText="Add New"
              color="901D77"
              icon={<PlusOutlined />}
              handleSubmit={showDrawer}
            >
              OPEN
            </Buttons>
          </div>
        </div>

        <div className="reportTable">
          <Tables
            columns={columns}
            data={AdminTaxData}
            onChange={handleChange}
          />{" "}
        </div>

        <Drawers
          open={drawerOpen}
          placement={placement}
          title="Add Tax"
          children={
            <div className="formDiv">
              <Form className="formDivAnt" ref={formRef} onFinish={onFinish}>
                <div className="formDivS">
                  <div className="inputForm">
                    <Form.Item
                      name="TaxName"
                      
                      rules={[
                        {
                          required: true,
                          pattern: /^(?!\s*$).+/,
                          message: "Please Enter Tax Name",
                        },
                      ]}
                    >
                      <InputField
                        field="TaxName"
                        label="Tax Name"
                        fieldState={true}
                        maxLength="30"
                        autoComplete="off"
                        className="Input"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>

                    <Form.Item
                      name="TaxPercentage"
                      
                      rules={[
                        // {
                        //   required: true,
                        // },
                        {
                          validator: (_, value) => {
                            if (value <= 100 && value > 0) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(
                                "Please Enter Valid Percentage"
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <InputField
                        field="TaxPercentage"
                        name="test"
                        type="number"
                        autoComplete="off"
                        min={1}
                        max={100}
                        label="Tax Percentage"
                        fieldState={true}
                        fieldApi={true}
                        id="error2"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>

                    <Form.Item
                      name="EffectiveFrom"
                      // hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Effective From",
                        },
                      ]}
                    >
                      <DatePic
                        field="EffectiveFrom"
                        name="EffectiveFrom"
                        type="number"
                        min={1}
                        max={100}
                        label="EffectiveFrom"
                        fieldState={true}
                        fieldApi={true}
                        EditData={EditData}
                        EditState={EditState}
                        id="error3"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>

                    <Form.Item
                      name="Reference"
                      
                      rules={[
                        {
                          
                          pattern: /^(?!\s*$).+/,
                          message: "Please Enter Reference",
                        },
                      ]}
                    >
                      <InputField
                        field="Reference"
                        name="test"
                        label="Reference No"
                        fieldState={true}
                        autoComplete="off"
                        fieldApi={true}
                        id="error4"
                        isOnChange={EditState ? true : false}
                      />
                    </Form.Item>
                  </div>
                </div>

                <dir className="submitButton">
                  <Buttons
                    buttonText="SUBMIT"
                    icon={<ArrowRightOutlined />}
                    // handleSubmit={handleSubmit}
                  />
                </dir>
              </Form>
            </div>
          }
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AdminTaxForm;
