import { useEffect, useState } from 'react'
import axios from 'axios'


const Countries = ({ countries, newSearch, setNewSearch }) => {
  const [countryInfo, setCountryInfo] = useState(null)
  const [weatherInfo, setWeatherInfo] = useState('')
  const flagStyle = { maxHeight: 200 }

  useEffect(() => {
    if (countries.length === 1) {
      const countryName = countries[0].name.common;
      const countryLat = countries[0].capitalInfo.latlng[0];
      const countryLon = countries[0].capitalInfo.latlng[1];
      const api_key = import.meta.env.VITE_SOME_KEY; // Access your API key
      console.log('country name:', countryName);
  
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        .then(response => {
          console.log("response:", response);
          setCountryInfo(response.data);
          
          // Fetch the weather information
          return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${countryLat}&lon=${countryLon}&appid=${api_key}`);
        })
        .then(weatherResponse => {
          setWeatherInfo(weatherResponse.data);
          console.log("weather:", weatherResponse.data)
        })
        .catch(error => {
          console.log('Error fetching data:', error);
          setCountryInfo(null);
          setWeatherInfo(null); // Reset weather info on error
        });
    } else {
      setCountryInfo(null);
      setWeatherInfo(null); // Reset weather info when not a single country
    }
  }, [countries]);
  


  if (newSearch === '') {
    return (
      <div>
        {countries.map(country => 
          <Country key={country.cca3} country={country} setNewSearch={setNewSearch} />
        )}
      </div>
    )
  }
  else if (countries.length > 10) {
    return (
      <div>
        be more specific in your search
      </div>
    )
  }
  else if (countries.length === 0) {
    return (
      <div>
        No results
      </div>
    )
  }
  // Have to check for countryInfo as it takes a brief moment to fetch.
  else if (countryInfo && weatherInfo && countries.length === 1) {
    return (
      <div>
        <h1>{countryInfo.name.common}</h1>
        <div>
          capital: {countryInfo.capital}
        </div>
        <div>
          area: {countryInfo.area}
        </div>
        <div>
        <h3>languages:</h3>
        <ul>
          {Object.values(countryInfo.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        </div>
        <img style={flagStyle} src={countryInfo.flags.png} />
        <h2>Weather in {countryInfo.name.common}</h2>
        <div>
          temperature: {(weatherInfo.current.temp - 273.15).toFixed(2)} Celcius
        </div>
        <img src={`https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@2x.png`} />
        <div>
          wind: {weatherInfo.current.wind_speed} m/s
        </div>
      </div>
    )
  }
  else return (
    <div>
      {countries.map(country => 
        <Country key={country.cca3} country={country} setNewSearch={setNewSearch} />
      )}
    </div>
  )
}

const Country = ({ country, setNewSearch }) => {

  const chooseCountry = () => {
    setNewSearch(country.name.common)
  }
  return (
    <div>
      {country.name.common} <button onClick={chooseCountry}>show</button>
    </div>
  )
}

const Search = ({ searchInput, newSearch }) => 
  <div>
    find countries <input onChange={searchInput} value={newSearch} placeholder={ 'search...' }/>
  </div>


function App() {
  // Update to null later or the other way other than [] in setCountries
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => console.log('Error fetching data', error))
  }, [])

  const searchInput = (event) => {
    setNewSearch(event.target.value)
  }

const searchResults = countries.filter(country => 
  country.name.common.toLowerCase().includes(newSearch.toLowerCase().trim()))

  return (
    <div>
      <Search searchInput={searchInput} newSearch={newSearch} />
      <Countries countries={searchResults} newSearch={newSearch} setNewSearch={setNewSearch} />
    </div>
  )
}

export default App
