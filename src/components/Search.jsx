

const Search = ({searchTerm , setSearchTerm}) => {
  return (
    <div className= "search">
        <div>
            <img src="search.svg"/>
            <input type="_text_"
             placeholder = "Search for your movies"
             value={searchTerm}
              onChange ={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>
  )
}

export default Search