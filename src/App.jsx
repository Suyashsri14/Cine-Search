/* eslint-disable react-hooks/set-state-in-effect */
import Search from "./components/Search.jsx"
import {useState, useEffect} from 'react'
import {useDebounce} from 'react-use'
import Spinner from "./components/Spinner.jsx"
import MovieCard from "./components/MovieCard.jsx";
import {updateSearchCount} from "./appwrite.js"


const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },

}

const App = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [errorMessage, setErrorMessage] = useState('');
 const [movieList, setMovieList] = useState([]);
 const [isLoading, setLoading] = useState(false);
 const [debouncingTerm, setDebouncingTerm] = useState('');


 useDebounce(() => setDebouncingTerm(searchTerm),500,[searchTerm])

 const fetchMovies = async (query = '') => {
  setLoading(true);
  setErrorMessage('');

  try {
     const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
                            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
     const response = await fetch(endpoint, API_OPTIONS);

     if(!response.ok){
       throw new Error("Error fetching movies.");
       
     }
     const data = await response.json();
    

     if(data.Response === 'False')
     {
      setErrorMessage(data.Error || 'Failed to fetch movies.')
      setMovieList([]);
      return ;
     }

     setMovieList(data.results || []);
    
     if(query && data.results.length > 0){
      await updateSearchCount(query, data.results[0]);
     }
    
  } catch (error) {
    console.log(`Error fetching movies: ${error}`)
    setErrorMessage('Error fetching movies. Please try later.')
  }
  finally{
    setLoading(false);
  }
  
 }

 useEffect(() => {

  fetchMovies(debouncingTerm);
 
 }, [debouncingTerm])
 

  return (
   <main>
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img  src="./hero.png" alt= "_HERO BANNER_"/>
          <h1>Find the <span className="text-gradient">Movies</span>  You'll Enjoy Without the Hassle</h1>
          <Search searchTerm = {searchTerm} setSearchTerm ={setSearchTerm}/>
        </header>
        
        <section className="all-movies">
            <h2 className ='mt-[40px]'>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ): errorMessage ? (<p className="text-red-500">{errorMessage}</p>) 
             : (
               <ul>
                {movieList.map((movie) =>(
                  <MovieCard key ={movie.id} movie= {movie}/>
                ))}
               </ul>
             ) 
          }

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
</div>   
</main>
  )
}

export default App