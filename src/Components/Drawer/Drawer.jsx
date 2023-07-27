import { Button, Drawer, Radio, Space } from 'antd';
import { useState } from 'react';
export const Drawers = ({open,placement,title,children,onClose}) => {


  return (
    <>
     
      <Drawer
        title={title}
        placement={placement}
        // closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        {children}
      </Drawer>
    </>
  );
};
