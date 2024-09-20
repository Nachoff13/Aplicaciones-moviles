package com.example.tp2_app2.home

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.util.UUID

class HomeViewModel(
    private val cityDao: CityDao,
    private val countryDao: CountryDao
) : ViewModel() {
    var state by mutableStateOf(HomeState())
        private set

    init {
        // Obtener el listado de ciudades
        viewModelScope.launch {
            cityDao.getAllCity().collectLatest {
                state = state.copy(cities = it)
            }
        }

        // Obtener el listado de países
        viewModelScope.launch {
            countryDao.getAllCountry().collectLatest {
                state = state.copy(countries = it)
            }
        }
    }

    // Funciones para ciudades (ya existentes)
    fun changeCityName(name: String) { state = state.copy(cityName = name) }
    fun changeCityPopulation(population: Int) { state = state.copy(cityPopulation = population) }
    fun changeCityCountry(country: Int) { state = state.copy(countryId = country) }

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
            population = state.cityPopulation.toInt(),
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


    // Funciones para países (nuevas)

    fun changeCountryName(name: String) {
        state = state.copy(countryName = name)
    }

    fun changeCountryPopulation(population: Int) {
        state = state.copy(countryPopulation = population)
    }

    fun addCountry() {
        val country = Country(
            countryId = state.countryId?.toInt() ?: 0,
            name = state.countryName,
            population = state.countryPopulation.toInt()
        )
        viewModelScope.launch {
            countryDao.insertCountry(country)
        }
        state = state.copy(
            countryName = "",
            countryPopulation = 0
        )
    }


    fun deleteCountry(country: Country) {
        viewModelScope.launch {
            countryDao.deleteCountry(country)
        }
    }

    fun editCountry(country: Country) {
        state = state.copy(
            countryName = country.name,
            countryPopulation = country.population,
            countryId = country.countryId
        )
    }
}
