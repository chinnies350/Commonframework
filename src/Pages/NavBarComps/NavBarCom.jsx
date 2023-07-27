import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./NavBarCom.scss";
import { Col, Row } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getSubCategoryData,
  getApplicationData,
} from "../../features/publicHome/publicHome";
import "../../fonts/Gilroy/stylesheet.css";

import { storeCookieData } from "../../Services/others";

const subDirectory = import.meta.env.ENV_BASE_URL;

const NavBarCom = (e) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [SubCategory, setSubCategory] = useState([]);
  const [AppCategory, setAppCategory] = useState([]);

  useEffect(() => {
    getSubCategory(e?.CateId);
  }, [e?.CateId]);

  const getSubCategory = async (cateId) => {
    setAppCategory([]);
    const response = await dispatch(getSubCategoryData(cateId)).unwrap();
    if (response.data.statusCode === 1) {
      let finalsubCategory = response.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setSubCategory(finalsubCategory);
      getAppData(response.data.data[0]?.SubCateId);
    }
    navigate;
  };

  const getAppData = async (subcatId) => {
    const response = await dispatch(getApplicationData(subcatId)).unwrap();

    if (response.data.statusCode === 1) {
      let finalsubCategory = response.data.data.filter(
        (value) => value.ActiveStatus === "A"
      );
      setAppCategory(finalsubCategory);
    }
  };

  const redirectApp = async (AppName,AppId) => {
    storeCookieData("AppId",AppId)
    navigate(`/${AppName}/`)
    window.location.reload()
  };

  return (
    <>
      <div className="nav_drp_Itms">
        <Row>
          <Col span={5}>
            <div className="Left_Items">
              {SubCategory?.map((a, b) => (
                <button
                  className="Left_List"
                  key={a.SubCateId}
                  onClick={() => getAppData(a?.SubCateId)}
                >
                  {a?.SubCategoryName} &nbsp;
                  <p>
                    <ArrowRightOutlined class="Arrow" />
                  </p>
                </button>
              ))}
            </div>
          </Col>

          <Col span={8}>
            <div className="Right_Items">
              <Row>
                {AppCategory?.map((category) => (
                  <Col key={category?.SubId}>
                    <div
                      className="Nav_right_items"
                      // onClick={() =>
                      //   {navigate(`/${category?.AppName?.toLowerCase()}/`)
                      //   window.location.reload()
                      // }
                      onClick={() =>redirectApp(category?.AppName?.toLowerCase(),category?.AppId)
                      }
                    >
                      <img
                        src={category?.AppLogo!="" && category?.AppLogo != null?category?.AppLogo:"http://saveme.live/paypre-image-api/upload?fileId=64b536df06bfb6b6b9922bbc.webp"}
                        alt={category?.AppName}
                        style={{ maxWidth: "60px" }}
                      />

                      <div className="Right_Items_text">
                        <p>{category?.AppName}</p>
                        <p className="app_des">{category?.AppDescription}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default NavBarCom;
