package com.example.tp2_app2.home

data class HomeState(
    val cities: List<City> = emptyList(),
    val cityName: String = "",
    val cityPopulation: Int = 0,
    val cityId: Int? = null,
    val countryId: Int? = null,
    val countries: List<Country> = emptyList(),
    val countryName: String = "",
    val countryPopulation: Int = 0,
    val isLoading: Boolean = false,
    val error: String = ""
    )
