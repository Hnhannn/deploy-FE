import React, { createContext, useState, useEffect } from "react";
import { getUserFromToken, getUserByUsername } from "../../service/AuthService";
import { getCartByUser } from "../../service/API_Cart_Service";
// Create and export the context
export const MultiStepContext = createContext();

const StepContext = ({ children }) => {
  const [currentStep, setStep] = useState(1);
  const [BookData, setBookData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [cartItems, setCartItems] = useState([]);

   useEffect(() => {
     const fetchCartItems = async () => {
       const token = localStorage.getItem("token");
       const userFromToken = getUserFromToken(token);
       if (userFromToken) {
         const userData = await getUserByUsername(userFromToken.sub);
         const cartData = await getCartByUser(userData.userID);
         setCartItems(cartData);
       }
     };
     fetchCartItems();
   }, []);


  return (
    <MultiStepContext.Provider value={{cartItems, setCartItems, currentStep, setStep, BookData, setBookData, finalData, setFinalData }}>
      {children}
    </MultiStepContext.Provider>
  );
};

export default StepContext;
