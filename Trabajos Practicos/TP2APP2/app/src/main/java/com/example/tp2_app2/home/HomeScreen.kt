package com.example.tp2_app2.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp


@Composable
fun HomeScreen(
    viewModel: HomeViewModel
) {
    val state = viewModel.state

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(text = "Mis Ciudades y Países", fontSize = 20.sp, fontWeight = FontWeight.SemiBold)

        // Inputs para agregar ciudades
        TextField(
            value = state.cityName,
            onValueChange = { viewModel.changeCityName(it) },
            placeholder = { Text(text = "Nombre de la ciudad") }
        )
        TextField(
            value = state.cityPopulation,
            onValueChange = { viewModel::changeCityPopulation(it) },
            placeholder = { Text(text = "Población de la ciudad") }
        )
        Button(onClick = { viewModel::addCity(it) }) {
            Text(text = "Agregar Ciudad")
        }

        // Inputs para agregar países
        TextField(
            value = state.countryName,
            onValueChange = { viewModel::changeCountryName(it) },
            placeholder = { Text(text = "Nombre del país") }
        )
        TextField(
            value = state.countryPopulation,
            onValueChange = { viewModel::changeCountryPopulation(it) },
            placeholder = { Text(text = "Población del país") }
        )
        Button(onClick = { viewModel::addCountry(it) }) {
            Text(text = "Agregar País")
        }

        // Mostrar ciudades y países
        LazyColumn(modifier = Modifier.fillMaxWidth()) {
            items(state.cities) { city ->
                CityItem(city = city, modifier = Modifier.fillMaxWidth(), onEdit = {
                    viewModel.editCity(city)
                }, onDelete = {
                    viewModel.deleteCity(city)
                })
            }

            items(state.countries) { country ->
                CountryItem(country = country, modifier = Modifier.fillMaxWidth(), onEdit = {
                    viewModel.editCountry(country)
                }, onDelete = {
                    viewModel.deleteCountry(country)
                })
            }
        }
    }
}


