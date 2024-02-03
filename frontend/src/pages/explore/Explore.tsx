import React from 'react';
import {Gears, ItemList } from '../../components'


const Explore = () => {

  const items = [
    "Excavator",
    "Bulldozer",
    "Crane",
    "Backhoe Loader",
    "Dump Truck",
    "Concrete Mixer",
    "Skid Steer Loader",
    "Compactor",
    "Tower Crane",
    "Scaffolding",
    "Safety Gear",
    "Harnesses and Lanyards",
    "Power Tools",
    "Hand Tools",
    "Protective Clothing",
    "Measuring Tools",
    "Heavy-Duty Gloves",
    "Safety Signs and Barricades",
    "First Aid Kits",
    "Fire Extinguishers"
 
  ];

  console.log(items)
  return <div>
   <ItemList items={items}/>
   <Gears title="Top Items"  />
  </div>;
};

export default Explore;
