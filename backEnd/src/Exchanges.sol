//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/*@dev This Escrow contract holds the funds until the buyer confirms receipt and satisfaction, at which point the funds are released to the seller👇*/
//🌟🌟🌟Our Escrow🌟🌟🌟//
contract EscrowService {
    event contractReceivesCash(address indexed from, uint indexed amountPaid);
    event buyerPaid(address indexed buyer, uint indexed amountPaid);
    event sellerGetsFundsAfterBuyerConfirmsDelivery(
        address indexed buyer,
        uint indexed amountSent
    );
    event sellerPaid(uint amount);

    event arbitratorPaid(uint amount);

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETED_TX
    }

    struct Transaction {
        address payable buyer;
        address payable arbitrator;
        address payable seller;
        uint itemPrice;
        uint arbitratorFees;
        uint finalPrice;
        State currentState;
    }

    mapping(address => Transaction) public transactions; //buyer to transaction

    constructor() {}

    modifier onlyBuyer() {
        require(
            msg.sender == transactions[msg.sender].buyer,
            "Only buyer can call this function"
        );
        _;
    }

    function createTransaction(
        address payable _buyer,
        address payable _arbitrator,
        address payable _seller,
        uint _itemPrice
    ) external payable {
        require(msg.value == _itemPrice, "Incorrect total amount sent");

        Transaction storage newTransaction = transactions[msg.sender];
        emit contractReceivesCash(msg.sender, msg.value);
        newTransaction.buyer = _buyer;
        newTransaction.arbitrator = _arbitrator;
        newTransaction.seller = _seller;
        newTransaction.itemPrice = _itemPrice;
        newTransaction.arbitratorFees = (_itemPrice * 4) / 100;
        newTransaction.finalPrice = _itemPrice - newTransaction.arbitratorFees;
        newTransaction.currentState = State.AWAITING_PAYMENT;
    }

    //NON REENTRANT MODIFIER NEEDED!??!!!
    function depositToThisContract() external payable onlyBuyer {
        Transaction storage transaction = transactions[msg.sender];
        require(
            transaction.currentState == State.AWAITING_PAYMENT,
            "Buyer has already paid"
        );
        require(msg.value == transaction.itemPrice, "Incorrect amount sent");

        emit buyerPaid(msg.sender, msg.value);
        transaction.currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() external onlyBuyer {
        Transaction storage transaction = transactions[msg.sender];
        require(
            transaction.currentState == State.AWAITING_DELIVERY,
            "Transaction is not in correct state"
        );

        emit sellerGetsFundsAfterBuyerConfirmsDelivery(
            msg.sender,
            transaction.finalPrice
        );
        emit sellerPaid(transaction.finalPrice);
        payable(transaction.seller).transfer(transaction.finalPrice);

        emit arbitratorPaid(transaction.arbitratorFees);
        payable(transaction.arbitrator).transfer(transaction.arbitratorFees);

        transaction.currentState = State.COMPLETED_TX;
    }

    function withdrawToArbitrator() external {
        require(
            msg.sender == transactions[msg.sender].arbitrator,
            "Address confirming is not arbitrator"
        );
        require(
            transactions[msg.sender].currentState == State.COMPLETED_TX,
            "Transaction is ongoing. Buyer yet to confirm delivery"
        );

        emit arbitratorPaid(transactions[msg.sender].arbitratorFees);
        transactions[msg.sender].arbitrator.transfer(
            transactions[msg.sender].arbitratorFees
        );
    }

    function getTransactionDetails()
        external
        view
        returns (Transaction memory)
    {
        return transactions[msg.sender];
    }
}

////////🌟🌟OUR INTERFACE 🌟🌟👇👇////////////
interface IEscrow {
    struct Transaction {
        address payable buyer;
        address payable arbitrator;
        address payable seller;
        uint itemPrice;
        uint arbitratorFees;
        uint finalPrice;
        EscrowService.State currentState;
    }

    function depositToThisContract() external payable;

    function confirmDelivery() external;

    function withdrawToArbitrator() external;

    function getTransactionDetails() external view returns (Transaction memory);
}

//OUR MAIN CONTRACT 👇👇
contract ExchangeSite is ReentrancyGuard {
    //----Errors----//
    error notOwner();
    error shopDoesntExist();
    error itemNotListed();
    error itemDoesntExist();

    //----Events----//
    event ownerOpenedShop(uint newShopID, string name);
    event ownerClosedShop();
    event ownerForeverClosedShop(uint _shopID);

    event itemAdded(
        uint indexed shopID,
        string name,
        string description,
        uint price
    );
    event itemDeleted(uint itemID);
    event itemUnlisted(uint itemID);

    event buyerBought(address buyer, uint value);

    IEscrow private escrowService;
    //Storage variables
    address public s_owner;

    Shop[] public s_shops;
    bool public s_isOpen;

    uint public shopID;
    uint public newShopID;
    uint public s_itemID;

    mapping(address => Shop) public s_availableShops;
    mapping(uint => bool) public s_availableShopIDs;
    mapping(address => uint[]) public addressToShopIds; //an address can have many shops

    mapping(uint => Item[]) public shopIDToItems; //shop with a list of all available items
    mapping(uint => mapping(uint => uint)) public itemsIndex;
    mapping(uint => Item) public items; //Different items in our shop recognized by unique uint shopID
    mapping(string => Item) public itemNames; //used when searching for an item? Every item with that name should show up

    constructor(address _escrow) {
        s_owner = msg.sender;
        escrowService = IEscrow(_escrow);
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

    /*@dev function that uses this requires item to be listed in order to pass through*/
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
    function openShop(string memory _name) external onlyOwner nonReentrant {
        require(
            s_availableShops[msg.sender].shopID == 0,
            "Shop already exists for this owner"
        );
        newShopID = shopID + 1;
        while (s_availableShopIDs[newShopID]) {
            newShopID++;
        }
        emit ownerOpenedShop(newShopID, _name);
        Shop memory newShop = Shop(msg.sender, _name, newShopID, true);
        s_availableShops[msg.sender] = newShop;

        // Add the new shop ID to the address's list of shop IDs to allow an address to open multiple shops without creating duplicate entries
        addressToShopIds[msg.sender].push(newShopID);

        // Initialize an empty array of items for the new shop
        shopIDToItems[newShopID] = new Item[](0);
    }

    /*@dev button closes shop*/
    function closeShop(
        uint _shopID
    ) external onlyOwner shopExists(_shopID) nonReentrant {
        emit ownerClosedShop();
        s_availableShops[msg.sender].isOpen = false;
    }

    /*@dev button forever closes shop, ceases to exist*/
    function foreverCloseShop(
        uint _shopID
    ) external onlyOwner shopExists(_shopID) {
        emit ownerForeverClosedShop(_shopID);
        delete s_availableShopIDs[_shopID];
        delete addressToShopIds[msg.sender][_shopID];
    }

    /*@dev button adds item to shop*/
    function addItem(
        uint _shopID,
        string memory _name,
        string memory _description,
        uint256 _price
    ) external onlyOwner nonReentrant {
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
    ) external onlyOwner itemExists(_itemID) nonReentrant {
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
    ) external onlyOwner itemExists(_itemID) nonReentrant {
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

        //transfer happens via escrow contract (CHECK THIS!!)
        emit buyerBought(msg.sender, msg.value);
        escrowService.depositToThisContract{value: msg.value}();
    }
}
