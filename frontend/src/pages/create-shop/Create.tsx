import React, { useState } from 'react';
import './create.css';
import Image from '../../assets/Image.png';
import { uploadToIPFS } from "../../Infura";
import { useWallet } from '../../contexts/WalletContex';
import { ethers } from 'ethers';
import "w3-css/w3.css";


const Create = () => {

  const [shopName, setshopName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [shopModalIsOpened, setShopModalIsOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [message_color, setMessageColor] = useState('');

  const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();


  async function OnChangeFile(e) {
    var file = e.target.files[0];

    const response = await uploadToIPFS(file);

    console.log(response);

    setFileURL(response);
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    // You can perform any necessary actions here with the form data
    console.log('Item Name:', shopName);
    console.log('Image File:', fileURL);

    if (contract){

      try {

      const tx = await contract.openShop(
        shopName,
        fileURL
      );

      await tx.wait();
      console.log("Shop opened successfully!");
      setMessage(" Shop Opened Successfully!")
      setMessageColor('w3-text-green')
      }catch (error) {
        console.error("Error posting client job:", error);
        setMessage("Something went wrong when opening  shop!")
        setMessageColor('w3-text-red')
      }

      setShopModalIsOpened(true);

    }



    // Reset the form fields if needed
    setshopName('');
    setImageFile(null);
    setFileURL(null)
  };

  return (
    <div className='create section__padding'>
      <div className="create-container">
        <h1>Create Shop</h1>
        <p className='upload-file'>Upload File</p>
        <div className="upload-img-show">
          <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
          <img src={Image} alt="banner" />
          <p>Drag and Drop File</p>
        </div>
        <form className='writeForm' autoComplete='off' onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Upload</label>
            <input 
              type="file" 
              className='custom-file-input' 
              onChange={OnChangeFile}
            />
          </div>
          <div className="formGroup">
            <label>Name</label>
            <input 
              type="text" 
              placeholder='Item Name' 
              autoFocus={true} 
              value={shopName} 
              onChange={(event) => setshopName(event.target.value)} 
            />
          </div>
          {fileURL !== null && fileURL !== '' ? (
          <button type="submit" className='writeButton'>Create Item</button>)
          :(
            <button type="submit" className='' disabled>Create Item</button>
          )}

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

