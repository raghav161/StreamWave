import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const onhandleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleMicClick = () => {
    const micOnSound = new Audio('/mic_on.mp3');
    const micOffSound = new Audio('/mic_off.mp3');

    if (!isListening) {
      micOnSound.play();

      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);

        if (event.results[0].isFinal) {
          recognition.stop();
          setIsListening(false);
          setTimeout(() => {
            micOffSound.play();
          }, 500);
          navigate(`/search/${transcript}`);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognition.stop();
        setIsListening(false);
        micOffSound.play();
      };

      recognition.onend = () => {
        if(isListening){
          setIsListening(false);
          micOffSound.play();
        }
      };

      recognition.start();
    }
    else{
      setIsListening(false);
      micOffSound.play();
    }
  };

  return (
    <Paper
      component='form'
      onSubmit={onhandleSubmit}
      sx={{
        borderRadius: 20,
        border: '1px solid #e3e3e3',
        pl: 2,
        boxShadow: 'none',
        mr: { sm: 5 },
      }}
    >
      <input
        className='search-bar'
        placeholder='Search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton onClick={handleMicClick} sx={{ p: '10px', color: isListening ? 'green' : 'red' }} aria-label='mic'>
        <MicIcon />
      </IconButton>
      <IconButton type='submit' sx={{ p: '10px', color: 'red' }} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
