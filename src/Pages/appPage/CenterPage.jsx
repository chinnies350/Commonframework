import { Outlet, Link } from 'react-router-dom'
import { Breadcrumb } from 'antd';
import {useSelector} from 'react-redux'
import { breadCrumbSelector } from '../../features/appPage/centerPage';
import { useEffect } from 'react';

const CenterPage = () => {
    const breadCrumb = useSelector(breadCrumbSelector)
    
    
    return (
        <div className='centerPageSub'>
             
                <div className='breadCrumbClass'>
                {breadCrumb.length>0 && <Breadcrumb className='crumb' items={breadCrumb?.map(eachItem => {
                            return {
                                title: <Link to={eachItem.link}>{eachItem.name}</Link>
                            }
                        })}/>
                    }

                </div>

            <div className='content'>
                < Outlet />
            </div>
        </div> 
    )
}

export default CenterPage;