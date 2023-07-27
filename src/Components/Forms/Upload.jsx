import { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { uploadImage } from '../../features/upload/upload';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const App = ({singleImage,updateImageUrl,ImageLink}) => {
  console.log("ImageLink",ImageLink !="")
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (ImageLink !="" && ImageLink !=null ) { 
      setFileList([{url:ImageLink}]) 
    } else {
      setFileList([])
    }
    
  }, [ImageLink])


 
  
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > 0){
      let data=await dispatch(uploadImage(newFileList[0].originFileObj)).unwrap()
      if (data.data.status){
        updateImageUrl(data.data.image);
        setFileList([{url:data?.data?.image}])
      }
     }else{
      updateImageUrl("");
      setFileList(newFileList)
    }
    // setFileList(newFileList)
  };

  const uploadButton = (

    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
    {console.log("fileList",fileList,typeof(fileList),fileList.length,ImageLink !="")}
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        
        
       
      >
        {(singleImage && fileList.length==0) ? uploadButton :(!singleImage && fileList.length <= 8) ? uploadButton : null}
        {/* {fileList.length >= 8 ? null : uploadButton} */}
      </Upload>
      <Modal open={previewOpen} title={''} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default App;