import React,{ useState} from 'react'
import './navbar.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png'
import {  Link } from "react-router-dom";
import { useWallet } from '../../contexts/WalletContex';

const Menu:React.FC = () => (
  <>
     <Link to="/items"> <p>Explore</p> </Link>
     <Link to="/my-items"> <p> My Items</p> </Link>
  </>
 )

 const Navbar = () => {
  const { provider, account, connectWallet, disconnectWallet } = useWallet();


  const [toggleMenu,setToggleMenu] = useState(false)
   const [user,setUser] = useState(false)
   

  const handleLogout = () => {
    setUser(false);
  }
  const handleLogin = () => {
    setUser(true);
  }

  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/"> 
            <h1>Construction Gear Hub</h1>
          </Link>
        </div>
        <div className="navbar-links_container">
          <input type="text" placeholder='Search Item Here' autoFocus={true} />
         <Menu />
        </div>
      </div>
      <div className="navbar-sign">

        {/* <>
         <Link to="/create"> 
          <button type='button' className='primary-btn' >Create</button>
        </Link>
        <button type='button' className='secondary-btn'>Connect</button>
        </> */}
        {account ? (
                        <>
                            {/* <p>Connected Account: {account}</p> */}
                            <button type='button' onClick={disconnectWallet} className='secondary-btn'>Disconnect Wallet</button>
                        </>
                    ) : (
                        <button type='button' onClick={connectWallet} className='primary-btn'>Connect Wallet</button>
        )}
       
      </div>
      <div className="navbar-menu">
      </div>
    </div>
  )
}

export default Navbar
