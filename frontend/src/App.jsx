// import Signup from "./pages/Signup";
// import { Toaster } from "react-hot-toast";


// function App() {
  
//   return <Signup />; 
      

   

// }

// export default App;


import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Signup />
    </>
  );
}

export default App;
