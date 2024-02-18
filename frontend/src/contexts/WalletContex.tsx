import React, { createContext, useContext, useEffect, useState,type PropsWithChildren } from 'react';
import { ethers } from 'ethers';
import contracAbi from '../contractJson/ExchangeSite.json';
import escrowAbi from '../contractJson/EscrowService.json'

declare global {
    interface Window {
      ethereum: any
    }
  }

// Define a context
interface WalletContextType {
    provider: ethers.providers.Web3Provider | null;
    account: string[] | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    contract:ethers.Contract | null;
    signer:any;
    escrowContract:ethers.Contract | null;
    
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
    children: React.ReactNode;
  }
  

// Define a provider component that will wrap your app
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string[] | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [signer, setSigner] = useState<any>(null);
    const [escrowContract, setEscrowContract] = useState<ethers.Contract | null>(null);


    useEffect(() => {
        const connectWallet = async () => {

            const contractAddress = "0x8A76d58B8F700A32eCDCFBdcAfCbF5E57909EB67";
            const contractABI = contracAbi.abi;

            const escrowContractAddress = "0x0C8577AFf85fBB7d977679FBdeD63258Cf4Cda5b";
            const escrowContractABI = escrowAbi.abi;



            try {
                const {ethereum} = window;


                if (window.ethereum) {
                    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(newProvider);

                    const account = await ethereum.request({
                        method:'eth_requestAccounts'
                      });
            
                    setAccount(account);

                    const signer = newProvider.getSigner();

                    setSigner(signer);
  
                    const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                    );
                    //console.log(contract);
                    setContract(contract);

                    const escrowContract = new ethers.Contract(
                        escrowContractAddress,
                        escrowContractABI,
                        signer
                        );
                        //console.log(contract);
                    setEscrowContract(escrowContract);

                } else {
                    console.error("MetaMask not detected");
                }
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        };

        connectWallet();
    }, []);

    const connectWallet = async () => {
        const contractAddress = "0x8A76d58B8F700A32eCDCFBdcAfCbF5E57909EB67";
        const contractABI = contracAbi.abi;

        const escrowContractAddress = "0x0C8577AFf85fBB7d977679FBdeD63258Cf4Cda5b";
        const escrowContractABI = escrowAbi.abi;

        try {
            const {ethereum} = window;


            if (window.ethereum) {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(newProvider);

                const account = await ethereum.request({
                    method:'eth_requestAccounts'
                  });
        
                setAccount(account);

                const signer = newProvider.getSigner();

                setSigner(signer);

                const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
                );

                //console.log(contract);

                setContract(contract);

                const escrowContract = new ethers.Contract(
                    escrowContractAddress,
                    escrowContractABI,
                    signer
                    );
                    //console.log(contract);
                setEscrowContract(escrowContract);

            } else {
                console.error("MetaMask not detected");
            }
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    const contextValue: WalletContextType = {
        provider,
        account,
        connectWallet,
        disconnectWallet,
        contract,
        signer,
        escrowContract
    };

    return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};

// Define a custom hook to use the wallet context
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
