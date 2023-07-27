import { configureStore } from '@reduxjs/toolkit'
import centerPage from '../features/appPage/centerPage'
import homePage from '../features/homePage/homePage'
import companyPage from '../features/companyPage/companyPage'
import configtypePage from '../features/configtypepage/configtypepage'
import currencyPage from '../features/currencyPage/currencyPage'
import carouselPage from '../features/carouselPage/carouselPage'
import configmasterPage from '../features/configmasterPage/configmasterPage'
import userPage from '../features/userPage/userPage'
import branchPage from '../features/branchPage/branchPage'
import exceluploadPage from '../features/exceluploadPage/exceluploadPage'
import signInPage from '../features/signInPage/signInPage'
import moduleAccess from "../features/ModuleAccess/moduleAccessSlice"
import applicationPage from '../features/applicationPage/applicationPage'
import applicationImagePage from '../features/applicationImagePage/applicationImagePage'
import applications from '../features/applications/applications';
import userAccount from '../features/userAccount/userAccount';
import bannerImage from '../features/applications/bannerImage';
import MessageTemplate from '../features/MessageTemplates/MessageTemplate';
import paymentUPIdetails from '../features/paymentUPIdetails/paymentUPIdetails';
import appAccessPage from '../features/appAccessPage/appAccessPage'
import logs from '../features/logs/logs';
import pricingType from '../features/pricingType/pricingType'

const store = configureStore({
    reducer: {
        centerPage: centerPage,
        homePage: homePage,
        application: applications,
        companyPage:companyPage,
        configtypePage:configtypePage, 
        currencyPage:currencyPage,
        carouselPage:carouselPage,
        configmasterPage:configmasterPage,
        userPage:userPage,
        branchPage:branchPage,
        exceluploadPage:exceluploadPage,
        signInPage:signInPage,
        applicationPage: applicationPage,
        applicationImagePage: applicationImagePage,
        companyPage: companyPage,
        moduleAccess:moduleAccess,
        userAccount: userAccount,
        bannerImage:bannerImage,
        appAccessPage:appAccessPage,
        MessageTemplate:MessageTemplate,
        paymentUPIdetails:paymentUPIdetails,
        pricingType:pricingType,
        logs:logs
    }
})
export default store





