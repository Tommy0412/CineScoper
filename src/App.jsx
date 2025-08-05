import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './Componenets/NavBar';
import Header from './Componenets/Header';
import Home from './Componenets/Home';
import Footer from './Componenets/Footer';
import TVShow from './Componenets/TVShow';
import Animation from './Componenets/Animaiton';
import Movies from './Componenets/Movies';
import Show from './Componenets/Show';
import Seasons from './Componenets/Seasons';
import WatchEp from './Componenets/WatchEp';
import Search from './Componenets/Search';
import ActorMovies from './Componenets/ActorMovies';
import Keywords from './Componenets/Keywords';
import Year from './Componenets/Year';
import Genres from './Componenets/Genres';
import Watchlist from './Componenets/Watchlist';
import PageNotFound from './Componenets/PageNotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <NavBar />
            <Header />
            <Home />
            <Footer />
          </>
        } />
        <Route path='/movies' element={
          <>
            <NavBar />
            <Header />
            <Movies />
            <Footer />
          </>
        } />
        <Route path='/tv-show' element={
          <>
            <NavBar />
            <Header />
            <TVShow />
            <Footer />
          </>
        } />
        <Route path='/animation' element={
          <>
            <NavBar />
            <Header />
            <Animation />
            <Footer />
          </>
        } />
        <Route path='/show/:type/:id' element={
          <>
            <NavBar />
            <Show />
            <Footer />
          </>
        } />
        <Route path='/show/:type/:id/s/:season' element={
          <>
            <NavBar />
            <Seasons />
            <Footer />
          </>
        } />
        <Route path='/show/:type/:id/s/:season/e/:episode' element={
          <>
            <NavBar />
            <WatchEp />
            <Footer />
          </>
        } />
        <Route path='/search' element={
          <>
            <NavBar />
            <Search />
            <Footer />
          </>
        } />	
		 <Route path='/casts/:actorName' element={
          <>
            <NavBar />
            <ActorMovies />
            <Footer />
          </>
        } />
         <Route path='/keywords/:id' element={
          <>
            <NavBar />
            <Keywords />
            <Footer />
          </>
        } />	
         <Route path='/year/:year' element={
          <>
            <NavBar />
            <Year />
            <Footer />
          </>
        } />	
        <Route path='/watchlist' element={
          <>
            <NavBar />
            <Watchlist  />
            <Footer />
          </>
        } />
        <Route path='/genres/:type/:genreId/:page' element={
          <>
            <NavBar />
            <Genres />
            <Footer />
          </>
        } />
        <Route path='*' element={
		<>	
		<NavBar />
		<PageNotFound />
		<Footer />
		</>
		} />		
      </Routes>
    </BrowserRouter>
  );
}

export default App;