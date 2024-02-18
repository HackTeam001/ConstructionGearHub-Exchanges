export function formatEthereumAddress(address: string): string {
    try{
        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum address');
        }
    
        const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        return formattedAddress;
    }catch(e){
        console.log(e)
    }

}

