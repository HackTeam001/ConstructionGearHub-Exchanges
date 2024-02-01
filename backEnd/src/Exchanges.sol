// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Shop {
    //----Errors----//
    error notOwner();

    error itemNotListed();

    //----Events----//
    event itemAdded(uint indexed id, string name, string description, uint price);

    event itemDeleted(uint indexed id);

    event itemUnlisted(uint indexed id);


    address public owner;
    bool public isOpen;

    constructor(){
        owner = msg.sender;
        isOpen = true;
    }

    struct Item{
        string name;
        string description;
        uint256 price;
        bool listed;
    }

    /*@dev Different items in our shop recognized by unique uint id */
    mapping (uint => Item) private items;


    /*@dev Only the owner has access to the function */
    modifier onlyOwner(){
        if(msg.sender != owner){
            revert notOwner();
        }
        _;
    }

    /*@dev function requires item to be listed in order to pass through*/
    modifier isListed(uint _id){
    if(items[_id].listed == false){
       revert itemNotListed();
    }
    _; 
    }

    /*@dev button opens shop*/
    function openShop() private onlyOwner{
        isOpen = true;
    }

    /*@dev button adds item to shop*/
    function addItem(uint _id, string memory _name, string memory _description, uint256 _price) private onlyOwner{
        items[_id] = Item(_name,_description,_price, true);
        emit itemAdded(_id, _name,_description,_price);
    }

    /*@dev button deletes item from shop*/
    function deleteItem(uint _id) private onlyOwner{
        delete items[_id];
        emit itemDeleted(_id);
    }

     /*@dev button unlists item from shop until it becomes available*/
     function unlistItem(uint _id) private onlyOwner{
        items[_id].listed = false;
        emit itemUnlisted(_id);
     }

       /*@dev Users use this button to buy an item at the shop*/
     function buyItem(uint _id) external payable isListed(_id){
        require(isOpen, "Shop is not open");
        require(msg.value >= items[_id].price, "Insufficient funds");
        require(msg.sender != owner, "Shop owner cannot buy their own item");

        //transfer happens via escrow contract (WILL MAKE THIS!!)
     }


}


 /*@dev This Escrow contract holds the funds until the buyer confirms receipt and satisfaction, at which point the funds are released to the seller. */
contract EscrowService{}
