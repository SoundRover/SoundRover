import React from 'react';
import Navbar from './Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//       </div>
//     </Router>
//   );
// }


// export default App;




import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
