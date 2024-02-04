// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract Shop is ReentrancyGuard {
    //----Errors----//
    error notOwner();

    error itemNotListed();

    //----Events----//
    event ownerOpenedShop();
    event ownerClosedShop();

    event itemAdded(
        uint indexed id,
        string name,
        string description,
        uint price
    );
    event itemDeleted(uint indexed id);

    event itemUnlisted(uint indexed id);

    //Storage variables
    address public s_owner;
    bool public s_isOpen;

    constructor() {
        s_owner = msg.sender;
        s_isOpen = true;
    }

    struct Item {
        string name;
        string description;
        uint256 price;
        bool listed;
    }

    /*@dev Different items in our shop recognized by unique uint id */
    mapping(uint => Item) private items;

    /*@dev Only the owner has access to the function */
    modifier onlyOwner() {
        if (msg.sender != s_owner) {
            revert notOwner();
        }
        _;
    }

    /*@dev function requires item to be listed in order to pass through*/
    modifier isListed(uint _id) {
        if (items[_id].listed == false) {
            revert itemNotListed();
        }
        _;
    }

    /*@dev button opens shop*/
    function openShop() private onlyOwner nonReentrant {
        emit ownerOpenedShop();
        s_isOpen = true;
    }

    /*@dev button opens shop*/
    function closeShop() private onlyOwner nonReentrant {
        emit ownerClosedShop();
        s_isOpen = false;
    }

    /*@dev button adds item to shop*/
    function addItem(
        uint _id,
        string memory _name,
        string memory _description,
        uint256 _price
    ) private onlyOwner nonReentrant {
        require(items[_id].price == 0, "Item with the same id exists");
        emit itemAdded(_id, _name, _description, _price);
        items[_id] = Item(_name, _description, _price, true);
    }

    /*@dev button deletes item from shop*/
    function deleteItem(uint _id) private onlyOwner nonReentrant {
        require(items[_id].price != 0, "Item with that ID doesn't exist");
        emit itemDeleted(_id);
        delete items[_id];
    }

    /*@dev button unlists item from shop until it becomes available*/
    function unlistItem(uint _id) private onlyOwner nonReentrant {
        require(items[_id].price != 0, "Item with that ID doesn't exist");
        emit itemUnlisted(_id);
        items[_id].listed = false;
    }

    /*@dev Users use this button to buy an item from the shop*/
    function buyItem(uint _id) external payable isListed(_id) {
        require(s_isOpen, "Shop is not open");
        require(msg.value >= items[_id].price, "Insufficient funds");
        require(msg.sender != s_owner, "Shop owner cannot buy their own item");

        //transfer happens via escrow contract (WILL MAKE THIS!!)
    }

    /*@dev Users use this button to buy an item from the shop*/
    function hireItem(uint _id) external view isListed(_id) {
        require(s_isOpen, "Shop is not open");

        //perform hiring via escrow contract
    }
}

/*@dev This Escrow contract holds the funds until the buyer confirms receipt and satisfaction, at which point the funds are released to the seller. */
contract EscrowService {
    event buyerPaid(address indexed buyer, uint indexed amountPaid);
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
        require(currentState == State.AWAITING_PAYMENT, "Buyer has alr paid");

        //msg.value should be >= to our item's price. Inherited from the other contract
        emit buyerPaid(msg.sender, msg.value);
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
