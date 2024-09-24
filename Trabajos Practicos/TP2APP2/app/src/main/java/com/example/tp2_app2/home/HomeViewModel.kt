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
    var countriesList: List<Country> = listOf()
        private set
    var selectedCity by mutableStateOf<City?>(null)
        private set
    var state by mutableStateOf(HomeState())
        private set
    var countryName by mutableStateOf("")


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
            Country(3, "Estados Unidos", 332915073),
            Country(4, "Indonesia", 276361783),
            Country(5, "Pakistán", 225199937),
            Country(6, "Brasil", 213993437),
            Country(7, "Nigeria", 211400708),
            Country(8, "Bangladés", 166303498),
            Country(9, "Rusia", 145912025),
            Country(10, "México", 130262216),
            Country(11, "Japón", 125836021),
            Country(12, "Etiopía", 117876227),
            Country(13, "Filipinas", 113920000),
            Country(14, "Egipto", 104124440),
            Country(15, "Vietnam", 98940000),
            Country(16, "República Democrática del Congo", 89561403),
            Country(17, "Turquía", 86968796),
            Country(18, "Irán", 85028738),
            Country(19, "Alemania", 83783942),
            Country(20, "Tailandia", 69799978),
            Country(21, "Reino Unido", 68207114),
            Country(22, "Francia", 65273511),
            Country(23, "Italia", 60244639),
            Country(24, "Tanzania", 59734218),
            Country(25, "Sudáfrica", 59308690),
            Country(26, "Birmania", 54834591),
            Country(27, "Kenia", 53771296),
            Country(28, "Corea del Sur", 51780579),
            Country(29, "Colombia", 50882891),
            Country(30, "España", 46754778),
            Country(31, "Uganda", 45741007),
            Country(32, "Argentina", 45195777),
            Country(33, "Argelia", 43851044),
            Country(34, "Sudán", 43849260),
            Country(35, "Irak", 40222493),
            Country(36, "Afganistán", 40218234),
            Country(37, "Polonia", 38386000),
            Country(38, "Canadá", 38005238),
            Country(39, "Marruecos", 36910560),
            Country(40, "Arabia Saudita", 34813867),
            Country(41, "Uzbekistán", 33469199),
            Country(42, "Perú", 32971854),
            Country(43, "Angola", 32866272),
            Country(44, "Malasia", 32732764),
            Country(45, "Mozambique", 31255435),
            Country(46, "Ghana", 31072940),
            Country(47, "Yemen", 29825968),
            Country(48, "Nepal", 29609623),
            Country(49, "Venezuela", 28435943),
            Country(50, "Madagascar", 29222941),
            Country(51, "Camerún", 22709892),
            Country(52, "Costa de Marfil", 26378000),
            Country(53, "Australia", 25788207),
            Country(54, "Níger", 24737124),
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
        val populationInt = population.toIntOrNull() ?: 0
        state = state.copy(cityPopulation = populationInt)
    }

    fun changeCityCountry(countryId: Int) {
        state = state.copy(countryId = countryId)
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
        // Reinicia el estado después de agregar la ciudad
        state = state.copy(
            cityName = "",
            cityPopulation = 0,
            cityId = null,
            countryId = null
        )
    }


    // Funciones para ciudades
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
    fun searchCityByName(name: String) {
        viewModelScope.launch {
            // Llama a getCityByName y actualiza selectedCity
            selectedCity = cityDao.getCityByName(name)
            // Busca el país si la ciudad fue encontrada
            selectedCity?.let {
                val country = countryDao.getCountryById(it.countryId)
                countryName = country?.name ?: "País no encontrado"
            } ?: run {
                countryName = ""
            }
        }
    }
}