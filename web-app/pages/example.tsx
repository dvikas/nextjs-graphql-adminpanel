import React, { useEffect, useState } from "react";
type Props = {};
// https://blog.bitsrc.io/react-hooks-5-beginners-tips-b1e3e55dc8dc
const useService = (serviceObj: any) => {
    const [isSubscribed, setIsSubscribed] = useState(11);

    useEffect(() => {
        serviceObj.subscribe().then((a: any) => {
            console.log(a);
            setIsSubscribed(12)
            // code after subscription
        });
        return () => {
            serviceObj.unsubscribe().then((a: any) => {
                console.log(a);
                // clean up operations
            });
        };
    }, [name]);

    return isSubscribed;
}


const serviceA = {
    subscribe: () => Promise.resolve('subscribed'),
    unsubscribe: () => Promise.resolve('unsubscribe')
};

const Companies: React.FC<Props> = () => {
    const [name, setName] = useState('Dilantha');
    const [age, setAge] = useState(28);
    const [renderCount, setRenderCount] = useState(0);
    const isSubscribed = useService(serviceA);

    return (
        <>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <h1> Name : {name} </h1>
            <h1> Age : {age} </h1>
            <p> Render Count : {renderCount} </p>
            <p> isSubscribed : {isSubscribed} </p>
        </>
    );
};

export default Companies;
