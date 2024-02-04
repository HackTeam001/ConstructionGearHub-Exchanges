import React from 'react'
import './gears.css'
import { AiFillHeart } from "react-icons/ai";
import gears1 from '../../assets/gear1.jpg'
import gears2 from '../../assets/gear2.jpg'
import gears3 from '../../assets/gear3.jpg'
import gears4 from '../../assets/gear4.jpg'
import gears5 from '../../assets/gear5.jpg'
import { Link } from 'react-router-dom';


interface GearsProps {
  title:string;
}


const Gears: React.FC<GearsProps> = ({title}) => {
  return (
    <div className='gears section__padding'>
      <div className="gears-container">
        <div className="gears-container-text">
          <h1>{title}</h1>
        </div>
        <div className="gears-container-card">
          <div className="card-column" >
            <div className="gears-card">
              <div className="gears-card-top">
                <img src={gears1} alt=""/>
              <Link to={`/post/123`}>
              <p className="gears-title">Logistics Flyer</p>
              </Link>
              </div>
              <div className="gears-card-bottom">
                <p>1.25 <span>ETH</span></p>
                <p> <AiFillHeart /> 92</p>
              </div>
            </div>
          </div>
          <div className="card-column" >
            <div className="gears-card">
              <div className="gears-card-top">
                <img src={gears2} alt="" />
              <Link to={`/post/123`}>
              <p className="gears-title">Construction Machine</p>
              </Link>
              </div>
              <div className="gears-card-bottom">
                <p>0.20 <span>ETH</span></p>
                <p> <AiFillHeart /> 25</p>
              </div>
            </div>
          </div>
          <div className="card-column" >
            <div className="gears-card">
              <div className="gears-card-top">
                <img src={gears3} alt="" />
              <Link to={`/post/123`}>
              <p className="gears-title">Dozer</p>
              </Link>
              </div>
              <div className="gears-card-bottom">
                <p>0.55 <span>ETH</span></p>
                <p> <AiFillHeart /> 55</p>
              </div>
            </div>
          </div>
          <div className="card-column" >
            <div className="gears-card">
              <div className="gears-card-top">
                <img src={gears4} alt="" />
              <Link to={`/post/123`}>
              <p className="gears-title">Construction Machine</p>
              </Link>
              </div>
              <div className="gears-card-bottom">
                <p>0.87 <span>ETH</span></p>
                <p> <AiFillHeart /> 82</p>
              </div>
            </div>
          </div>
          <div className="card-column" >
            <div className="gears-card">
              <div className="gears-card-top">
                <img src={gears5} alt="" />
              <Link to={`/post/123`}>
              <p className="gears-title">Construction Truck</p>
              </Link>
              </div>
              <div className="gears-card-bottom">
                <p>0.09 <span>ETH</span></p>
                <p> <AiFillHeart /> 22</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="load-more">
        <button>Load More</button>
      </div>
    </div>
  )
}

export default Gears
