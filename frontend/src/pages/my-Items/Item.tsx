import React,{useEffect,useState} from 'react';
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
import { useWallet } from '../../contexts/WalletContex';
import { ethers } from 'ethers';
import "w3-css/w3.css"
import { formatEthereumAddress } from '../../utils/itils';


interface Shop{
  address: string,
  name: string,
  shop_profile: string;
  shopID: number;
  isOpen: boolean;
}

const MyItems:React.FC = () => {

  const id = 1;

  const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();



  const[shop , setShop] = useState([]);
  const[shopItems,setItemShops] = useState([])


  console.log(account)

     

  useEffect(() => {
    const fetchData = async () => {

      console.log(contract,account)
        if (account && contract) {

          try {
            const user_shop = await contract.getShopDetails(account[0]);

            console.log(user_shop)


            setShop(user_shop);

            console.log(shop)

            const items = await contract.getItemsForShop(Number(user_shop[3]));

            setItemShops(items);

            console.log(items)

          }catch(e){
              console.log(e)
          }
          

        }
    };

    fetchData(); // Call the function inside useEffect

}, [contract,account,setShop]); 


  return(
    <>
    { shop ? (

      <>
      <div className='item section__padding'>
        <div className="item-image">
          <img src={shop[2]} alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              <h1 className='w3-text-green'>{shop[1]}</h1>
            </div>
            <div className="item-content-creator">
              <div><p>Seller</p></div>
              <div>
                <img src={creator} alt="creator" />
                <p>{formatEthereumAddress(shop[0])} </p>
              </div>
            </div>
            <div className="item-content-detail">
              
            </div>
            <div className="item-content-buy">
              <button className="primary-btn"><Link to={`shop/${shop[3]}`}>Add Item</Link></button>
            
            </div>
          </div>
      </div>
      <div className='gears section__padding'>
      <div className="gears-container">
      <div className="gears-container-card">
        <h2 className='w3-text-blue'> Your Items </h2>
      {shopItems && shopItems.map((item) => (
                <div className="card-column" key={Number(item[1])}>
                    <div className="gears-card">
                        <div className="gears-card-top">
                            <img src={item[4]} alt="" />
                            <Link to={`/item/${Number(item[1])}`}>
                                <p className="gears-title">{item[0]}</p>
                            </Link>
                        </div>
                        <div className="gears-card-bottom">
                            <p>{ethers.utils.formatEther(ethers.BigNumber.from(item[5]))}<span>ETH</span></p>
                            {/* Assuming the heart icon is for likes */}
                            <p><AiFillHeart /> 92</p> 
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
        </div>
      </>

    ) :
    (
      <div className='item section__padding'>
        <h3 className='w3-text-green'> Click <span className='w3-text-blue'> Create Shop</span> to create shop</h3>
      </div>
    )

    }

  </>
  )
};

export default MyItems;
