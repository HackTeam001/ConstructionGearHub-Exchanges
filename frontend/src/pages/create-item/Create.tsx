import React, { useState } from 'react';
import './create.css';
import Image from '../../assets/Image.png';
import { useParams } from 'react-router-dom';

const CreateItem = () => {
  const { id } = useParams(); // Retrieve id from URL params
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a FormData object to send form data including the image file
    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('itemDescription', itemDescription);
    formData.append('itemPrice', itemPrice);
    formData.append('imageFile', imageFile);

    // You can send formData to your backend for processing
    console.log('Form Data:', formData);

    // Reset form fields
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setImageFile(null);
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
            <input 
              type="file" 
              className='custom-file-input' 
              onChange={handleImageChange} 
            />
          </div>
          <div className="formGroup">
            <label>Name</label>
            <input 
              type="text" 
              placeholder='Item Name' 
              autoFocus={true} 
              value={itemName} 
              onChange={(event) => setItemName(event.target.value)} 
            />
          </div>
          <div className="formGroup">
            <label>Description</label>
            <textarea 
              rows={4}
              placeholder='Description of your item'
              value={itemDescription}
              onChange={(event) => setItemDescription(event.target.value)}
            ></textarea>
          </div>
          <div className="formGroup">
            <label>Price</label>
            <div className="twoForm">
              <input 
                type="text" 
                placeholder='Price'
                value={itemPrice}
                onChange={(event) => setItemPrice(event.target.value)}
              />
              <select>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="LTC">LTC</option>
              </select>
            </div>
          </div>
          <button type="submit" className='writeButton'>Create Item</button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;

