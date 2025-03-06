import React, { useState, useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'
import { User } from '../types/models';
import { updateUser, getUsers } from '../firebase/db';
import { sortUsersByLastFikaDate } from '../utils/dateHelpers';
import { Modal, Box, Typography } from '@mui/material';

interface WheelComponentProps {
  onRefresh: () => Promise<void>;
  setIsSpinning: (isSpinning: boolean) => void;
  isSpinning: boolean;
}

type WheelData = {
  option: string;
  optionSize: number;
  fontFamily: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

const WheelComponent: React.FC<WheelComponentProps> = ({ onRefresh, setIsSpinning, isSpinning }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [winner, setWinner] = useState<User | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      let users = await getUsers();
      users = users.filter((user: User) => user.active);
 
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
      setUsers(shuffledUsers);
    };
    fetchUsers();
  }, []);

  const [wheelState, setWheelState] = useState({
    mustSpin: false,
    isSpinning: false,
    prizeNumber: 0
  });
  const [data, setData] = useState<WheelData[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const COLORS = ['#ffb3ba', '#baffc9', '#bae1ff', '#ffffba', '#e2baff', '#ffd8ba', '#ffb3e6', '#deb887', '#d3d3d3', '#f8f9fa', '#ffffff'];
  const SPIN_DURATION = import.meta.env.VITE_SPIN_DURATION || 1;

  useEffect(() => {
    const maxFika = Math.max(...users.map(user => user.fikaCount ?? 0));
    
    const wheelData: WheelData[] = users.map((user, index) => ({
      fontFamily: 'Arial',
      option: user.nickname,
      optionSize: maxFika - (user.fikaCount ?? 0) + 1, 
      style: { backgroundColor: COLORS[index % COLORS.length], textColor: 'black' }
    }));
    setData(wheelData);
  }, [users]);

  const buttonStyles = {
    marginTop: '20px',
    marginBottom: '20px',
    padding: '60px 120px',
    fontSize: '64px',
    backgroundColor: '#1a237e',
    color: '#E3F2FD',
    border: 'none',
    borderRadius: '32px',
    cursor: 'pointer',
    boxShadow: '0 12px 32px rgba(13, 71, 161, 0.6)',
    background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
    textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
  } as const;

  const updateFikaHost = async (nextFikaHost: User) => {
    const updatedUser = {
      ...nextFikaHost,
      lastFikaDate: new Date(),
      fikaCount: (nextFikaHost.fikaCount || 0) + 1
    };
    
    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to update fika host:', error);
    }
  }

  const startSpin = () => {
    setIsSpinning(true);

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setWheelState(prev => ({ ...prev, prizeNumber: newPrizeNumber, mustSpin: true }));
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    p: 6,
    borderRadius: 4,
    textAlign: 'center',
    border: '2px solid #1a237e',
  };

  const handleStopSpinning = async () => {
    setWheelState(prev => ({ ...prev, isSpinning: true, mustSpin: false }));
    const winningOption = data[wheelState.prizeNumber].option;
    const nextFikaHost = users.find(user => user.nickname === winningOption) || null;

    setWinner(nextFikaHost);
    const lastThreFikaHosts = sortUsersByLastFikaDate(users, 5);
    if (lastThreFikaHosts.find(user => user.nickname === nextFikaHost?.nickname)) {
      console.log('User is already in the last three fika hosts');
      setOpenModal(true);
      return;
    }
    if (!nextFikaHost) return;

    updateFikaHost(nextFikaHost);
    setWheelState(prev => ({ ...prev, isSpinning: false }));

    await onRefresh();
    setIsSpinning(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <style>
        {`
          .sc-gsTCUz.bhdLno {
            max-width: 800px !important;
            max-height: 800px !important;
          }
        `}
      </style>
      {data.length > 0 && (
            <Wheel
              innerRadius={10}
              mustStartSpinning={wheelState.mustSpin}
              prizeNumber={wheelState.prizeNumber}
              data={data}
              onStopSpinning={handleStopSpinning}
              spinDuration={SPIN_DURATION}
              innerBorderWidth={1}
              backgroundColors={['#3e3e3e', '#df3428']} 
              textColors={['#ffffff']}
              pointerProps={{
                style: {
                  width: '121px',
                  height: '121px',
                  backgroundColor: 'blue',
                  clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                  transform: 'translateY(50%) rotate(135deg)',
                  zIndex: 2
                }
              }}
            />
          )}
        <div>
          
            {!isSpinning && (
              <button 
                style={buttonStyles}
                disabled={wheelState.isSpinning}
                onClick={startSpin}
              >
                SPINN THE WHEEL
              </button>
            )}
        </div>

      <Modal
        open={openModal}
        onClose={() => window.location.reload()}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography 
            id="modal-title" 
            variant="h4" 
            component="h2" 
            sx={{
              color: '#1a237e',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Oops! 
          </Typography>
          <Typography 
            id="modal-description" 
            sx={{ 
              mt: 2,
              fontSize: '1.2rem',
              color: '#333'
            }}
          >
            {winner?.nickname} was recently the fika host.
          </Typography>       
          <Typography 
            sx={{ 
              mt: 3,
              fontSize: '1.4rem',
              color: '#1a237e',
              fontWeight: 'bold'
            }}
          >
            Spin again! 🎲
          </Typography>
        </Box>
      </Modal>

    </div>
  );
};

export default WheelComponent;