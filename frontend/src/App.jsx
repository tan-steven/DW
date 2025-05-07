import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from "./layout/global/topbar";
import Sidebar from "./layout/global/sidebar";
import Dashboard from './layout/dashboard';
import Quotes from './layout/quotes/quotes';
import Invoices from './layout/invoices/invoice';

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          <Sidebar />
          <main className='content'>
            <Topbar />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/quotes' element={<Quotes />} />
              <Route path='/invoices' element={<Invoices />}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    
  )
}

export default App