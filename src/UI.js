import React from 'react';
import moment from 'moment';

const UI = ({ setStartDate, setEndDate, createVacation, sendDelete, vacations, currentUser }) => {
  return (
    <div>
      <h3>{currentUser.fullName} Vacation Count is {vacations.length}</h3>
      <form onSubmit={ev => createVacation(ev)}>
        <input type="date" onChange={ev => setStartDate(ev.target.value)} />
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
  )
}

export default UI;
  