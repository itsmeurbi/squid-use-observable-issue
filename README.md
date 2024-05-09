# Purpose

This repository is meant to be used only as a playground to replicate and test whay I believe is an unexpected behaviour using the `useObservable` hook from `@squidcloud/react` lib

## Assumptions

This repository assums you have a [Squid](https://squid.cloud) project with a proper MongoDB integration with at least one collection

## Setup

- Make sure you have installed all the required packages with `npm install`
- Once all packages are installed, go to `src/index.js` and replace `appId` and `region` props with your Squid application id and its region
- Go to `src/App.js` and addecuate the `useCollection` hook to use your Squid integration name for MongoDB and the collection name. As it is, it'll look for a `users` collection in a `test` integration
- Finally run `npm start` and open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Issue description

### System use case
We have a react application that uses Squid as its backend since one year ago. Right now we are working on an new integration with an external service that is going to have access to one of our databases; the same one Squid has access to.
This external system will inject new records to one particular collection, and we want to be aware of those changes so we can display those new records without the need of refreshing the page

The flow we want to implement is something like this:
- User clicks a button
- A fetch request is made to an external service(no Squid)
- External service collects several data and creates multiple records in a particular collection
- External services returns a 200 http status
- We fetch the just-created records and render their data(the 200 http status tell us new data was stored)

### Issue

We're usign Squid to retrieve the data from MongoDB, so while playing around with `useObservable` hook, I found what I think is an unexpected behavior.
One you define the hook in your component, to keep track of changes made by Squid in a particular collection, the future queries made to the same collection stops reflecting what really is in the database, meaning it does not return any change made by external services.

Say you have an empty component that exceutes a function that each n seconds fetches the data in a collection, liki this:
```js
useCollection('my_collection', 'integration_name').query().dereference().snapshot().then((data) => data)
```
It'll correctly reflect what data is in the database, meaning new recrods added directly to the database are being shown with no issues. All this stops working as soon as you add the `useObservable` hook to your component like:

```js
  useObservable(
    () => {
      return useCollection('my_collection', 'integration_name').query().dereference().snapshots();
    }, { }, []
  );
```

The previous query is no longer reflecting the data in MongoDB. No matter if you add or remove multiple collections to the database, query keeps returning the exact same records as the first time it requested data

### Evidences:
The following video serves as an evidence for the described issue
Please see how data retrieval breaks as soon as the `useCollection` hook is commented out
[![Video](https://github.com/itsmeurbi/squid-use-observable-issue/blob/main/evidence.mp4)](https://github.com/itsmeurbi/squid-use-observable-issue/blob/main/evidence.mp4)

https://github.com/itsmeurbi/squid-use-observable-issue/blob/main/evidence.mp4
