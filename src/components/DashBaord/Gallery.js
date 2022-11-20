import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';



export default function Gallery(prop) {
    const [index,setIndex]=useState(0);
    const handleSelect=(i,e)=>{
        setIndex(i)
    }
    return (
        prop.ImageList.length>0?
            <Carousel activeIndex={index} onSelect={(i,e)=>handleSelect(i,e)}>
                {prop.ImageList.map((image,imgindex) => 
                <Carousel.Item interval={1500}>
                    <img className="d-block w-100" src={image.ImageUrl} alt={image.ImageName} style={{height:500}}/>   
                    <div className='checkbox' onChange={(e)=>prop.UpdateChk(e,index)}>
                        <input id={imgindex} key={imgindex} type="checkbox"></input>
                        <label for={imgindex}></label>
                    </div>      
                </Carousel.Item> 
                )}           
            </Carousel>
        :<Carousel></Carousel>        
      );
}
