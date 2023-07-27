import { CaretRightOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Collapse, theme } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ApplicationsSelector,
  getApplication,
  getApplicationCategory,
  ApplicationCategorySelector,
  getApplicationSubCategory,
  ApplicationSubCategorySelector,
} from "../../../features/applications/bannerImage";
const { Panel } = Collapse;
const subDirectory = import.meta.env.ENV_BASE_URL;

const Collapses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applications = useSelector(ApplicationsSelector);
  const applicationCategory = useSelector(ApplicationCategorySelector);
  const applicationSubCategory = useSelector(ApplicationSubCategorySelector);

  useEffect(() => {
    dispatch(getApplication());
  }, []);

  useEffect(() => {
    getcateId();
  }, [applications]);

  useEffect(() => {
    getdata();
  }, [applicationCategory]);

  const getcateId = async () => {
    dispatch(getApplicationCategory());
  };

  const getdata = async () => {
    dispatch(getApplicationSubCategory());
  };

  const getAppCatDeatils = async (e) => {
    dispatch(getApplicationCategory(e));
  };

  const getAppDeatils = async (e) => {
    dispatch(getApplicationSubCategory(e));
  };

  const { token } = theme.useToken();
  const onChange = (key) => {
    console.log(key);
  };
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const openSignupModal = () => {
    navigate(`${subDirectory}public-signin/`);
  };

  return (
    <Collapse
      onChange={onChange}
      bordered={false}
      defaultActiveKey={["1"]}
      expandIconPosition="left"
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{
        background: token.colorBgContainer,
      }}
      size="large"
    >
      {applications.data &&
        applications.data.map((application) => (
          <Panel
            header={application.CategoryName}
            key={application.CateId}
            style={{ ...panelStyle, boxShadow: "none" }}
            onClick={() => getAppCatDeatils(application.CateId)}
          >
            <Collapse
              defaultActiveKey="1"
              bordered={false}
              collapsedHeight="auto"
            >
              {applicationCategory.data &&
                applicationCategory.data.map((subcategory) => (
                  <Panel
                    header={subcategory.SubCategoryName}
                    key={subcategory.SubCateId}
                    style={{ ...panelStyle, width: "87%" }}
                    onClick={() => getAppDeatils(subcategory.SubCateId)}
                  >
                    {applicationSubCategory.data &&
                      applicationSubCategory.data.map((appCategory) => (
                        <Panel
                          header={appCategory.AppName}
                          key={appCategory.SubId}
                          style={{ ...panelStyle, width: "87%" }}
                          onClick={()=>{navigate(
                            `/${appCategory?.AppName}/`
                          )
                          window.location.reload()
                        }}
                        >
                          <p>{appCategory.AppName}</p>
                          {/* Additional content */}
                        </Panel>
                      ))}
                  </Panel>
                ))}
            </Collapse>
          </Panel>
        ))}

      <div className="Dept_side">
        <p> Contact Sales </p>
        <p onClick={openSignupModal}> Sign In </p>
        <div className="Acc_btn" type="primary">
          {" "}
          Free Account{" "}
        </div>
      </div>
    </Collapse>
  );
};
export default Collapses;
