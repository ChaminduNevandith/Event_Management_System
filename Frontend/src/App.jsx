import { BrowserRouter,Routes,Route } from 'react-router-dom';
import EventDetails from './Pages/EventDetails/EventDetails';
import AddEvent from './Pages/AddEvent/AddEvent';
import BuyTicket from './Pages/BuyTicket/BuyTicket';
import LoginForm from './Pages/AddCustomer/LoginForm';
import RegisterForm from './Pages/AddCustomer/RegisterForm'
import Navbar from './Componets/Navbar';
import EventView from './Pages/EventView/EventView';
import Eventcalendar from './Pages/EventCalendar/EventCalendar';

function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginForm/>}/>
      <Route path='/show' element={<EventDetails/>}/>
      <Route path='/add-event' element={<AddEvent/>}/>
      <Route path='/BuyTicket' element={<BuyTicket/>}/>    
      <Route path='/Register' element={<RegisterForm/>}/>
      <Route path="/view-event/:id" element={<EventView />} />
      <Route path="/calendar" element={<Eventcalendar />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
