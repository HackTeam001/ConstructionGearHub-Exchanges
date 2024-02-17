import React, { useState } from 'react';
import './create.css';
import Image from '../../assets/Image.png';
import { uploadToIPFS } from "../../Infura";


const Create = () => {
  const [itemName, setItemName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [fileURL, setFileURL] = useState<string | null>(null);


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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // You can perform any necessary actions here with the form data
    console.log('Item Name:', itemName);
    console.log('Image File:', imageFile);

    // Reset the form fields if needed
    setItemName('');
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
              value={itemName} 
              onChange={(event) => setItemName(event.target.value)} 
            />
          </div>
          {fileURL ? (
          <button type="submit" className='writeButton'>Create Item</button>)
          :(

            <button type="submit" className='writeButton' disabled>Create Item</button>
          )}

        </form>
      </div>
    </div>
  );
};

export default Create;

