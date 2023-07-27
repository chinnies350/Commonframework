import { PhoneOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Popover, Space } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../Images/payprelogo.svg";
import { SmileOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import "./HomeNav.scss";
import DefaultModal from "../LoginModal/DefaultModal";
import Loginform from "../publicsignin/Signin";
import NavBarCom from "../NavBarComps/NavBarCom";
import { Link, useNavigate } from "react-router-dom";
const subDirectory = import.meta.env.BASE_URL;

const content = (
  <div>
    <NavBarCom />
  </div>
);

const items = [
  {
    label: "Contact Sales",
    key: "SubMenu",
    icon: <PhoneOutlined />,
    children: [
      {
        type: "group",
        label: "Item 1",
        children: [
          {
            label: "Option 1",
            key: "setting:1",
          },
          {
            label: "Option 2",
            key: "setting:2",
          },
        ],
      },
      {
        type: "group",
        label: "Item 2",
        children: [
          {
            label: "Option 3",
            key: "setting:3",
          },
          {
            label: "Option 4",
            key: "setting:4",
          },
        ],
      },
    ],
  },

  {
    disabled: false,
    label: (
      <Link to={`/public-signin`}>
        <a fontSize="18px" style={{ verticalAlign: "middle" }} />
        Sign In
      </Link>
    ),
  },

  {
    label: (
      <Button
        style={{
          backgroundColor: "black",
          width: "140px",
          height: "auto",
          fontSize: "16px",
          justifyContent: "center",
        }}
        type="primary"
      >
        <Link to={`/public-signin`}>
          <a fontSize="18px" style={{ verticalAlign: "middle" }} />
          Free Account
        </Link>
      </Button>
    ),
    key: "alipay",
  },
];

const dropitems = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const HomeNav = () => {
  const [current, setCurrent] = useState("mail");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const openSignInModal = () => {
    navigate(`${subDirectory}public-signin/`);
  };

  const handleCancel = () => {
    alert("i am called");
    setOpen(false);
  };
  return (
    <div className="nav">
      <div className="logoNav">
        <img
          src={Logo}
          className="logo"
          alt="logo url"
          width="50px"
          left="6rem"
        />
      </div>
      <div className="navItems">
        <div onClick={openSignInModal}>
          {" "}
          Sign in
          <DefaultModal
            open={open}
            title="Sign In"
            footer={true}
            children={<Loginform />}
            handleCancel={handleCancel}
          />
        </div>

        <div className="navdropdowns">
          <div>
            <Dropdown
              menu={{
                items: dropitems,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space style={{ verticalAlign: "middle" }}>Retail</Space>
              </a>
            </Dropdown>
          </div>

          <div>
            <Dropdown
              menu={{
                items: dropitems,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space style={{ verticalAlign: "middle" }}>Restaurant</Space>
              </a>
            </Dropdown>
          </div>

          <Popover content={content} trigger="hover">
            <Button>Hover me</Button>
          </Popover>

          <Popover content={content} trigger="hover">
            <Button>Hover me</Button>
          </Popover>

          <div>
            <Dropdown
              menu={{
                items: dropitems,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space style={{ verticalAlign: "middle" }}>Distribution</Space>
              </a>
            </Dropdown>
          </div>
        </div>

        <div>
          <Link style={{ color: "black" }}>
            <a fontSize="18px" style={{ verticalAlign: "middle" }} />
            Contact Sales
          </Link>
        </div>

        <div className="acc_Btn">
          <Button
            style={{
              backgroundColor: "#000",
              width: "140px",
              height: "auto",
              fontSize: "16px",
              justifyContent: "center",
            }}
            type="primary"
          >
            <Link to={`/UserProfile`}>
              <a fontSize="18px" style={{ verticalAlign: "middle" }} />
              Free Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeNav;
