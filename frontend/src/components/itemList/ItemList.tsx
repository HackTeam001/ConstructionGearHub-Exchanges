

import React from 'react';
import './itemList.css'; // Import your CSS file

interface ItemListProps {
  items: string[]; // Assuming items is an array of strings
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {

    console.log(items)
  return (
    <div className='gears section__padding'>
        <div className="gears-container">
            <div className="equipment-container">
            <ul className="equipment-list">
                {items.map((item, index) => (
                <li key={index} className="equipment-item">
                    <a href="#" className="equipment-link">
                    {item}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        </div>
    </div>
  );
};

export default ItemList;
