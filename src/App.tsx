import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';

function App() {
  const [cartItems, setCartItems] = useState({
    refrigerator: 0,
    washingMachine: 0,
    bulb: 0,
    oven: 0,
  });

  const totalCartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <TopBar cartCount={totalCartCount} />
        <Box sx={{ paddingTop: '124px' }}> {/* Reduced padding to eliminate white space */}
          <Home cartItems={cartItems} setCartItems={setCartItems} />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
