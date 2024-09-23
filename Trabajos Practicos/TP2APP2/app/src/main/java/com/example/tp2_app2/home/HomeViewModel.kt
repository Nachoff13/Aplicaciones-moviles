package com.example.tp2_app2.home

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class HomeViewModel(
    private val cityDao: CityDao,
    private val countryDao: CountryDao
) : ViewModel() {
    var countriesList: List<Country> by mutableStateOf(emptyList())
        private set

    var state by mutableStateOf(HomeState())
        private set

    init {
        loadCountries()
        loadCountriesToDatabase()

        viewModelScope.launch {
            cityDao.getAllCity().collectLatest { cities ->
                state = state.copy(cities = cities)
            }
        }
    }


    private fun loadCountries() {
        countriesList = listOf(
            Country(1, "China", 1444216107),
            Country(2, "India", 1393409038),
            Country(3, "United States", 332915073),
            Country(4, "Indonesia", 276361783),
            Country(5, "Pakistan", 225199937),
            Country(6, "Brazil", 213993437),
            Country(7, "Nigeria", 211400708),
            Country(8, "Bangladesh", 166303498),
            Country(9, "Russia", 145912025),
            Country(10, "Mexico", 130262216),
            Country(11, "Japan", 125836021),
            Country(12, "Ethiopia", 117876227),
            Country(13, "Philippines", 113920000),
            Country(14, "Egypt", 104124440),
            Country(15, "Vietnam", 98940000),
            Country(16, "DR Congo", 89561403),
            Country(17, "Turkey", 86968796),
            Country(18, "Iran", 85028738),
            Country(19, "Germany", 83783942),
            Country(20, "Thailand", 69799978),
            Country(21, "United Kingdom", 68207114),
            Country(22, "France", 65273511),
            Country(23, "Italy", 60244639),
            Country(24, "Tanzania", 59734218),
            Country(25, "South Africa", 59308690),
            Country(26, "Myanmar", 54834591),
            Country(27, "Kenya", 53771296),
            Country(28, "South Korea", 51780579),
            Country(29, "Colombia", 50882891),
            Country(30, "Spain", 46754778),
            Country(31, "Uganda", 45741007),
            Country(32, "Argentina", 45195777),
            Country(33, "Algeria", 43851044),
            Country(34, "Sudan", 43849260),
            Country(35, "Iraq", 40222493),
            Country(36, "Afghanistan", 40218234),
            Country(37, "Poland", 38386000),
            Country(38, "Canada", 38005238),
            Country(39, "Morocco", 36910560),
            Country(40, "Saudi Arabia", 34813867),
            Country(41, "Uzbekistan", 33469199),
            Country(42, "Peru", 32971854),
            Country(43, "Angola", 32866272),
            Country(44, "Malaysia", 32732764),
            Country(45, "Mozambique", 31255435),
            Country(46, "Ghana", 31072940),
            Country(47, "Yemen", 29825968),
            Country(48, "Nepal", 29609623),
            Country(49, "Venezuela", 28435943),
            Country(50, "Madagascar", 29222941),
            Country(51, "Cameroon", 22709892),
            Country(52, "Ivory Coast", 26378000),
            Country(53, "Australia", 25788207),
            Country(54, "Niger", 24737124),
            Country(55, "Sri Lanka", 21919000)
        )
    }
    private fun loadCountriesToDatabase() {
        viewModelScope.launch {
            countryDao.insertCountry(countriesList)
        }
    }
    // Funciones para ciudades
    fun changeCityName(name: String) {
        state = state.copy(cityName = name)
    }

    fun changeCityPopulation(population: String) {
        val populationInt = population.toIntOrNull() ?: 0  // Manejo de conversión de String a Int
        state = state.copy(cityPopulation = populationInt)
    }

    fun changeCityCountry(countryId: Int) {
        state = state.copy(countryId = countryId) // Asegúrate de que estás asignando countryId al estado
    }

    fun deleteCity(city: City) {
        viewModelScope.launch {
            cityDao.deleteCity(city)
        }
    }

    fun editCity(city: City) {
        state = state.copy(
            cityName = city.name,
            cityPopulation = city.population,
            cityId = city.cityId,
            countryId = city.countryId
        )
    }

    fun addCity() {
        val city = City(
            cityId = state.cityId?.toInt() ?: 0,
            name = state.cityName,
            population = state.cityPopulation,
            countryId = state.countryId?.toInt() ?: 0
        )
        viewModelScope.launch {
            cityDao.insertCity(city)
        }
        state = state.copy(
            cityName = "",
            cityPopulation = 0,
            cityId = null,
            countryId = null
        )
    }

    // Funciones para ciudades
    fun searchCityByName(cityName: String) {
        viewModelScope.launch {
            val city = cityDao.getCityByName(cityName)
        }
    }

    fun deleteCityByName(cityName: String) {
        viewModelScope.launch {
            cityDao.deleteCityByName(cityName)
        }
    }

    fun deleteCitiesByCountry(countryId: Int) {
        viewModelScope.launch {
            cityDao.deleteCitiesByCountryId(countryId)
        }
    }

    fun updateCityPopulation(cityName: String, newPopulation: Int) {
        viewModelScope.launch {
            cityDao.updateCityPopulation(cityName, newPopulation)
        }
    }
}