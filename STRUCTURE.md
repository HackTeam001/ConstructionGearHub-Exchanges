// Pseudocode

mapping(address => uint) shopBalance;

struct shopOwnerCapability {
    uint id; // shop owner id
    uint shopID;
}

struct item {
    uint id;
    string itemName;
    string itemDescription;
    string itemCategory;
    uint price;
    uint totalSupply;
    bool available;
}

mapping(uint => item) totalItemNames;

struct addItem {
    uint idShop;
    uint itemID;
}

struct unlistItem {
    uint idShop;
    uint itemID;
}

struct purchasedItem {
    uint itemID;
    uint shopID;
}

// SHOP OWNERS //

function createShop() {}
--emit event

function addItemToShop() {}
--emit event

function unlistItemFromShop() {}
--emit event

function rentOutItem() {}
function withdrawFundsFromShop() {}
--emit event

function sellItem() {}
--emit event

function closeShop() {}
--emit event

function withdrawFundsFromShop() {}
--emit event


// USERS //
function buyItem() {}
--emit event

function rentItem() {}
--emit event
  