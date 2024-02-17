import React from 'react';
import './item.css'
import creator from '../../assets/profile.png'
import item from '../../assets/item1.jpg'
import { AiFillHeart } from "react-icons/ai";
import gears1 from '../../assets/gear1.jpg'
import gears2 from '../../assets/gear2.jpg'
import gears3 from '../../assets/gear3.jpg'
import gears4 from '../../assets/gear4.jpg'
import gears5 from '../../assets/gear5.jpg'
import { Link } from 'react-router-dom';
import { id } from 'ethers/lib/utils';

const MyItems:React.FC = () => {

  const id = 1;



  return(
    <>
      <div className='item section__padding'>
        <div className="item-image">
          <img src='' alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              <h1>Logistics Flyer</h1>
              <p>From <span>4.5 ETH</span> ‧ 20 of 25 available</p>
            </div>
            <div className="item-content-creator">
              <div><p>Seller</p></div>
              <div>
                <img src={creator} alt="creator" />
                <p>Rian Leon </p>
              </div>
            </div>
            <div className="item-content-detail">
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
            </div>
            <div className="item-content-buy">
              <button className="primary-btn"><Link to={`shop/${id}`}>Add Item</Link></button>
              <button className="secondary-btn">Make Offer</button>
            </div>
          </div>
      </div>
      <div className='gears section__padding'>
      <div className="gears-container">
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
        </div>
      </>
  )
};

export default MyItems;
