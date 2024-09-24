package com.example.tp2_app2.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun DeleteCitiesByCountryScreen(navController: NavHostController, viewModel: HomeViewModel) {
    var countryFilter by remember { mutableStateOf("") }
    var selectedCountry by remember { mutableStateOf<Country?>(null) }
    var showCountryList by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Borrar Ciudades por País", fontWeight = FontWeight.Bold, fontSize = 24.sp)

        Spacer(modifier = Modifier.height(16.dp))

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

        Spacer(modifier = Modifier.height(16.dp))

        // Botón para borrar ciudades por país
        Button(
            onClick = {
                selectedCountry?.let { country ->
                    viewModel.deleteCitiesByCountry(country.countryId)
                    navController.navigate("home")
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            enabled = selectedCountry != null
        ) {
            Text("Borrar Ciudades", fontSize = 20.sp)
        }
    }
}
