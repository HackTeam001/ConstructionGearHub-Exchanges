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



  const[transactions , setTransactions] = useState([]);



  console.log(account)

  const handleConfirm = (transactionId) => {
    // Implement your logic here to handle the confirmation
    console.log('Confirmed transaction:', transactionId);
};

     

  useEffect(() => {
    const fetchData = async () => {

      console.log(contract,account)
        if (account && contract && escrowContract) {

          try {
            const user_transactions = await  escrowContract.getAllTransactions();



            setTransactions(user_transactions);


            console.log(user_transactions)

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
                            <tr key={transaction.transactionId} onClick={() => handleConfirm(transaction.transactionId)}>
                                <td>{transaction.transactionId}</td>
                                <td>{transaction.buyer}</td>
                                <td>{transaction.arbitrator}</td>
                                <td>{transaction.seller}</td>
                                <td>{transaction.itemPrice}</td>
                                <td>{transaction.arbitratorFees}</td>
                                <td>{transaction.finalPrice}</td>
                                <td>{transaction.currentState}</td>
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

  </>
  )
};

export default Transaction;
