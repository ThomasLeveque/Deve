import React from 'react';

interface IfirebaseContext {
    user: any;
    firebase: any; // firebase.app.App
}

const FirebaseContext = React.createContext<Partial<IfirebaseContext>>({});

export default FirebaseContext;
