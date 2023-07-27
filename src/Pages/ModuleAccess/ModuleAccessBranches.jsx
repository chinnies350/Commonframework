import { useSelector,useDispatch } from "react-redux";
import { useEffect,useState } from "react";
import "./ModuleAccessBranches.scss";
import { Checkbox} from "antd";
import {
  
  gettingBranchListSelector,
  gettingBranchAccess,
  gettingPostDataValue,
  changePostData,
  removePostDataValue
} from "../../features/ModuleAccess/moduleAccessSlice";


const CompanyBranch = () => {

    const dispatch = useDispatch();
    const BranchList=useSelector(gettingBranchListSelector);
    const BranchAccess = useSelector(gettingBranchAccess);
    const PostDataValues = useSelector(gettingPostDataValue);

    
    const [checkedList, setCheckedList] = useState({});

    console.log(BranchAccess, "BranchAccessBranchAccess");


    useEffect(() => {
      try {
  
        async function selectedBranch() {
          let BranchAccessVal={}
          let branchPost = []
          {Object.keys(BranchAccess)?.map((a) =>{
            
            BranchAccessVal[a]=BranchAccess[a].map(obj => {
              console.log("PostDataValuesPostDataValues",PostDataValues)
              branchPost.push({"BranchId":obj.BranchId,"CompId":obj.CompId,"AppId":obj.AppId })
              // dispatch(changePostData([...PostDataValues,{"BranchId":obj.BranchId,"CompId":obj.CompId,"AppId":obj.AppId }]))
              return obj.BranchId
            })
            
            
          } )}
          dispatch(changePostData([...branchPost]))
           
          console.log("BranchAccessVal",BranchAccessVal)
          setCheckedList(BranchAccessVal)
        }
    
        selectedBranch()
      } catch (err) {
        console.log("err", err);
      }
    }, [BranchAccess]);

    



    const onChange = async (e,a) => {
      let newObj = {
        [a]: e
      }
      setCheckedList({...checkedList, ...newObj})
  };
    const checkedBoxChangeFun =async(e,BranchId,CompId,AppId,CompName)=>{
      if (e.target.checked) {
        dispatch(changePostData([...PostDataValues,{BranchId,CompId,AppId }]))
        
      }else{
        dispatch(removePostDataValue({ CompId: CompId,BranchId:BranchId }));
      }
      console.log(BranchList, "BranchList123");
    }
    

  return (
    <div className="userAccessDiv">
      <div className="userAccess">
        <div className="userAccessHeader selectDrpHeading"> Branches </div>

        <div className="userAccessBody ">
          <div className="BranchCardListDiv">
            
          {Object.keys(BranchList).length === 0 && <>
                  <p style={{color:"gray"}}> No Branches Found </p>
              </>}
            {Object.keys(BranchList)?.map((a) => (
              <div className="BranchCardList">
                <p> {a}</p>
                {console.log("checkedList123645",checkedList)}
                <Checkbox.Group 
                      value={checkedList[a]}
                      onChange={(e) => onChange(e,a)}
                      >
                    {BranchList[a]?.map((c) =>
                            
                          <Checkbox
                            className="BranchCard"
                            key={c?.BrId}
                            value={c?.BrId}
                            onChange={(e) =>
                              checkedBoxChangeFun(e, c?.BrId,c?.CompId, c?.AppId,c?.CompName)
                            }
                          >
                            {c?.BrName}
                          </Checkbox>
                      )
                    }
                </Checkbox.Group>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranch;
