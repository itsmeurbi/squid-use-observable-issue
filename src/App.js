import './App.css';
import { useCollection, useObservable } from '@squidcloud/react'

import { useEffect, useState } from 'react';


// SYSTEM USE CASE
// We are working on an integration with an external service that is going to have access
// to one of our databases; the same one Squid has access to
// This external system will inject new records to one particular collection and we want to be aware of those changes
// useObservable aparently is only aware of changes made by Squid, meaning we can not rely on it for this integration
// While playing around with this hook, I found what I think is an unexpected behavior

// The flow we want to implement is something like this:
// - User clicks a button
// - A fetch request is made to an external service(no Squid)
// - External service collects several data and creates multiple records in a particular collection
// - External services returns a 200 http status
// - We fetch the just-created records and render their data(the 200 http status tell us new data was stored)

// I thought I could use useObservable for Squid real-time update and just build another query
// for getting the external service records when needed(right after making the http request),
// BUT looks like using useObservable changes the way future Squid queries are being made
const App = () => {
  const [users, setUsers] = useState([])
  const usersCollectionRef = useCollection('users', 'test')
  // Removing this from the component make things work as expected
  useObservable(
    () => {
      return usersCollectionRef.query().dereference().snapshots();
    },
    { initialData: [] }, []
  );

  // Using useObservable seems to affect the way data is requested here
  // If useObservable is removed from this component, things work as expected.
  // Data returned reflecs what's in the database, that is, modifications made by non-squid systems
  // are reflected correctly.
  // Inspecting with the dev tools a POST is being made to aws.squid.cloud/query/batchQueries

  // As soon as you add useObservable, this query stops retuning data updated by external services
  // Inspecting with the dev tools a POST is being made to aws.squid.cloud/query/register
  // So I'd say that using the hook is in fact affecting how data is retrived
  // which I think is inexpected
  useEffect(() => {
    const getUpdatedData = async () => {
      usersCollectionRef.query().dereference().snapshot().then((data) => {
        console.log('Users fetched')
        setUsers(data)
      })
      setTimeout(getUpdatedData, 5000)
    }
    setTimeout(getUpdatedData, 5000)
  })


  return (
    <div className="App">
      <h1>Users</h1>
      { users.map((user) => (
        <p key={user._id} >{user.name}</p>
      )) }
    </div>
  );
}

export default App;
