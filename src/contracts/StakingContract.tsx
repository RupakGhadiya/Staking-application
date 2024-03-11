import { ethers } from "ethers";
import stakingContractAbi from "../assets/ContractAbi/stakingContractAbi.json";
import stakingContractAddress from "../assets/ContractAddress/stakingContractAddress";

// Declare a global window variable for Ethereum-related objects
let signer: ethers.Signer | undefined;

declare global {
  interface Window {
    ethereum?: any;
    signer?: any;
  }
}

// Function to get the Ethereum signer for transactions
export const getSigner = async (): Promise<ethers.Signer | undefined> => {
  // Check if the signer is already available
  if (signer) {
    return signer;
  }

  try {
    // Check if MetaMask is installed and available
    if (window.ethereum) {
      // Request user account access from MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Create a provider and signer using the MetaMask provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      return signer;
    } else {
      // MetaMask not detected, display an error message
      console.error(
        "MetaMask not detected. Please install MetaMask to use this application."
      );
      return undefined;
    }
  } catch (error) {
    // Handle errors while getting the signer
    console.error("Error getting signer:", error);
    return undefined;
  }
};

// Function to get the staking contract instance
export const getStakingContract = async (): Promise<ethers.Contract | undefined> => {
  // Get the current signer
  const currentSigner = await getSigner();

  if (currentSigner) {
    // Create and return a staking contract instance using the current signer
    return new ethers.Contract(
      stakingContractAddress,
      stakingContractAbi,
      currentSigner
    );
  } else {
    // Display an error message if the signer is not available
    console.error("Could not get staking contract instance.");
    return undefined;
  }
};

// Function to stake tokens
export const stakeTokens = async (amount: number) => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      // Stake tokens and wait for the transaction to be confirmed
      const transaction = await stakingContract.stake(amount);
      await transaction.wait();
      console.log(`Successfully staked ${amount} tokens!`);
    } catch (error) {
      // Handle errors while staking tokens
      console.error("Error staking tokens:", error);
    }
  } else {
    // Display an error message if the staking contract instance is not available
    console.error("Could not get staking contract instance.");
  }
};

// Function to unstake tokens
export const unstakeTokens = async () => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      // Unstake tokens and wait for the transaction to be confirmed
      const transaction = await stakingContract.unstake();
      await transaction.wait();
      console.log("Successfully unstaked tokens!");
    } catch (error) {
      // Handle errors while unstaking tokens
      console.error("Error unstaking tokens:", error);
    }
  } else {
    // Display an error message if the staking contract instance is not available
    console.error("Could not get staking contract instance.");
  }
};

// Function to claim rewards
export const claimRewards = async () => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      // Claim rewards and wait for the transaction to be confirmed
      const transaction = await stakingContract.claimRewards();
      await transaction.wait();
      console.log("Successfully claimed rewards!");
    } catch (error) {
      // Handle errors while claiming rewards
      console.error("Error claiming rewards:", error);
    }
  } else {
    // Display an error message if the staking contract instance is not available
    console.error("Could not get staking contract instance.");
  }
};

// Function to get staking details
export const getStakingDetails = async (): Promise<any> => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      // Get staking details
      return await stakingContract.getDetails();
    } catch (error) {
      // Handle errors while getting staking details
      console.error("Error getting staking details:", error);
      return null;
    }
  } else {
    // Display an error message if the staking contract instance is not available
    console.error("Could not get staking contract instance.");
    return null;
  }
};

// Function to get staker information
export const getStakerInfo = async (stakerAddress: string): Promise<any> => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      // Get staker information
      return await stakingContract.getStakerInfo(stakerAddress);
    } catch (error) {
      // Handle errors while getting staker information
      console.error("Error getting staker info:", error);
      return null;
    }
  } else {
    // Display an error message if the staking contract instance is not available
    console.error("Could not get staking contract instance.");
    return null;
  }
};
