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
import "../App.css";
const StakingComponent: React.FC = () => {
  // State for user input and contract data
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [stakingDetails, setStakingDetails] = useState<any | null>(null);
  const [stakerInfo, setStakerInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showStakingDetails, setShowStakingDetails] = useState(false);
  const [showStakerInfo, setShowStakerInfo] = useState(false);

  // Function to handle staking tokens
  const handleStake = async () => {
    setLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      if (signer) {
        await stakeTokens(stakeAmount);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
      // Display error using window.alert
      window.alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle unstaking tokens
  const handleUnstake = async () => {
    setLoading(true);
    setError(null);
    try {
      await unstakeTokens();
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle claiming rewards
  const handleClaimRewards = async () => {
    setLoading(true);
    setError(null);
    try {
      await claimRewards();
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and set staking contract details
  const handleGetDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const details = await getStakingDetails();
      setStakingDetails(details);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and set staker information
  const handleGetStakerInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      if (signer) {
        const stakerAddress = await signer.getAddress();
        const info = await getStakerInfo(stakerAddress);
        setStakerInfo(info);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch initial data on component mount
  useEffect(() => {
    handleGetDetails();
    handleGetStakerInfo();
  }, []);

  // toggle for staking details

  const toggleStakingDetails = () => {
    setShowStakingDetails(!showStakingDetails);
  };

  const toggleStakerInfo = () => {
    setShowStakerInfo(!showStakerInfo);
    handleGetStakerInfo();
  };
  // Render UI components
  return (
    <div className="StakingConponent">
      <h2>{loading ? <div className="loader"></div> : "Staking Component"}</h2>
      <div className="StackInput">
        <input
          type="number"
          value={stakeAmount}
          placeholder="Stake Amount"
          onChange={(e) => {
            const inputValue = Number(e.target.value);
            if (inputValue > 0) {
              setStakeAmount(inputValue);
            } else {
              setStakeAmount(0);
            }
          }}
        />
        <button onClick={handleStake} disabled={loading}>
          Stake
        </button>
      </div>
      <button className="ProcessBtn" onClick={handleUnstake} disabled={loading}>
        Unstake
      </button>
      <button
        className="ProcessBtn"
        onClick={handleClaimRewards}
        disabled={loading}
      >
        Claim Rewards
      </button>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <div>
        <h3 onClick={toggleStakingDetails} style={{ cursor: "pointer" }}>
          Staking Details:
        </h3>
        {showStakingDetails && (
          <>
            {stakingDetails && (
              <ul className="StakingDetails">
                <li>
                  Is Paused: <span> {stakingDetails.isPaused.toString()}</span>
                </li>
                <li>
                  Reset Claim Delay:{" "}
                  <span> {stakingDetails.resetClaimDelay.toString()}</span>
                </li>
                <li>
                  Stake Token: <span> {stakingDetails.stakeToken}</span>
                </li>
                <li>
                  Reward Token: <span> {stakingDetails.rewardToken}</span>
                </li>
                <li>
                  Start Block:{" "}
                  <span> {stakingDetails.startBlock.toString()}</span>
                </li>
                <li>
                  End Block: <span> {stakingDetails.endBlock.toString()}</span>
                </li>
                <li>
                  Claim Delay:{" "}
                  <span> {stakingDetails.claimDelay.toString()}</span>
                </li>
                <li>
                  Total Rewards:{" "}
                  <span> {stakingDetails.totalRewards.toString()}</span>
                </li>
                <li>
                  Total Funds Staked:{" "}
                  <span> {stakingDetails.totalFundsStaked.toString()}</span>
                </li>
                <li>
                  Total Rewards Distributed:{" "}
                  <span>
                    {" "}
                    {stakingDetails.totalRewardsDistributed.toString()}
                  </span>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
      <div>
        <h3 onClick={toggleStakerInfo} style={{ cursor: "pointer" }}>
          Staker Info:
        </h3>
        {showStakerInfo && (
          <>
            {stakerInfo && (
              <ul className="StakingDetails">
                <li>
                  Exist: <span> {stakerInfo.exist.toString()}</span>
                </li>
                <li>
                  Staked Amount:{" "}
                  <span> {stakerInfo.stakedAmount.toString()}</span>
                </li>
                <li>
                  Unclaimed Rewards:{" "}
                  <span> {stakerInfo.unclaimedRewards.toString()}</span>
                </li>
                <li>
                  Claim Checkpoint:{" "}
                  <span> {stakerInfo.claimCheckpoint.toString()}</span>
                </li>
                <li>
                  Total Rewards Claimed:{" "}
                  <span> {stakerInfo.totalRewardsClaimed.toString()}</span>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StakingComponent;
