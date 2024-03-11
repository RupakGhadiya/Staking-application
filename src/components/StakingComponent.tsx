// StakingComponent.tsx
import React, { useState, useEffect } from 'react';
import { stakeTokens, unstakeTokens, claimRewards, getDetails } from '../contracts/StakingContract';

const StakingComponent: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState<number>(0);

  useEffect(() => {
    
  }, []);

  const handleStake = async () => {
    const signer = await getSigner();
    if (signer) {
     
      await stakeTokens(signer, stakeAmount);
    }
  };

  const handleUnstake = async () => {
    const signer = await getSigner();
    if (signer) {
      
      await unstakeTokens(signer);
    }
  };

  const handleClaimRewards = async () => {
    const signer = await getSigner();
    if (signer) {
     
      await claimRewards(signer);
    }
  };

  const handleGetDetails = async () => {
    const details = await getDetails();
    console.log('Contract Details:', details);
  };

  return (
    <div>
      <h2>Staking Component</h2>
      <div>
        <label>Stake Amount:</label>
        <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} />
        <button onClick={handleStake}>Stake</button>
      </div>
      <button onClick={handleUnstake}>Unstake</button>
      <button onClick={handleClaimRewards}>Claim Rewards</button>
      <button onClick={handleGetDetails}>Get Contract Details</button>
    </div>
  );
};

export default StakingComponent;
