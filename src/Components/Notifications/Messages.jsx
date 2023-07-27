import { message} from 'antd';
import { useEffect } from 'react';

export const Messages = ({messageType, messageData, duration,onComplete}) => {
  console.log("messageType",messageType)
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (messageType)
      messageApi.open({
        type: messageType,
        content: messageData,
        duration: duration ? duration : 2
      }).then(()=> {
        if (onComplete) {
          onComplete()
        }
      })

  }, [messageType])

 
  return (
    <>
      {contextHolder}
    
    </>
  );
};