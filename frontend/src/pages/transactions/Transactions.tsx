import React,{useEffect,useState} from 'react';
import '../item/item.css'
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



const Transaction:React.FC = () => {

  const id = 1;

  const { provider, account, connectWallet, disconnectWallet,contract,signer,escrowContract } = useWallet();
  const [shopModalIsOpened, setShopModalIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [message_color, setMessageColor] = useState('');
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [transactionId, setTransactionId] = useState(null);


  const[transactions , setTransactions] = useState([]);

    const TransactionState = {
      0: 'Awaiting Payment',
      1: 'Awaiting Delivery',
      2: 'Completed Transaction'
  };

const getStateName = (stateValue) => {
  return TransactionState[stateValue];
};



  console.log(account)

  const handleConfirm = async() => {
    // Implement your logic here to handle the confirmation
    console.log('Confirmed transaction:', transactionId);

    if (account && escrowContract) {
      // const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);

      try {
      
      const result = await contract.confirmDelivery(transactionId);
      await result.wait();

      console.log(result);
      console.log("Transaction completed  successfully!");
      setMessage(" Transaction completed  successfully!")
      setMessageColor('w3-text-green')

      }catch (error) {
        console.error("Error initiating transacetion:", error);
        setMessage("Something went wrong when completing Transaction!")
        setMessageColor('w3-text-red')
      }

    
    }
    setModalIsOpened(false);
    setShopModalIsOpened(true);

};

     

  useEffect(() => {
    const fetchData = async () => {

      console.log(contract,account)
        if (account && contract && escrowContract) {

          try {
            const user_transactions = await  escrowContract.getAllTransactions();

            const filteredTransactions = user_transactions.filter(transaction => transaction.buyer === account[0]);



            setTransactions(filteredTransactions);


            console.log(filteredTransactions)

          }catch(e){
              console.log(e)
          }
          

        }
    };

    fetchData(); // Call the function inside useEffect

}, [contract,account,setTransactions]); 


  return(
    <>
    <div className='item section__padding'>
        <h3 className='w3-text-blue'> Transactions </h3>
    </div>
    { transactions ? (

      <>
      <div className='item section__padding'>
            <table className="w3-table">
                    <thead>
                        <tr className='w3-text-teal'>
                            <th>Transaction ID</th>
                            <th>Buyer</th>
                            <th>Arbitrator</th>
                            <th>Seller</th>
                            <th>Item Price</th>
                            <th>Arbitrator Fees</th>
                            <th>Final Price</th>
                            <th>Current State</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr className='w3-text-light-blue  table-row' key={Number(transaction[0])} onClick={() => {setModalIsOpened(true);setTransactionId(Number(transaction[0]));}}>
                                <td>{Number(transaction[0])}</td>
                                <td>{formatEthereumAddress(transaction.buyer)}</td>
                                <td>{formatEthereumAddress(transaction.arbitrator)}</td>
                                <td>{formatEthereumAddress(transaction.seller)}</td>
                                <td>{ethers.utils.formatEther(ethers.BigNumber.from(transaction[4]))}</td>
                                <td>{ethers.utils.formatEther(ethers.BigNumber.from(transaction[5]))}</td>
                                <td>{ethers.utils.formatEther(ethers.BigNumber.from(transaction[6]))}</td>
                                <td>{getStateName(transaction.currentState)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
      </>

    ) :
    (
      <h3 className='w3-text-green'> You have <span className='w3-text-blue'> 0 </span> Transactions </h3>
    )

    }
          {modalIsOpened && (
        <div className="w3-modal" style={{ display: "block" }}>
          <div className="w3-modal-content w3-padding">
            <div className="w3-container">
              <p> Confirm this transacetion</p>
              <button
                onClick={handleConfirm}
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
  </>
  )
};

export default Transaction;
