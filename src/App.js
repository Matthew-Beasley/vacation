import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';


function App() {

  const API = 'https://acme-users-api-rev.herokuapp.com/api';

  const [vacations, setVacations] = useState([]);
  const [currentUser, setUser] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchUser = async () => {
    const storage = window.localStorage;
    const userId = storage.getItem('userId');
    if (userId) {
      try {
        return (await axios.get(`${API}/users/detail/${userId}`)).data;
      }
      catch (ex) {
        storage.removeItem('userId');
        return fetchUser();
      }
    }
    const user = (await axios.get(`${API}/users/random`)).data;
    storage.setItem('userId', user.id);
    return user;
  };


  const createVacation = (ev) => {
    ev.preventDefault();
    try {
      axios.post(`${API}/users/${currentUser.id}/vacations`, { startDate: startDate, endDate: endDate })
        .then(response => setVacations([...vacations, response.data]))
    }
    catch (err) {
      console.log(err);
    }
  }


  const getVacations = () => {
    try {
      axios.get(`${API}/users/${currentUser.id}/vacations`)
        .then(response => setVacations(response.data))
    }
    catch (err) {
      console.log(err);
    }
  }


  const deleteVacation = (index) => {
    const updated = vacations.filter((vacation, idx) => {
      return idx !== index;
    })
    setVacations(updated);
  }


  const sendDelete = (vaca, index) => {
    try {
      axios.delete(`${API}/users/${currentUser.id}/vacations/${vaca.id}`)
      .then(response => deleteVacation(index))
    }
    catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    fetchUser()
      .then(response => setUser(response))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  useEffect(() => {
    if (currentUser.id) {
      getVacations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser])


  return (
    <div className="container">
      <h3>{currentUser.fullName} Vacation Count is {vacations.length}</h3>
      <form onSubmit={ev => createVacation(ev)}>
        <input type="date" onChange={ev => setStartDate(ev.target.value)}/>
        <input type="date" onChange={ev => setEndDate(ev.target.value)} />
        <button type="submit">Create Vacation</button>
      </form>
      <ul>
        {vacations.map((vacation, idx) => {
          return <li key={idx}>From {
            moment(vacation.startDate, 'YYYY-MM-DD').format('MM/DD/YYYY')}  to  {moment(vacation.endDate, 'YYYY-MM-DD').format('MM/DD/YYYY')}
            <button onClick={() => sendDelete(vacation, idx)}>X</button></li>
        })}
      </ul>
    </div>
  );
}

export default App;
