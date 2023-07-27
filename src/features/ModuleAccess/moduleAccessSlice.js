import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import config from '../../config.json';
const config = import.meta.env.ENV_API_URL;
// "https://saveme.live/paypre-store/paypre-api"
// import.meta.env.ENV_API_URL;
import { getCookieData } from "../../Services/others";

const initialState = {
  selectedRole: getCookieData("UserType")==='Admin'?"Company Admin":"Sadmin",
  selectedStore: null,
  selectedBranch: null,
  selectedApp: null,
  selectedUser: null,
  allModules: [],
  branchData: [],
  appData: [],
  userData: [],
  AdminData: [],
  selectedUserData: {},
  selectedModuleBranch: [],
  UserId: null,
  AppAccess:{},
  CompAccess:{},
  BranchAccess:{},
  AppListData:{},
  CmpListData:{},
  BranchListData:{},
  PostDataValue:[],
};

export const getBranchDropModule = createAsyncThunk(
  "moduleAccess/getBranchDropModule",
  async ({ storeId }) => {
    return await axios.get(`${config}/branch?CompId=${storeId}`);
  }
);

export const getSadminUser = createAsyncThunk(
  "moduleAccess/getSadminUser",
  async () => {
    return await axios.get(`${config}/login?Type=Super Admin User`);
  }
);

export const getStoreAdmin = createAsyncThunk(
  "moduleAccess/getStoreAdmin",
  async ({ storeId }) => {
    return await axios.get(`${config}/company?UserId=${storeId}`);
  }
);

export const gettingAdminDropDown = createAsyncThunk(
  "moduleAccess/gettingAdminDropDown",
  async () => {
    return await axios.get(`${config}/user?UserType=A`);
  }
);

export const getBranchAdmin = createAsyncThunk(
  "moduleAccess/getBranchUser",
  async ({ BranchId }) => {
    return await axios.get(`${config}/login?BranchId=${BranchId}&Type=E`);
  }
);

export const getAllModule = createAsyncThunk(
  "moduleAccess/getAllModule",
  async () => {
    return await axios.get(`${config}/configMaster?TypeName=subCategory`);
    // return await axios.get(`${config}/getModuleMaster`)
  }
);

export const getAllModuleActive = createAsyncThunk(
  "moduleAccess/getAllModule",
  async (AdminId) => {
    if (AdminId) {
      return await axios.get(`${config}/userAppMap?UserId=${AdminId}&Type=A`);
    } else {
      return await axios.get(
        `${config}/configMaster?ActiveStatus=A&TypeName=subCategory`
      );
    }
    // return await axios.get(`${config}/getModuleMaster?ActiveStatus=A`)
  }
);

export const getUserData = createAsyncThunk(
  "moduleAccess/getUserData",
  async ({ userId,BranchId }) => {
    console.log("getting userData Values",userId,BranchId)
    if(userId && BranchId){
      return await axios.get(`${config}/login?UserId=${userId}&BranchId=${BranchId}`)
    }else{
      return await axios.get(`${config}/login?UserId=${userId}`);}
  }
);


export const getAppDetails = createAsyncThunk(
  "moduleAccess/getAppDetails",
  async ({ UserId }) => {
    return await axios.get(`${config}/appAccess?UserId=${UserId}&Type=AD`);
  }
);

export const getCompDetails = createAsyncThunk(
  "moduleAccess/getCompDetails",
  async ({ UserId }) => {
    return await axios.get(`${config}/appAccess?UserId=${UserId}`);
  }
);

export const getUserAppDetails = createAsyncThunk(
  "moduleAccess/getUserAppDetails",
  async ({ UserId,AppId }) => {
    console.log("fetchUserAppStoreData123456",UserId,AppId)
    return await axios.get(`${config}/appAccess?UserId=${UserId}&AppId=${AppId}&ActiveStatus=A`);
  }
);

export const getUserAppStoreDetails = createAsyncThunk(
  "moduleAccess/getUserAppStoreDetails",
  async ({ StoreId,UserId,AppId }) => {
    return await axios.get(`${config}/appAccess?UserId=${UserId}&AppId=${AppId}&CompId=${StoreId}`);
  }
);

export const getCmpDetails = createAsyncThunk(
  "moduleAccess/getCmpDetails",
  async ({ AppId,UserId }) => {
    if(AppId && UserId){
      return await axios.get(`${config}/appAccess?AppId=${AppId}&UserId=${UserId}&ActiveStatus=A`);
    }
    else if(AppId){
      return await axios.get(`${config}/appAccess?AppId=${AppId}`);
    }
    
  }
);

export const getBranchDetails = createAsyncThunk(
  "moduleAccess/getBranchDetails",
  async ({ CompId,AppId ,UserId}) => {
    if(AppId && UserId && CompId){
      return await axios.get(`${config}/appAccess?CompId=${CompId}&AppId=${AppId}&UserId=${UserId}`);
    }else if(AppId && CompId){
      return await axios.get(`${config}/appAccess?CompId=${CompId}&AppId=${AppId}`);
    }
  }
);



export const getBranchBasedOnStoreAndType = createAsyncThunk(
  "moduleAccess/getBranchBasedOnStoreAndType",
  async ({ storeId, BranchType,UserId }) => {
    if (UserId) {
    return await axios.get(`${config}/application?SubId=${BranchType}&UserId=${UserId}`);
    }
    else{
    return await axios.get(`${config}/application?SubId=${BranchType}`);

    }
  }
);

export const getBranchBasedOnStoreAndTypeSadmin = createAsyncThunk(
  "moduleAccess/getBranchBasedOnStoreAndType",
  async ({ BranchType, UserId ,Type,BranchId}) => {
    console.log(UserId,BranchType,Type,"testinguser")
    if (UserId && BranchType && Type) {
      console.log("testinguser123")
      return await axios.get(
        `${config}/application?SubId=${BranchType}&UserId=${UserId}&Type=${Type}`
      );
    } 
    else if (UserId && BranchType & BranchId) {
      console.log("testinguser1234")
      return await axios.get(
        `${config}/application?SubId=${BranchType}&UserId=${UserId}&BranchId=${BranchId}`
      );
    } 
    else if (UserId && BranchType) {
      console.log("testinguser1234")
      return await axios.get(
        `${config}/application?SubId=${BranchType}&UserId=${UserId}`
      );
    } 
    else {
      console.log("testinguser1235")
      return await axios.get(`${config}/application?SubId=${BranchType}`);
    }
  }
);

export const postModuleRights = createAsyncThunk(
  "moduleAccess/postModuleRights",
  async (postData) => {
    return await axios.post(`${config}/appAccess`, postData);
  }
);
export const postBranchModuleRights = createAsyncThunk(
  "moduleAccess/postBranchModuleRights",
  async (postData) => {
    return await axios.post(`${config}/appAccessBranch`, postData);
  }
);
export const deleteModuleRights = createAsyncThunk('moduleAccess/deleteModuleRights', async (deleteData) => {
  return await axios.delete(`${config}/appAccess`, { params: deleteData })
})
export const deleteBranchModuleRights = createAsyncThunk('moduleAccess/deleteBranchModuleRights', async (deleteData) => {
  return await axios.delete(`${config}/appAccessBranch`, { params: deleteData })
})

export const getstoreData = createAsyncThunk(
  "moduleAccess/getstoreData",
  async (storeId) => {
    console.log(storeId, "StoreIdsssss");
    return await axios.get(`${config}/company?UserId=${storeId}`);
    // return await axios.get(`${config}/getModuleMaster`)
  }
);



// export const

const moduleAccess = createSlice({
  name: "moduleAccess",
  initialState,
  reducers: {
    changeRole: (state, action) => {
      const { id } = action.payload;
      state.selectedRole = id;
      state.UserId= null;
      state.selectedUser = null;
      state.AppListData = {};
      state.CmpListData = {};
      state.BranchListData = {};
    },
    changeIntialRole:(state, action) =>{
      state.selectedRole = getCookieData("UserType")==='Admin'?"Company Admin":"Sadmin";
    },
    AddAppList:(state, action) => {
      const { AppList } = action.payload;
      // console.log(AppList,"appListData2")
   
      

      
      // let AppListJoin = {...state.AppListData,"test":AppList}
      // console.log(AppListJoin,"appListData")
      
      state.AppListData =  AppList;
    },
    
    changeUserId: (state, action) => {
      state.UserId = action.payload;
    },

    changeAppAccess: (state, action) => {
      state.AppAccess = action.payload;
    },

    changePostData: (state, action) =>{
      console.log("PostDataValues1234",action.payload)
      state.PostDataValue = action.payload;
    },

    changeCompAccess: (state, action) => {
      state.CompAccess = action.payload;
    },
    changeBranchAccess: (state, action) => {
      state.BranchAccess = action.payload;
    },

    changeStore: (state, action) => {
      const { storeId } = action.payload;
      state.selectedStore = storeId;
    },
    
    changeBranch: (state, action) => {
      const { BranchId } = action.payload;
      state.selectedBranch = BranchId;
    },
    changeApp: (state, action) => {
      const { AppId } = action.payload;
      state.selectedApp = AppId;
    },
    changeUser: (state, action) => {
      const { userId } = action.payload;

      state.selectedUser = userId;
    },
    emptyUserData: (state, action) => {
      state.userData = [];
    },
    emptyDataList: (state, action) => {
      state.AppListData = {};
      state.CmpListData = {};
      state.BranchListData = {};
    },
    emptySelectedModuleBranch: (state, action) => {
      state.AppListData = {};
      state.CmpListData = {};
      state.BranchListData = {};
      state.allModules=[];
      state.selectedModuleBranch=[];

    },
    emptyModuleBranch: (state, action) => {
      state.AppListData = {};
      state.CmpListData = {};
      state.BranchListData = {};
      // state.allModules=[];
      state.selectedModuleBranch=[];

    },
    emptyPostData:(state,action) =>{
      state.selectedUser = null;
      state.selectedApp = null;
      state.selectedBranch = null;
      state.selectedStore = null;
      state.UserId = null;
      state.userData = [];
      state.selectedUserData = {};
      state.selectedModuleBranch = [];
      state.AppListData = {};
      state.CmpListData = {}
      state.BranchListData = {}
      state.appData = [];
      state.branchData = [];
      state.AppAccess ={};
      state.CompAccess = {};
      state.BranchAccess = {};
      state.PostDataValue=[];
      
    },
    emptySelectedIds: (state, action) => {
      state.selectedApp = null;
      state.selectedBranch = null;
      state.selectedStore = null;
      state.selectedUser = null;
      state.UserId= null;
    },
    getSelectedBranch: (state, action) => {
      state.selectedModuleBranch = state.selectedUserData[0]?.ModuleDetails;
    },
    updateModuleAccessByModuleTypeId: (state, action) => {
      const { AppId } = action.payload;
      console.log("ModuleTypeId", action.payload, state);
      console.log(
        state.selectedModuleBranch.filter(
          (eachData) => parseInt(eachData.AppId) != parseInt(AppId)
        ),
        "filter"
      );
      state.selectedModuleBranch = state.selectedModuleBranch.filter(
        (eachData) => parseInt(eachData.AppId) != parseInt(AppId)
      );
    },
    addModuleAccess: (state, action) => {
      console.log(action.payload, "action.payload");
      state.selectedModuleBranch.push(action.payload);
    },
    updateModuleAccessByBranchId: (state, action) => {
      const { BranchId } = action.payload;
      console.log(action.payload, "action.payload");
      state.selectedModuleBranch = state.selectedModuleBranch.filter(
        (eachData) => eachData.AppId != BranchId
      );
    },
    removeAppList: (state, action) => {
      const {subCat} = action.payload;
      console.log("subCatsubCat",state.AppListData[subCat])
       state.AppListData[subCat]?.map((eachApp)=> {

        state.CmpListData[eachApp.AppName]?.map((eachCompany) => {
          delete state.BranchListData[`${eachApp?.AppName}-${eachCompany?.CompName}`]
        })
        delete state.CmpListData[eachApp.AppName]
      })
      delete state.AppListData[subCat]
      
      


    },
    removeCmpList:(state, action) => {
      const {AppName} = action.payload;
      console.log("CmpListDataCmpListDataCmpListData",state.CmpListData)
      state.CmpListData[AppName]?.map((eachComp)=>{
        delete state.BranchListData[`${AppName}-${eachComp?.CompName}`]
      })
      delete state.CmpListData[AppName]
    },
    removeBranchList:(state, action) => {
      const {CompName} = action.payload;
      console.log("CompName",CompName)
      console.log("BranchListDataBranchListData",state.BranchListData[CompName])
      delete state.BranchListData[CompName]
    },
    removeBranchAccess: (state,action)=>{
      const {branchAccessData} = action.payload;
      delete state.BranchAccess[branchAccessData]
      // console.log("branchAccessData",branchAccessData)
    },
    removeCompanyAccess: (state,action)=>{
      const {companyAccessData} = action.payload;
      delete state.CompAccess[companyAccessData]
      // console.log("companyAccessData",companyAccessData)
    },
    removeAppAccess: (state,action)=>{
      const {appAccessData} = action.payload;
      delete state.AppAccess[appAccessData]
      // console.log("appAccessData",appAccessData)
    },

    removePostDataValue:(state,action) =>{
      const postDatas = action.payload;
      console.log("postDatas",postDatas)
      console.log("postDatas1234",state.PostDataValue)
      if(postDatas.CompId && postDatas.AppId){
        state.PostDataValue.map((deleteData,index)=>{
          console.log("postDatas123",deleteData?.AppId==postDatas.AppId && deleteData?.CompId==postDatas.CompId,index)
          if(deleteData?.AppId==postDatas.AppId && deleteData?.CompId==postDatas.CompId){
              delete state.PostDataValue[index]
          }
        })
        
      }
      
      else if (postDatas.AppId){
        state.PostDataValue.map((deleteData,index)=>{
          if(deleteData?.AppId==postDatas.AppId){
              delete state.PostDataValue[index]
          }
        })
      }
      else if(postDatas.CompId && postDatas.BranchId){
        state.PostDataValue.map((deleteData,index)=>{
          if(deleteData?.BranchId==postDatas.BranchId && deleteData?.CompId==postDatas.CompId){
              delete state.PostDataValue[index]
          }
        })
        
      }
    }
    // gettingAdmin : (state, action) => {
    //     state.AdminData = state.AdminData.filter((eachData) => eachData.ActiveStatus=='A')
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(getBranchDropModule.fulfilled, (state, action) => {
      if (action.payload.data.statusCode === 1) {
        state.branchData = action.payload.data.data;
      } else {
        state.branchData = [];
      }
    });

    builder.addCase(getAppDetails.fulfilled, (state, action) => {
      if (action.payload.data.statusCode === 1) {
        state.appData = action.payload.data.data;
      } else {
        state.appData = [];
      }
    });

    builder.addCase(gettingAdminDropDown.fulfilled, (state, action) => {
      if (action.payload.data.statusCode === 1) {
        state.AdminData = action.payload.data.data;
      } else {
        state.AdminData = [];
      }
    });

    builder.addCase(getSadminUser.fulfilled, (state, action) => {
      if (action.payload.data.statusCode === 1) {
        state.userData = action.payload.data.data;
      } else {
        state.userData = [];
      }
      // console.log('sadmin user', action.payload);
    });
    builder.addCase(getAllModuleActive.fulfilled, (state, action) => {
      console.log("module type", action.payload);
      if (action.payload.data.statusCode === 1) {
        state.allModules = action.payload.data.data;
      } else {
        state.allModules = [];
      }
    });
    builder.addCase(getStoreAdmin.fulfilled, (state, action) => {
      console.log("Company admin user", action.payload);
      if (action.payload.data.statusCode === 1) {
        state.userData = action.payload.data.data;
      } else {
        state.userData = [];
      }
    });
    builder.addCase(getBranchAdmin.fulfilled, (state, action) => {
      console.log("branch admin user", action.payload);
      if (action.payload.data.statusCode === 1) {
        state.userData = action.payload.data.data;
      } else {
        state.userData = [];
      }
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      console.log("user data", action.payload);
      if (action.payload.data.statusCode === 1) {
        state.selectedUserData = action.payload.data.data;
        state.selectedModuleBranch = action.payload.data.data[0]?.ModuleDetails
          ? action.payload.data.data[0]?.ModuleDetails
          : [];
        // .filter( (eachData) =>  eachData.moduleAccess == 'Y')
      } else {
        state.selectedUserData = {};
        state.selectedModuleBranch = [];
      }
    });
    builder.addCase(getBranchBasedOnStoreAndType.fulfilled, (state, action) => {
      console.log("branch Data", action.payload);
      if (action.payload.data.statusCode){
        console.log("getting APpData",state.AppListData,action.payload.data.data[0]['SubCategoryName'])
        state.AppListData[action.payload.data.data[0]['SubCategoryName']] = action.payload.data.data
      }
    });

    builder.addCase(getCmpDetails.fulfilled, (state, action) => {
      console.log("company Data", action.payload.data.data[0]);
      if (action.payload.data.statusCode){
        state.CmpListData[action.payload.data.data[0]['AppName']] = action.payload.data.data
      }
    });

    builder.addCase(getBranchDetails.fulfilled, (state, action) => {
      console.log("branch Data", action.payload.data.data[0]);
      if (action.payload.data.statusCode){
        state.BranchListData[`${action.payload.data.data[0]['AppName']}-${action.payload.data.data[0]['CompName']}`] = action.payload.data.data
      }
    });

    
 
  },
});

export const {
  changeRole,
  changeStore,
  changeBranch,
  changeApp,
  changeUser,
  emptyUserData,
  emptyPostData,
  changeIntialRole,
  emptySelectedModuleBranch,
  emptyModuleBranch,
  emptyDataList,
  emptySelectedIds,
  updateModuleAccessByModuleTypeId,
  addModuleAccess,
  updateModuleAccessByBranchId,
  changeUserId,
  changeAppAccess,
  changePostData,
  changeCompAccess,
  changeBranchAccess,
  AddAppList,
  removeAppList,
  removeCmpList,
  removeBranchList,
  removePostDataValue,
  removeBranchAccess,
  removeCompanyAccess,
  removeAppAccess,
} = moduleAccess.actions;


export const selectRoleSelector = (state) => state.moduleAccess?.selectedRole;
export const selectedStoreSelector = (state) =>
  state.moduleAccess?.selectedStore;
export const selectedBranchIdSelector = (state) =>
  state.moduleAccess?.selectedBranch;
  export const selectedAppIdSelector = (state) =>
  state.moduleAccess?.selectedApp;
export const selectedUserSelector = (state) => state.moduleAccess?.selectedUser;
export const selectBranchData = (state) => state.moduleAccess?.branchData;
export const selectAppData = (state) => state.moduleAccess?.appData;
export const userDataSelector = (state) => state.moduleAccess?.userData;
export const allModuleSelector = (state) => state.moduleAccess?.allModules;
export const selectedUserDataSelector = (state) =>
  state.moduleAccess?.selectedUserData;
export const selectedModuleBranchSelector = (state) =>
  state.moduleAccess?.selectedModuleBranch;
export const gettingAdminSelector = (state) => state.moduleAccess?.AdminData;
export const gettingUserId = (state) => state.moduleAccess?.UserId;
export const gettingAppAccess = (state) => state.moduleAccess?.AppAccess;
export const gettingCompAccess = (state) => state.moduleAccess?.CompAccess;
export const gettingBranchAccess = (state) => state.moduleAccess?.BranchAccess;
export const gettingAppListSelector = (state) => state.moduleAccess?.AppListData;
export const gettingCmpListSelector=(state)=>state.moduleAccess?.CmpListData;
export const gettingBranchListSelector=(state)=>state.moduleAccess?.BranchListData;
export const gettingPostDataValue = (state) => state.moduleAccess?.PostDataValue;

export default moduleAccess.reducer;
