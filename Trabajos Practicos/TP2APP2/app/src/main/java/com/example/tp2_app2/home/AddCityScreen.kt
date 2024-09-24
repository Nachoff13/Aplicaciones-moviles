package com.example.tp2_app2.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

@Composable
fun AddCityScreen(navController: NavHostController, viewModel: HomeViewModel) {
    var countryFilter by remember { mutableStateOf("") }
    var selectedCountry by remember { mutableStateOf<Country?>(null) }
    var showError by remember { mutableStateOf(false) }
    var showCountryList by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Agregar Ciudad", fontWeight = FontWeight.Bold, fontSize = 20.sp)

        Spacer(modifier = Modifier.height(8.dp))


        TextField(
            value = viewModel.state.cityName,
            onValueChange = { viewModel.changeCityName(it) },
            placeholder = { Text("Nombre de la ciudad") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))


        TextField(
            value = if (viewModel.state.cityPopulation == 0) "" else viewModel.state.cityPopulation.toString(),
            onValueChange = { viewModel.changeCityPopulation(it) },
            placeholder = { Text("Población de la ciudad") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Barra de búsqueda para seleccionar el país
        TextField(
            value = countryFilter,
            onValueChange = {
                countryFilter = it
                showCountryList = true
            },
            placeholder = { Text("Buscar país") },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        )

        val filteredCountries = viewModel.countriesList.filter { country ->
            country.name.contains(countryFilter, ignoreCase = true)
        }

        if (showCountryList && filteredCountries.isNotEmpty()) {
            LazyColumn(
                modifier = Modifier
                    .padding(top = 8.dp)
                    .fillMaxWidth()
            ) {
                items(filteredCountries) { country ->
                    Text(
                        text = country.name,
                        modifier = Modifier
                            .clickable {
                                selectedCountry = country
                                countryFilter = country.name
                                showCountryList = false

                                viewModel.changeCityCountry(country.countryId)
                            }
                            .padding(8.dp)
                    )
                }
            }
        } else if (showCountryList && countryFilter.isNotEmpty()) {
            Text(
                text = "No se encontraron países.",
                modifier = Modifier.padding(8.dp)
            )
        }


        Spacer(modifier = Modifier.height(8.dp))


        if (showError) {
            Text(
                text = "Por favor, completa todos los campos.",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(8.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))


        Button(
            onClick = {
                // Valida antes de agregar la ciudad
                if (viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null) {
                    viewModel.addCity()
                    navController.navigate("home")
                    showError = false
                } else {
                    showError = true
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp),
            enabled = viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null
        ) {
            Text("Agregar Ciudad")
        }
    }
}
