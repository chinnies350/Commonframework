import { Input } from "antd";
import "./main.scss";
import SearchOutlined from '@ant-design/icons';


export const Search = ({placeholder,onSearch,onSearchChange}) => (
    
    <Input.Search
    
        className="searchDiv"
        placeholder={placeholder }
        onSearch ={onSearch}
        onChange={onSearchChange}
        
       
    />
   
  
);
export default Search;

