// StakingComponent.tsx
import React, { useState, useEffect } from "react";
import {
  getSigner,
  stakeTokens,
  unstakeTokens,
  claimRewards,
  getStakingDetails,
  getStakerInfo,
} from "../contracts/StakingContract";

const StakingComponent: React.FC = () => {
  // State for user input and contract data
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [stakingDetails, setStakingDetails] = useState<any | null>(null);
  const [stakerInfo, setStakerInfo] = useState<any | null>(null);

  // Function to handle staking tokens
  const handleStake = async () => {
    const signer = await getSigner();
    if (signer) {
      await stakeTokens(stakeAmount);
    }
  };

  // Function to handle unstaking tokens
  const handleUnstake = async () => {
    await unstakeTokens();
  };

  // Function to handle claiming rewards
  const handleClaimRewards = async () => {
    await claimRewards();
  };

  // Function to fetch and set staking contract details
  const handleGetDetails = async () => {
    const details = await getStakingDetails();
    setStakingDetails(details);
  };

  // Function to fetch and set staker information
  const handleGetStakerInfo = async () => {
    const signer = await getSigner();
    if (signer) {
      const stakerAddress = await signer.getAddress();
      const info = await getStakerInfo(stakerAddress);
      setStakerInfo(info);
    }
  };

  // useEffect hook to fetch initial data on component mount
  useEffect(() => {
    handleGetDetails();
    handleGetStakerInfo();
  }, []);

  // Render UI components
  return (
    <div>
      <h2>Staking Component</h2>
      <div>
        <label>Stake Amount:</label>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(Number(e.target.value))}
        />
        <button onClick={handleStake}>Stake</button>
      </div>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaimRewards}>Claim Rewards</button>
      <button onClick={handleGetDetails}>Get Details</button>
      <div>
        <h3>Staking Details:</h3>
        {stakingDetails && (
          <ul>
            <li>Is Paused: {stakingDetails.isPaused.toString()}</li>
            <li>
              Reset Claim Delay: {stakingDetails.resetClaimDelay.toString()}
            </li>
            <li>Stake Token: {stakingDetails.stakeToken}</li>
            <li>Reward Token: {stakingDetails.rewardToken}</li>
            <li>Start Block: {stakingDetails.startBlock.toString()}</li>
            <li>End Block: {stakingDetails.endBlock.toString()}</li>
            <li>Claim Delay: {stakingDetails.claimDelay.toString()}</li>
            <li>Total Rewards: {stakingDetails.totalRewards.toString()}</li>
            <li>
              Total Funds Staked: {stakingDetails.totalFundsStaked.toString()}
            </li>
            <li>
              Total Rewards Distributed:{" "}
              {stakingDetails.totalRewardsDistributed.toString()}
            </li>
          </ul>
        )}
      </div>
      <div>
        <h3>Staker Info:</h3>
        {stakerInfo && (
          <ul>
            <li>Exist: {stakerInfo.exist.toString()}</li>
            <li>Staked Amount: {stakerInfo.stakedAmount.toString()}</li>
            <li>Unclaimed Rewards: {stakerInfo.unclaimedRewards.toString()}</li>
            <li>Claim Checkpoint: {stakerInfo.claimCheckpoint.toString()}</li>
            <li>
              Total Rewards Claimed: {stakerInfo.totalRewardsClaimed.toString()}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default StakingComponent;
