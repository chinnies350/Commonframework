import { useDispatch, useSelector } from "react-redux";
import { getAllApplications } from "../../features/applications/applications";
import { useEffect, useState,useCallback } from "react";
import { getCookieData,storeCookieData } from "../../Services/others";
import { useNavigate } from "react-router-dom";



import '../../styles/applications/applicationList.scss';

const ApplicationList =  ({ searchText }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [allApplications, setAllApplications] = useState([])
    const [modifiedApplication, setModifiedApplication] = useState([])
    useEffect(() => {
        
        async function getData () {
            const userId = getCookieData('UserId') ?? 1
            const res = await dispatch(getAllApplications({userId})).unwrap()
            console.log('res', res)
            if (res.data.statusCode) {
                setAllApplications(res.data.data)
                setModifiedApplication(res.data.data)
            } 
        }
        getData()
    }, [])

    useEffect(() => {
        console.log('searchText', searchText)
        const modRes = allApplications.filter(eachsubCategory => {
           
            return eachsubCategory.AppDetails.filter(eachApp => {
                return eachApp.AppName.toLowerCase().includes(searchText.toLowerCase())
            }).length > 0
        })

        setModifiedApplication(modRes)
        console.log("modRes", modRes)
    }, [searchText])


    let applicationsList = modifiedApplication.map(eachsubCategory => (
        <div className="subCatApplicationCardParent" 
                // key={eachsubCategory.SubCateId} 
                style={{backgroundImage: `url(${eachsubCategory.subCategoryImage})`}}
            >
            <div className="filterCard">
                <div className="subCatApplicationCardHeading">
                    <p>{eachsubCategory.SubCategoryName} </p>
                </div>
                <div className="subCatApplicationCards">
                {eachsubCategory.AppDetails.map(eachApp => (
                    <div className="eachApplicationCard" key={eachApp.AppId}>
                        <img className="eachApplicationLogo" src={eachApp.AppLogo!="" && eachApp.AppLogo!=null ? eachApp.AppLogo: "http://saveme.live/paypre-image-api/upload?fileId=64b536df06bfb6b6b9922bbc.webp"} alt="" />
                        <div className="eachApplicationCardAppDetails">
                            <h4>{eachApp.AppName}</h4>
                            <p className="appDescriptionCard">{eachApp.AppDescription}</p>
                        </div>
                        {eachApp.subscribed == 'Y' ? 
                            <p className="appDescriptionCardSubc" onClick={() => {
                                storeCookieData('AppId',eachApp.AppId)
                                navigate(`/${eachApp.AppName?.toLowerCase()}`);
                                window.location.reload();
                            
                            window.location.reload()}}>{eachApp.Status} &gt;</p> :
                            <p className="appDescriptionCardSubc" onClick={() => {  storeCookieData('AppId',eachApp.AppId)
                                                                                    navigate(`/${eachApp.AppName?.toLowerCase()}`)
                                                                                    window.location.reload()}}>Try Now &gt;</p>}
                        
                    </div>
                    
                ))}
                    
                </div>
            </div>
        </div>
    ))

    return (
        <div className='applicationList'>
            {console.log(modifiedApplication, 'modified application', applicationsList)}
            {applicationsList}
        </div>
    )
}

export default ApplicationList;