import { Routes, Route } from "react-router-dom";

import AppPage from './Pages/appPage/AppPage.jsx';
import CompanyForm from './Pages/company/companyForm.jsx';
import CompanyList from "./Pages/company/companyList.jsx";
import AdminTax from './Pages/adminTax/adminTaxForm.jsx';
import BranchForm from './Pages/branch/branchForm.jsx';
import BranchList from './Pages/branch/branchList.jsx';
import ApplicationForm from "./Pages/application/applicationForm.jsx";
import ApplicationList from "./Pages/application/applicationList.jsx";
import CommonMaster from "./Pages/commonMaster/CommonMaster.jsx";
import ConfigTypeForm from "./Pages/configType/configtypeForm.jsx";
import ApplicationImageForm from "./Pages/applicationImage/applicationImageForm.jsx";
import AppPriceFeatureMapping from './Pages/appPriceFeatureMapping/appPriceFeatureMappingList.jsx'
import AppPriceFeatureMappingForm from './Pages/appPriceFeatureMapping/appPriceFeatureMappingForm.jsx'
import AppMenu from './Pages/appMenu/appMenuList.jsx'
import AppMenuForm from './Pages/appMenu/appMenuForm.jsx'
import Pricing from "./Pages/pricingType/pricingTypeList.jsx"
import PricingForm from "./Pages/pricingType/pricingTypeForm.jsx"
import CarouselForm from "./Pages/Carousel/carousalForm.jsx";
import CurrencyForm from "./Pages/Currency/currencyForm.JSX";
import FeatureList from "./Pages/feature/featureList.jsx";
import FeatureForm from "./Pages/feature/featureForm.jsx"
import UserForm from "./Pages/user/userForm.jsx";
import UserList from "./Pages/user/userList.jsx";
import LandignPageLayout from "./Pages/LandingPage/landingPageLayout.jsx";
import Home from "./Pages/homeApp/home.jsx";
import PublicSignup from "../src/Pages/PublicSignup/Signup.jsx"
import PublicHome from "../src/Pages/publichome/HomePage.jsx"
import Signin from '../src/Pages/publicsignin/Signin.jsx'
import ModuleAccess from "../src/Pages/ModuleAccess/ModuleAccess.jsx"
import Application from "./Pages/applications/application.jsx";
import UserAccount from "./Pages/userAccount/userAccount.jsx";
import MessageTemplateForm from "./Pages/MessageTemplate/MessageTemplateForm.jsx";
import MessageTemplateList from "./Pages/MessageTemplate/MessageTemplateList.jsx";
import PaymentUPIDetailsForm from "./Pages/PaymentUPIDetails/PaymentUPIDetailsForm.jsx";
import PaymentUPIDetailsList from "./Pages/PaymentUPIDetails/PaymentUPIDetailsList.jsx";
import PdfPageCommon from "./Pages/paymentpdfPage/PaymentPdfCommon.jsx"
import PricingDetails from "./Pages/pricingTypeRestaurant/Pricing.jsx";



const subDirectory = import.meta.env.ENV_BASE_URL

const App =() => {
 
  return (
      // <>
      //   <Routes>
      //     <Route />
      //   </Routes>
      // </>
    <Routes>
      <Route path={`${subDirectory}`} element={<PublicHome/>}/>
      <Route path={`${subDirectory}public-signup`} element={<PublicSignup/>}/> 
      <Route path={`${subDirectory}public-signin`} element={<Signin/>}/>
      <Route path={`${subDirectory}payment-pdf`} element={<PdfPageCommon/>}/>  
      <Route path={`${subDirectory}pricing-details`} element={<PricingDetails/>}/>  

      
      <Route path={`${subDirectory}landing-page`} element={<LandignPageLayout />}>
        <Route path={'home'} element={<Home />}/>
        <Route path={'apps'} element={<Application />}/>
        <Route path={'user-account'} element={<UserAccount />} />

      </Route>
      <Route path={`${subDirectory}setting`} element={<AppPage />}>
        <Route  path='Organization-master'>
              <Route index element={<CompanyList />}/>
              <Route path='new' element={<CompanyForm formType={"add"}/>}/>
              <Route path='update' element={<CompanyForm formType={"edit"}/>}/> 
        </Route>
        <Route  path='branch-master'>
              <Route index element={<BranchList />}/>
              <Route path='new' element={<BranchForm formType={"add"}/>}/>
              <Route path='update' element={<BranchForm formType={"edit"}/>}/> 
        </Route>
        <Route  path='application-master'>
              <Route index element={<ApplicationList />}/>
              <Route path='new' element={<ApplicationForm formType={"add"}/>}/>
              <Route path='update' element={<ApplicationForm formType={"edit"}/>}/> 
        </Route>
        <Route  path='app-menu'>
              <Route index element={<AppMenu />}/>
              <Route path='new' element={<AppMenuForm formType={"add"}/>}/>
              <Route path='update' element={<AppMenuForm formType={"edit"}/>}/> 
        </Route>
        <Route  path='feature-mapping'>
              <Route index element={<AppPriceFeatureMapping />}/>
              <Route path='new' element={<AppPriceFeatureMappingForm formType={"add"}/>}/>
              <Route path='update' element={<AppPriceFeatureMappingForm formType={"edit"}/>}/> 
        </Route>
        <Route  path='pricing'>
              <Route index element={<Pricing />}/>
              <Route path='new' element={<PricingForm formType={"add"}/>}/>
              <Route path='update' element={<Pricing formType={"edit"}/>}/> 
        </Route>
        <Route path='feature-master'>
              <Route index element={<FeatureList />}/>
              <Route path='new' element={<FeatureForm formType={"add"}/>}/>
              <Route path='update' element={<FeatureForm formType={"edit"}/>
            }/> 
              
        </Route>
        <Route path='user-master'>
              <Route index element={<UserList />}/>
              <Route path='new' element={<UserForm formType={"add"}/>}/>
              <Route path='update' element={<UserForm formType={"edit"}/>}/>
             
        </Route>
        <Route path='message-template'>
              <Route index element={<MessageTemplateList />}/>
              <Route path='new' element={<MessageTemplateForm formType={"add"}/>}/>
              <Route path='update' element={<MessageTemplateForm formType={"edit"}/>}/>             
        </Route>
        <Route path='PaymentUPIDetails'>
              <Route index element={<PaymentUPIDetailsList />}/>
              <Route path='new' element={<PaymentUPIDetailsForm formType={"add"}/>}/>
              <Route path='update' element={<PaymentUPIDetailsForm formType={"edit"}/>}/>             
        </Route>
        <Route path='app-access' element={<ModuleAccess/>}/> 
        <Route path='config-master' element={<CommonMaster/>}/>  
        <Route path='config-type' element={<ConfigTypeForm/>}/>
        <Route path='admin-tax' element={< AdminTax />}/>
        <Route path='application-image' element={< ApplicationImageForm />}/>
        <Route path='carousel' element={<CarouselForm/>}/>
        <Route path='currency' element={<CurrencyForm/>}/>
        
       
      </Route>
      <Route path={`${subDirectory}check`} element={<div>check</div>} />
    </Routes>  
  )
}


export default App