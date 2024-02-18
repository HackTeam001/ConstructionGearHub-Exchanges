import './create.css'
import Image from '../../assets/Image.png'
import { uploadToIPFS } from "../../Infura";
import { useWallet } from '../../contexts/WalletContex';
import { ethers } from 'ethers';
import "w3-css/w3.css";
import { useParams } from 'react-router-dom';

import React,{useState} from 'react'

interface Item {
  name: string;
  itemID: number;
  description: string;
  item_im: string;
  price: number; 
  listed: boolean;
}

const Create = () => {
  // State variables to manage input values
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [shopModalIsOpened, setShopModalIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [message_color, setMessageColor] = useState('');

  const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();

  const {id} = useParams();


  async function OnChangeFile(e) {
    var file = e.target.files[0];

    const response = await uploadToIPFS(file);

    console.log(response);

    setFileURL(response);
  }
  
  // Function to handle form submission
  const handleSubmit = async(event) => {
    event.preventDefault();
    // Perform actions to create the item using the input values
    console.log('Item Name:', itemName);
    console.log('Description:', description);
    console.log('Price:', price);
    // Reset form fields if needed

    if (contract){

      try {

      const tx = await contract.addItem(
        id,
        itemName,
        description,
        fileURL,
        ethers.utils.parseEther(price)
      );

      await tx.wait();
      console.log("Item added successfully!");
      setMessage(" Item added Successfully!")
      setMessageColor('w3-text-green')
      }catch (error) {
        console.error("Error posting client job:", error);
        setMessage("Something went wrong when adding item to  shop!")
        setMessageColor('w3-text-red')
      }

      setShopModalIsOpened(true);

    }
    setItemName('');
    setDescription('');
    setPrice('');
    setFileURL(null);
  };

  return (
    <div className='create section__padding'>
      <div className="create-container">
        <h1>Create new Item</h1>
        <p className='upload-file'>Upload File</p>
        <div className="upload-img-show">
            <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
            <img src={Image} alt="banner" />
            <p>Drag and Drop File</p>
        </div>
        <form className='writeForm' autoComplete='off' onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Upload</label>
            <input type="file" className='custom-file-input' onChange={OnChangeFile}/>
          </div>
          <div className="formGroup">
            <label>Name</label>
            <input
              type="text"
              placeholder='Item Name'
              autoFocus={true}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Description</label>
            <textarea
              rows={4}
              placeholder='Decription of your item'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="formGroup">
            <label>Price</label>
            <div className="twoForm">
              <input
                type="text"
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <select>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>
          <button type="submit" className='writeButton'>Create Item</button>
        </form>
      </div>
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
  );
};

export default Create;
