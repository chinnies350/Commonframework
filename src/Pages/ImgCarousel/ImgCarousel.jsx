import { Carousel } from 'antd';
import img1 from "../../Images/img1.png";
import img2 from "../../Images/img2.png";
import img3 from "../../Images/img3.png";
import img4 from "../../Images/img4.png";
const contentStyle = {
  height: '400px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
//   background: '#364d79',
};
const App = () => (
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}> <img  src={img1} alt="BusinessImg" /> </h3>
    </div>
    <div>
      <h3 style={contentStyle}> <img  src={img2} alt="BusinessImg" /> </h3>
    </div>
    <div>
      <h3 style={contentStyle}> <img  src={img4} alt="BusinessImg" /> </h3>
    </div>
    <div>
      <h3 style={contentStyle}> <img  src={img3} alt="BusinessImg" /></h3>
    </div>
  </Carousel>
);
export default App;