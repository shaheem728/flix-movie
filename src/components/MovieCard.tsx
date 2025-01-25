import React from 'react'

const MovieCard = ({movie:{imdbID,Title,Year,Type,Poster}}) => {
  return (
    <div className='movie-card' >
      {
        Poster !== "N/A" ? (<img src={Poster} alt={Title}/>):<img src='No-Poster.png' alt="No-Poster"/>
      } 
      <div className='mt-4'>
        <h3 className='text-white'>{Title}</h3>
      </div>
        <div className='content'>
          <p className='year'>{Year}</p>
          <span>•</span>
          <p className='year'>{Type}</p>
        </div>
    </div>
  )
}

export default MovieCard