import { ethers } from "ethers";
import stakingContractAbi from "../assets/ContractAbi/stakingContractAbi.json";
import stakingContractAddress from "../assets/ContractAddress/stakingContractAddress";

let signer: ethers.Signer | undefined;

declare global {
  interface Window {
    ethereum?: any;
    signer?: any;
  }
}

export const getSigner = async (): Promise<ethers.Signer | undefined> => {
  if (signer) {
    return signer;
  }

  try {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      return signer;
    } else {
      console.error(
        "MetaMask not detected. Please install MetaMask to use this application."
      );
      return undefined;
    }
  } catch (error) {
    console.error("Error getting signer:", error);
    return undefined;
  }
};

export const getStakingContract = async (): Promise<
  ethers.Contract | undefined
> => {
  const currentSigner = await getSigner();

  if (currentSigner) {
    return new ethers.Contract(
      stakingContractAddress,
      stakingContractAbi,
      currentSigner
    );
  } else {
    console.error("Could not get staking contract instance.");
    return undefined;
  }
};

export const stakeTokens = async (amount: number) => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      const transaction = await stakingContract.stake(amount);
      await transaction.wait();
      console.log(`Successfully staked ${amount} tokens!`);
    } catch (error) {
      console.error("Error staking tokens:", error);
    }
  } else {
    console.error("Could not get staking contract instance.");
  }
};

export const unstakeTokens = async () => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      const transaction = await stakingContract.unstake();
      await transaction.wait();
      console.log("Successfully unstaked tokens!");
    } catch (error) {
      console.error("Error unstaking tokens:", error);
    }
  } else {
    console.error("Could not get staking contract instance.");
  }
};
export const claimRewards = async () => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      const transaction = await stakingContract.claimRewards();
      await transaction.wait();
      console.log("Successfully claimed rewards!");
    } catch (error) {
      console.error("Error claiming rewards:", error);
    }
  } else {
    console.error("Could not get staking contract instance.");
  }
};
export const getStakingDetails = async (): Promise<any> => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      return await stakingContract.getDetails();
    } catch (error) {
      console.error("Error getting staking details:", error);
      return null;
    }
  } else {
    console.error("Could not get staking contract instance.");
    return null;
  }
};

export const getStakerInfo = async (stakerAddress: string): Promise<any> => {
  const stakingContract = await getStakingContract();
  if (stakingContract) {
    try {
      return await stakingContract.getStakerInfo(stakerAddress);
    } catch (error) {
      console.error("Error getting staker info:", error);
      return null;
    }
  } else {
    console.error("Could not get staking contract instance.");
    return null;
  }
};
