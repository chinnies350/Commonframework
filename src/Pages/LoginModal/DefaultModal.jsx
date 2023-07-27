import { Button, Modal } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons'; 
import {ArrowRightOutlined,CloseOutlined } from '@ant-design/icons';  
import  './SigninModal.scss'

const DefaultModal = ({open,title,handleCancel,children,footer,handleSubmit}) => {
  return (
    <>
      <Modal 
        open={open} 
        width={4000}
        top={0} 
        className='signinModal'
        closeIcon={<CloseOutlined onClick={handleCancel}/>}
        footer={footer ? [
             
            
          ]: footer}
  
      >
        {children} 

      </Modal>
    </>
  );
};


export default DefaultModal;