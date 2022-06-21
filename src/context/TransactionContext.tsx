import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { conntractAddress, contractABI } from "../utils/contants";

export const TransactionContext = React.createContext<{
  connectWallet: () => void;
  currentAccount: string;
  formData: {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      addressTo: string;
      amount: string;
      keyword: string;
      message: string;
    }>
  >;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => void;
  isLoading: boolean;
  transactions: any;
}>({
  connectWallet: () => {},
  currentAccount: "",
  formData: {
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  },
  setFormData: () => {},
  handleChange: () => {},
  sendTransaction: () => {},
  isLoading: false,
  transactions: [],
});

const { ethereum } = window as any;

const getEtherumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    conntractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }: any) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || 0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please connect to Metamask");
      const transactionContract = getEtherumContract();
      const transactions = await transactionContract.getAllTransactions();
      const structuredTransactions = transactions.map((transaction: any) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(
          transaction.timestamp.toNumber() * 1000
        ).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / 10 ** 18,
      }));

      console.log(structuredTransactions);

      setTransactions(structuredTransactions);
      console.log(transactions);
    } catch (error) {}
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please Install Metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        alert("Please Connect Wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEtherumContract();
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("no etherum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please Install Metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("no etherum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEtherumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 2100 GWEI
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading: ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success: ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);

      throw new Error("no etherum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        isLoading,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
