import React,{useEffect,useState} from 'react';
import './item.css'
import creator from '../../assets/profile.png'
import item from '../../assets/item1.jpg'
import { useWallet } from '../../contexts/WalletContex';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';

import { BigNumber } from 'bignumber.js';

import { formatEthereumAddress } from '../../utils/itils';



const Item:React.FC = () => {

  const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();


  const {id} = useParams();



  const[Item , setItem] = useState([]);
  const[ItemItems,setItemItems] = useState([])
  const [shopModalIsOpened, setShopModalIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [message_color, setMessageColor] = useState('');
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [price, setPrice] = useState('');



  console.log(account)

  const handleCheckout = async () => {
    if (account && contract) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      try {
      
      const ItemId = Number(Item[1].toString());

      const shopId = Number(Item[2].toString())

      console.log(ethers.utils.parseEther(price))
      console.log(ItemId)
      console.log(shopId)

     
      const result = await contract.buyItem(ItemId,shopId,
      {
        value: ethers.utils.parseEther(price), // Convert price to wei
      }
      );
      await result.wait();
      console.log(result);
      console.log("Transaction initiated successfuly successfully!");
      setMessage(" Transaction initiated successfuly successfully!")
      setMessageColor('w3-text-green')

      }catch (error) {
        console.error("Error initiating transacetion:", error);
        setMessage("Something went wrong when initiating Transaction!")
        setMessageColor('w3-text-red')
      }

    
    }
    setModalIsOpened(false);
  };

     

  useEffect(() => {
    const fetchData = async () => {

      console.log(contract,account)
        if (account && contract) {

          try {
            const newItemId = Number(id)
            const item = await contract.getItemByID(newItemId);

            // const Items = await contract.getAllItems();
            // const Item = Items.find((Item: { ItemID: any; }) => Number(Item.ItemID) === Number(user_Item[2]));

            setItem(item);

            setPrice(ethers.utils.formatEther(ethers.BigNumber.from(item[5])))

            // const items = await contract.getItemsForItem(Number(user_Item[2]));

            // setItemItems(items);

            // console.log(items)

          }catch(e){
              console.log(e)
          }
          

        }
    };

    fetchData(); // Call the function inside useEffect

}, [contract,account,setItem,setPrice]); 

  return( 
      <div className='item section__padding'>
        <div className="item-image">
          <img src={Item[4]} alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              <h1>{Item[0]}</h1>
               <p>{price} <span>ETH</span></p> 
            </div>
            <div className="item-content-creator">
              <div><p>Seller</p></div>
              <div>
                <img src={creator} alt="creator" />
                {/* <p>{formatEthereumAddress(Item[0])}</p> */}
              </div>
            </div>
            <div className="item-content-detail">
              <p>{Item[3]}</p>
            </div>
            <div className="item-content-buy">
              <button className="primary-btn" 
              onClick={() => {
                setModalIsOpened(true);
              }}
              >Buy</button>
              {/* <button className="secondary-btn">Make Offer</button> */}
            </div>
          </div>
          {modalIsOpened && (
        <div className="w3-modal" style={{ display: "block" }}>
          <div className="w3-modal-content w3-padding">
            <div className="w3-container">
              <p> Buy this Item</p>
              <button
                onClick={handleCheckout}
                className="w3-button w3-round w3-text-white w3-border w3-green"
              >
                Proceed
              </button>
              <button
                className="w3-button w3-round w3-red w3-right"
                onClick={() => {
                  setModalIsOpened(false);
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

      {shopModalIsOpened && (
                <div className="w3-modal" style={{ display: "block" }}>
                  <div className="w3-modal-content w3-padding">
                    <div className="w3-container">
                      <p className={`${message_color}`}>{message}</p>
                      <div className="formGroup">
                    </div>
                      <button
                        className="w3-button w3-round w3-red w3-right"
                        onClick={() => {
                          setShopModalIsOpened(false);
                        }}
                      >
                        close
                      </button>
                    </div>
                  </div>
                </div>
              
              )}
      </div>
  )
};

export default Item;
