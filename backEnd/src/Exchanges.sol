//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

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
    event itemDeleted(uint indexed shopID);

    event itemUnlisted(uint indexed shopID);

    //Storage variables
    address private s_owner;
    address[] public shopOwners;

    Shop[] public s_shops;
    bool public s_isOpen;

    uint private shopID;
    uint public s_itemID;

    mapping(address => Shop) s_availableShops;
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
        shopID++;
        Shop memory newShop = Shop(msg.sender, _name, shopID, true);
        s_availableShops[msg.sender] = newShop;
        shopOwners.push(msg.sender);
        //not sure but shop should have items
        items;
    }

    /*@dev button opens shop*/
    function closeShop(
        uint _shopID
    ) private onlyOwner shopExists(_shopID) nonReentrant {
        emit ownerClosedShop();
        s_availableShops[msg.sender].isOpen = false;
    }

    function foreverCloseShop(uint _shopID) private onlyOwner {}

    /*@dev button adds item to shop*/
    function addItem(
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
    }

    /*@dev button deletes item from shop*/
    function deleteItem(
        uint _itemID
    ) private onlyOwner itemExists(_itemID) nonReentrant {
        emit itemDeleted(_itemID);
        delete items[_itemID];
    }

    /*@dev button unlists item from shop until it becomes available*/
    function unlistItem(
        uint _itemID
    ) private onlyOwner itemExists(_itemID) nonReentrant {
        emit itemUnlisted(_itemID);
        items[_itemID].listed = false;
    }

    /*@dev Users use this button to buy an item from the shop*/
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

/*@dev This Escrow contract holds the funds until the buyer confirms receipt and satisfaction, at which point the funds are released to the seller. */
contract EscrowService {
    event buyerPashopID(address indexed buyer, uint indexed amountPashopID);
    event sellerGetsFundsAfterBuyerConfirmsDelivery(
        address indexed buyer,
        uint indexed amountSent
    );

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETED_TX
    }

    State private currentState;

    address private buyer;
    address private arbitrator;
    address payable private seller;

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
    mapping(address => buyerDetails) buyerCompleteDetails;
    mapping(address => arbitratorDetails) arbitratorCompleteDetails;
    mapping(address => sellerDetails) sellerCompleteDetails;

    constructor(address _buyer, address _arbitrator, address payable _seller) {
        currentState = State.AWAITING_PAYMENT;
        buyer = _buyer;
        seller = _seller;
        arbitrator = _arbitrator;
    }

    function depositToThisContract() private {
        require(msg.sender == buyer, "Address depositing is not buyer");
        require(
            currentState == State.AWAITING_PAYMENT,
            "Buyer has alr pashopID"
        );

        //msg.value should be >= to our item's price. Inherited from the other contract
        emit buyerPashopID(msg.sender, msg.value);
        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() private {
        require(msg.sender == buyer, "Address confirming is not buyer");
        require(
            currentState == State.AWAITING_DELIVERY,
            "Buyer has alr gotten item"
        );
        emit sellerGetsFundsAfterBuyerConfirmsDelivery(msg.sender, msg.value);
        seller.transfer(address(this).balance);
        currentState = State.COMPLETED_TX;
    }

    function refundFundsbySeller() private {
        //
    }

    function getCurrentState() public view returns (State) {
        return currentState;
    }
}
