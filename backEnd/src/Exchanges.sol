//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/*@dev This Escrow contract holds the funds until the buyer confirms receipt and satisfaction, at which point the funds are released to the seller👇*/
contract EscrowService {
    event buyerPaid(address indexed buyer, uint indexed amountPaid);
    event sellerGetsFundsAfterBuyerConfirmsDelivery(
        address indexed buyer,
        uint indexed amountSent
    );

    event arbitratorPaid(address indexed arbitrator, uint indexed fees);

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETED_TX
    }

    State private currentState;

    address payable private buyer;
    address payable private arbitrator;
    address payable private seller;

    uint private itemPrice;
    uint private arbitratorFees; //Arbitrator gets 5% for handling the tx
    uint private finalPrice;

    mapping(address => uint) private balances;

    mapping(address => buyerDetails) buyerCompleteDetails;
    mapping(address => arbitratorDetails) arbitratorCompleteDetails;
    mapping(address => sellerDetails) sellerCompleteDetails;

    struct buyerDetails {
        string name;
        string location;
        string emailAddress;
        uint phoneNumber;
    }

    struct sellerDetails {
        string name;
        string location;
        string emailAddress;
        uint phoneNumber;
    }

    struct arbitratorDetails {
        string name;
        string location;
        string emailAddress;
        uint phoneNumber;
    }

    constructor(
        address payable _buyer,
        address payable _arbitrator,
        address payable _seller,
        uint _itemPrice
    ) payable {
        currentState = State.AWAITING_PAYMENT;
        buyer = _buyer;
        seller = _seller;
        arbitrator = _arbitrator;

        arbitratorFees = (_itemPrice * 4) / 100;
    }

    function itemFinalPrice() private returns (uint) {
        finalPrice = itemPrice - arbitratorFees;
        return finalPrice;
    }

    //NON REENTRANT MODIFIER NEEDED!!!!!
    function depositToThisContract() public payable {
        require(msg.sender == buyer, "Address depositing is not buyer");
        require(currentState == State.AWAITING_PAYMENT, "Buyer has alr Paid");
        require(msg.value == itemPrice, "Incorrect amount sent");

        // Increase the balance within the contract
        balances[address(this)] += itemPrice;

        // Decrease the sender's balance
        balances[msg.sender] -= itemPrice;

        emit buyerPaid(msg.sender, msg.value);
        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() internal {
        require(msg.sender == buyer, "Address confirming is not buyer");
        require(
            currentState == State.AWAITING_DELIVERY,
            "Buyer has alr gotten item"
        );

        emit sellerGetsFundsAfterBuyerConfirmsDelivery(msg.sender, finalPrice);
        seller.transfer(finalPrice);
        currentState = State.COMPLETED_TX;
    }

    function withdrawToArbitrator() internal {
        require(
            msg.sender == arbitrator,
            "Address confirming is not arbitrator"
        );
        require(
            currentState == State.COMPLETED_TX,
            "Transaction is ongoing. Buyer yet to confirm delivery"
        );

        emit arbitratorPaid(msg.sender, arbitratorFees);

        arbitrator.transfer(arbitratorFees);
    }

    function getCurrentState() public view returns (State) {
        return currentState;
    }

    function getBuyerDetails() private view returns (buyerDetails memory) {
        return buyerCompleteDetails[buyer];
    }

    function getArbitratorDetails()
        private
        view
        returns (arbitratorDetails memory)
    {
        return arbitratorCompleteDetails[arbitrator];
    }

    function getSellerDetails() private view returns (sellerDetails memory) {
        return sellerCompleteDetails[seller];
    }

    function getItemPrice() private view returns (uint) {
        return itemPrice;
    }

    function getArbitratorFees() private view returns (uint) {
        return arbitratorFees;
    }
}

//OUR INTERFACE 👇👇
interface IEscrow {
    function depositToThisContract() external payable;

    function confirmDelivery() external;

    function withdrawToArbitrator() external;

    function getCurrentState() external view returns (EscrowService.State);
}

//OUR MAIN CONTRACT 👇👇
contract ExchangeSite is ReentrancyGuard {
    //----Errors----//
    error notOwner();
    error shopDoesntExist();
    error itemNotListed();
    error itemDoesntExist();

    //----Events----//
    event ownerOpenedShop();
    event ownerClosedShop();

    event itemAdded(
        uint indexed shopID,
        string name,
        string description,
        uint price
    );
    event itemDeleted(uint shopID);

    event itemUnlisted(uint shopID);

    //Storage variables
    address private s_owner;

    Shop[] public s_shops;
    bool public s_isOpen;

    uint private shopID;
    uint public s_itemID;

    mapping(address => Shop) s_availableShops;
    mapping(uint => bool) private s_availableShopIDs;
    mapping(address => uint[]) public addressToShopIds;

    mapping(uint => Item[]) public shopIDToItems;
    mapping(uint => mapping(uint => uint)) public itemsIndex;
    /*@dev Different items in our shop recognized by unique uint shopID */
    mapping(uint => Item) private items;

    //used when searching for an item?
    mapping(string => Item) itemNames;

    constructor() {
        s_owner = msg.sender;
    }

    struct Shop {
        address shopAddress;
        string name;
        uint shopID;
        bool isOpen;
    }

    struct Item {
        string name;
        uint itemID;
        string description;
        uint256 price;
        bool listed;
    }

    /*@dev Only the owner has access to the function */
    modifier onlyOwner() {
        if (msg.sender != s_owner) {
            revert notOwner();
        }
        if (msg.sender == address(0)) {
            revert notOwner();
        }
        _;
    }

    modifier shopIsOpen(uint _shopID) {
        require(s_availableShops[msg.sender].isOpen == true, "Shop is closed");
        _;
    }

    modifier shopExists(uint _shopID) {
        if (s_availableShops[msg.sender].shopID != _shopID) {
            revert shopDoesntExist();
        }
        _;
    }

    /*@dev function requires item to be listed in order to pass through*/
    modifier isListed(uint _itemID) {
        if (items[_itemID].listed == false) {
            revert itemNotListed();
        }
        _;
    }

    modifier itemExists(uint _itemID) {
        if (items[_itemID].price == 0) {
            revert itemDoesntExist();
        }
        _;
    }

    /*@dev button opens shop*/
    function openShop(string memory _name) private onlyOwner nonReentrant {
        emit ownerOpenedShop();
        uint newShopID = shopID + 1;
        while (s_availableShopIDs[newShopID]) {
            newShopID++;
        }
        Shop memory newShop = Shop(msg.sender, _name, newShopID, true);
        s_availableShops[msg.sender] = newShop;

        // Add the new shop ID to the address's list of shop IDs to allow an address to open multiple shops without creating duplicate entries
        addressToShopIds[msg.sender].push(newShopID);

        // Initialize an empty array of items for the new shop
        shopIDToItems[newShopID] = new Item[](0);
    }

    /*@dev button opens shop*/
    function closeShop(
        uint _shopID
    ) private onlyOwner shopExists(_shopID) nonReentrant {
        emit ownerClosedShop();
        s_availableShops[msg.sender].isOpen = false;
        s_availableShopIDs[_shopID] = false;
    }

    function foreverCloseShop(uint _shopID) private onlyOwner {}

    /*@dev button adds item to shop*/
    function addItem(
        uint _shopID,
        string memory _name,
        string memory _description,
        uint256 _price
    ) private onlyOwner nonReentrant {
        require(items[s_itemID].price == 0, "Item with the same itemID exists");
        require(_price > 0, "Set item price");

        s_itemID++;
        emit itemAdded(s_itemID, _name, _description, _price);
        Item memory newItemAdded = Item(
            _name,
            s_itemID,
            _description,
            _price,
            true
        );
        items[s_itemID] = newItemAdded;

        // Add the new item to the shop's array of items
        shopIDToItems[_shopID].push(newItemAdded);

        // Store the index of the new item
        itemsIndex[_shopID][s_itemID] = shopIDToItems[_shopID].length - 1;
    }

    /*@dev button deletes item from shop*/
    function deleteItem(
        uint _shopID,
        uint _itemID
    ) private onlyOwner itemExists(_itemID) nonReentrant {
        emit itemDeleted(_itemID);
        delete items[_itemID];

        // Get the index of the item to delete
        uint index = itemsIndex[_shopID][_itemID];
        uint lastIndex = shopIDToItems[_shopID].length - 1;
        Item memory lastItem = shopIDToItems[_shopID][lastIndex];

        // Move the last item to the index of the item to delete
        shopIDToItems[_shopID][index] = lastItem;

        // Remove the last item
        shopIDToItems[_shopID].pop();

        // Update the index of the last item
        itemsIndex[_shopID][_itemID] = 0;
    }

    /*@dev button unlists item from shop until it becomes available*/
    function unlistItem(
        uint _itemID
    ) private onlyOwner itemExists(_itemID) nonReentrant {
        emit itemUnlisted(_itemID);
        items[_itemID].listed = false;
    }

    /*@dev Users use this button to buy an item from the shop. WILL Add no. of items to buy*/
    function buyItem(
        uint _itemID,
        uint _shopID
    ) external payable isListed(_itemID) shopIsOpen(_shopID) {
        require(msg.value == items[_itemID].price, "Insufficient funds");
        require(msg.sender != s_owner, "Shop owner cannot buy their own item");

        //transfer happens via escrow contract (WILL MAKE THIS!!)
    }

    /*@dev Users use this button to buy an item from the shop*/
    function hireItem(
        uint _itemID,
        uint _shopID
    ) external view isListed(_itemID) shopIsOpen(_shopID) {
        require(s_isOpen, "Shop is not open");

        //perform hiring via escrow contract
    }
}
