import React,{useState,useEffect} from 'react'
import './gears.css'
import { AiFillHeart } from "react-icons/ai";
import gears1 from '../../assets/gear1.jpg'
import gears2 from '../../assets/gear2.jpg'
import gears3 from '../../assets/gear3.jpg'
import gears4 from '../../assets/gear4.jpg'
import gears5 from '../../assets/gear5.jpg'
import { Link } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContex';
import { ethers } from 'ethers';

interface GearsProps {
  title:string;
}


// string name;
// uint itemID;
// string description;
// string item_im;
// uint256 price;
// bool listed;

interface Item {
    name:string,
    itemId: number,
    description: string,
    item_im:string,
    price:number,
    listed:boolean
}


const Gears: React.FC<GearsProps> = ({title}) => {

  const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();

  const[items , setItems] = useState<Item[] | null >(null);

     

      useEffect(() => {
        const fetchData = async () => {

          console.log(contract,account)
            if (account && contract) {
              
                const all_items = await contract.getAllItems();

                console.log(all_items)

                setItems(all_items);

            }
        };

        fetchData(); // Call the function inside useEffect

    }, [contract,account]); 



  return (
    <div className='gears section__padding'>
      <div className="gears-container">
        <div className="gears-container-text">
          <h1>{title}</h1>
        </div>
        <div className="gears-container-card">
        {items && items.map((item) => (
                <div className="card-column" key={item.itemId}>
                    <div className="gears-card">
                        <div className="gears-card-top">
                            <img src={gears1} alt="" />
                            <Link to={`/item/${item.itemId}`}>
                                <p className="gears-title">{item.name}</p>
                            </Link>
                        </div>
                        <div className="gears-card-bottom">
                            <p>{item.price} <span>ETH</span></p>
                            {/* Assuming the heart icon is for likes */}
                            <p><AiFillHeart /> 92</p> 
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <div className="load-more">
        <button>Load More</button>
      </div>
    </div>
  )
}

export default Gears
