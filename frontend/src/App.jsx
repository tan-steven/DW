import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from "./layout/global/topbar";
import Sidebar from "./layout/global/sidebar";
import Dashboard from './layout/dashboard';
import Quotes from './layout/quotes/quotes';
import Invoices from './layout/invoices/invoice';
import Orders from './layout/orders/order';
import CustomerPage from './layout/customers/customer';
import PrintQuote from './layout/quotes/PrintQuote';
import LoginPage from './layout/login/loginPage';

const App = () => {
  const [theme, colorMode] = useMode();
  const token = localStorage.getItem('token');

  const isAuthenticated = !!token;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          {isAuthenticated && <Sidebar />}
          <main className='content'>
            {isAuthenticated && <Topbar />}
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="*" element={<LoginPage />} />
                </>
              ) : (
                <>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/quotes' element={<Quotes />} />
                  <Route path='/orders' element={<Orders />} />
                  <Route path='/invoices' element={<Invoices />} />
                  <Route path="/customers" element={<CustomerPage />} />
                  <Route path="/print-quote/:quote_no" element={<PrintQuote />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
