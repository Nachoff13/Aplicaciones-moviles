package com.example.tp2_app2.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddCityScreen(navController: NavHostController, viewModel: HomeViewModel) {
    // Inicializa el FocusRequester
    val focusRequester = remember { FocusRequester() }
    var countryFilter by remember { mutableStateOf("") }
    var selectedCountry by remember { mutableStateOf<Country?>(null) }
    var showError by remember { mutableStateOf(false) } // Para controlar la visibilidad del mensaje de error
    var showCountryList by remember { mutableStateOf(false) } // Controla la visibilidad de la lista de países

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Agregar Ciudad", fontWeight = FontWeight.Bold, fontSize = 20.sp)

        TextField(
            value = viewModel.state.cityName,
            onValueChange = { viewModel.changeCityName(it) },
            placeholder = { Text("Nombre de la ciudad") }
        )

        TextField(
            value = viewModel.state.cityPopulation.toString(),
            onValueChange = { viewModel.changeCityPopulation(it) },
            placeholder = { Text("Población de la ciudad") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )

        // Barra de búsqueda para seleccionar el país
        TextField(
            value = countryFilter,
            onValueChange = {
                countryFilter = it
                showCountryList = true // Muestra la lista cuando se actualiza la búsqueda
            },
            placeholder = { Text("Buscar país") },
            modifier = Modifier
                .width(250.dp)
                .focusRequester(focusRequester)
        )

        // Lista de países filtrados, siempre se muestra si se está escribiendo
        val filteredCountries = viewModel.countriesList.filter { country ->
            country.name.contains(countryFilter, ignoreCase = true)
        }

        if (showCountryList && filteredCountries.isNotEmpty()) {
            LazyColumn(
                modifier = Modifier
                    .padding(top = 8.dp)
                    .width(250.dp)
            ) {
                items(filteredCountries) { country ->
                    Text(
                        text = country.name,
                        modifier = Modifier
                            .clickable {
                                selectedCountry = country
                                countryFilter = country.name // Establece el nombre del país seleccionado en la barra de búsqueda
                                showCountryList = false // Oculta la lista después de seleccionar un país
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

        // Mensaje de error si algún campo está vacío
        if (showError) {
            Text(
                text = "Por favor, completa todos los campos.",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(8.dp)
            )
        }

        Button(
            onClick = {
                // Valida antes de agregar la ciudad
                if (viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null) {
                    viewModel.addCity()
                    navController.navigate("home")
                    showError = false // Oculta el mensaje de error si se agrega la ciudad
                } else {
                    showError = true
                }
            },
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
                .height(60.dp),
            enabled = viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null // Deshabilita el botón si hay campos vacíos
        ) {
            Text("Agregar Ciudad")
        }
    }
}
