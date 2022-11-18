import React, {Component} from 'react'
import "./App.css";
import {BrowserRouter,Routes,Route,Navigate,} from "react-router-dom";

import Login from "./components/Login/login";
import Dashboard from "./components/DashBaord/dashboard";

class App extends Component {
  render(){
    return (
      <BrowserRouter>        
        <React.Fragment>
          <Routes>
            <Route exact path="/" element={<Login/>} />
            <Route exact path="/dashboard" element={<Dashboard/>} />
          </Routes>
        </React.Fragment>
      </BrowserRouter>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className='App-title'>Welcome to React.</h1>
      //     <table>
      //       <thead>
      //         <tr>
      //           <th>FileName</th>
      //           <th>FileTime</th>
      //         </tr>
      //       </thead>
      //       <tbody>
            // {this.state.directoryApiResponse.map((dir, dirIndex) => {
            //   return (
            //     <tr>
            //       <Fragment key={dirIndex}>
            //         <td>{dir.DirName}</td>
            //         <td>{dir.DirTime}</td>
            //         <span>
            //           {dir.Files.map((step, stepIndex) => (
            //             <Fragment key={stepIndex}>
            //               <p onClick={() => callPostAPI(step.FilePath)}>{step.FileName}</p>
            //             </Fragment>
            //           ))}
            //         </span>
            //       </Fragment>
            //      </tr>
            //   );
            // })}              
      //       </tbody>
      //     </table>
      //     <img src={this.state.imageFile}></img>                 
      //   </header>           
      // </div>
    );
  }  
}

export default App;
