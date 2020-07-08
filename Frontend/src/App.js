import React from 'react'
import './App.scss'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import { AuthProvider } from './Context/AuthContext'
import Main from './Components/Main'
import { MainTheme } from './Utils/Theme'
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MuiThemeProvider theme={MainTheme}>
          <div className="App">
            <Main />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
