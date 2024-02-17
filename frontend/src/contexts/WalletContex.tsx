import React, { createContext, useContext, useEffect, useState,type PropsWithChildren } from 'react';
import { ethers } from 'ethers';
import contracAbi from '../contractJson/ExchangeSite.json';

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


    useEffect(() => {
        const connectWallet = async () => {

            const contractAddress = "0xd7B8381C9683dB3E7Ca2405cdC2246c82825c51d";
            const contractABI = contracAbi.abi;

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
        const contractAddress = "0xd7B8381C9683dB3E7Ca2405cdC2246c82825c51d";
        const contractABI = contracAbi.abi;

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
        signer
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
