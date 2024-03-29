import './App.css';
import {Navbar,Footer} from './components'
import {Home,Profile,Item, Create,Login,Register,Explore,CreateShop,MyItems,CreateItem,Transaction} from './pages'
import { Routes, Route } from "react-router-dom";


function App() {

  return (
    <div>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path=":item/:id" element={<Item />} />
            <Route path="/create" element={<Create /> } />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={ <Login />} />
            <Route path="/register" element={ <Register />} />
            <Route path='/items' element= {<Explore />} />
            <Route path='/create-shop' element= {<CreateShop />} />
            <Route path='/my-items' element= {<MyItems />} />
            <Route path="/my-items/shop/:id" element={<CreateItem />} />
            <Route path='/transactions' element= {<Transaction />} />
          </Routes>
      <Footer />
    </div>
  );
}

export default App;
