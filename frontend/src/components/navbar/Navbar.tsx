import React,{ useState} from 'react'
import './navbar.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png'
import {  Link } from "react-router-dom";
import { useWallet } from '../../contexts/WalletContex';

interface menuProps{
  account:string[];
}

const Menu:React.FC<menuProps> = ({account}) => (
  <>
     <Link to="/items"> <p>Explore</p> </Link>
     <Link to="/my-items"> <p> My Items</p> </Link>
    {account ? (
              <>
            <Link to="/create-shop"> 
              <p>Create Shop</p>
            </Link>
              </>
          ) : (
              <></>
        )}
        <Link to="/transactions"> <p> Transactions</p> </Link>
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
         <Menu account={account}/>
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
        {toggleMenu ? 
        <RiCloseLine  color="#fff" size={27} onClick={() => setToggleMenu(false)} /> 
        : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center" >
            <div className="navbar-menu_container-links">
             <Menu account={account} />
            </div>
            <div className="navbar-menu_container-links-sign">
            {account ? (
                        <>
                            {/* <p>Connected Account: {account}</p> */}
                            <button type='button' onClick={disconnectWallet} className='secondary-btn'>Disconnect Wallet</button>
                        </>
                    ) : (
                        <button type='button' onClick={connectWallet} className='primary-btn'>Connect Wallet</button>
        )}
            </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
