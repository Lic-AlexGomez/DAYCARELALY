import React,{useContext,useEffect} from "react";
import { Context } from "../store/appContext";
import '../../styles/Services.css'
import { Link } from "react-router-dom";


const Services = () => {
    const { actions, store } = useContext(Context);

    useEffect(()=>{
          actions.fetchServices();
        },[])


    return (
        <div className="tw-bg-[#FFC909]">
            <h1 className="tw-pt-20 tw-text-center tw-text-3xl tw-font-black">Our services</h1>
            <div className="card-services ">
                {store.services.map((service) => (
                    <div key={service.id} className="service-item ">
                        <div className="image-services">
                            <img src={service.image} alt={service.title} />
                        </div>
                        <div className="content-services tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <span className="title-services">
                                {service.name}
                            </span>
                            <div className="desc-services">
                                <p >
                                    {service.description}
                                </p>
                            </div>

                            <button  className="cursor-pointer tw-transition-all tw-bg-[#9C29B2] tw-text-white tw-px-6  tw-rounded-lg
                             tw-border-purple-600
                             tw-border-b-[4px] tw-hover:brightness-110 tw-hover:-translate-y-[1px] tw-hover:border-b-[6px]
                             tw-active:border-b-[2px] tw-active:brightness-90 tw-active:translate-y-[2px]">
                                <Link to={"/contactus"}>Contact us</Link>  
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Services;
