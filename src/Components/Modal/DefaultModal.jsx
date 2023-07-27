import { Button, Modal } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import Buttons from '../Forms/Buttons'
import {ArrowRightOutlined,CloseOutlined } from '@ant-design/icons';
export const DefaultModal = ({open,title,handleCancel,children,footer,handleSubmit}) => {
  return (
    <>
      <Modal 
        open={open}
        title={title}
        top={0}
        centered
        closeIcon={<CloseOutlined onClick={handleCancel}/>}
        footer={footer ? [
            <Buttons buttonText="SUBMIT"
              color='901D77'  
              icon={<ArrowRightOutlined />}
              handleSubmit={handleSubmit}
              >
            </Buttons>,
            
          ]: footer}
 
       
      >
        {children} 

      </Modal>
    </>
  );
};
