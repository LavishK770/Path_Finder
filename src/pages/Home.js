import React from 'react'
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Nav'
import '../styling/home.css';
import img1 from '../icons/path.png';
import img2 from '../icons/nqueen.png';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <Navbar msg={'Algorithms Visualizer'}></Navbar>
      <h2 style={{"textAlign": "center", color: '#1e293b', padding: '8px'}}>A Better Visualization Of Different Algorithms</h2>

      <div className='cards-container'>
        <Link className='no_underline' to="/path-finding">
          <Card img={img1} text="Path-Finder" />
        </Link>
        <Link className='no_underline' to="/nqueens">
          <Card img={img2} text="N Queens problem" />
        </Link>
      </div>

      {/* Footer only has for Home page*/}
      <Footer></Footer> 
    </div>
  )
}

export default Home;
