import { Layout, Menu, theme } from 'antd';
import React from 'react';
const { Header, Content, Footer, Sider } = Layout;


// import {
//     HomeOutlined,
//     AppstoreAddOutlined,
//     ShoppingCartOutlined,
//     ScheduleOutlined,
//     SettingOutlined,
    
//   } from '@ant-design/icons';
  
  // const items = [
  //   {key:HomeOutlined,value:"Home"},
  //   {key:AppstoreAddOutlined,value:"Booking"},
  //   {key:ShoppingCartOutlined,value:"Stock"},
  //   {key:ScheduleOutlined,value:"Order"},
  //   {key:ScheduleOutlined,value:"Reports"},
  //   {key:SettingOutlined,value:"Settings"},
  // ].map((icon, index) => ({
  //   key: String(index + 1),
  //   icon: React.createElement(icon["key"]),
  //   label: icon["value"],
  // }));
  
  
export const SideMenu = ({items}) => {
    items.map((icon, index) => ({

        key: String(index + 1),
        icon: React.createElement(
          "img",
          {src: icon["menuicon"], height: "200px",  width: "300px"},
          null
        ),
        // icon: React.createElement(icon["MenuItem"]),
        label: icon["menuname"],
      }));
    const {
      token: { colorBgContainer },
    } = theme.useToken();
    return (
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor:'#dbe8f5'
          }}
        >
          <div
            
            style={{
              height: 32,
              margin: 16,
            //   background: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <Menu theme="white" style={{color:'black'}} mode="inline" defaultSelectedKeys={['4']} items={items} />
        </Sider>
        
        {/* <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
          <Content
            style={{
              margin: '24px 16px 0',
              overflow: 'initial',
            }}
          >
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                background: colorBgContainer,
              }}
            >
              <p>long content</p>
              {
                // indicates very long content
                Array.from(
                  {
                    length: 100,
                  },
                  (_, index) => (
                    <React.Fragment key={index}>
                      {index % 20 === 0 && index ? 'more' : '...'}
                      <br />
                    </React.Fragment>
                  ),
                )
              }
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout> */}
      </Layout>
    );
  };
