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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddCityScreen(navController: NavHostController, viewModel: HomeViewModel) {
    // Inicializa el FocusRequester
    val focusRequester = remember { FocusRequester() }
    var expanded by remember { mutableStateOf(false) }
    var selectedCountry by remember { mutableStateOf<Country?>(null) }
    var showError by remember { mutableStateOf(false) } // Para controlar la visibilidad del mensaje de error

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

        // Desplegable para seleccionar el país
        ExposedDropdownMenuBox(
            expanded = expanded,
            onExpandedChange = { expanded = !expanded }
        ) {
            TextField(
                value = selectedCountry?.name ?: "Selecciona un país",
                onValueChange = {},
                readOnly = true,
                modifier = Modifier
                    .focusRequester(focusRequester)
                    .clickable(onClick = { expanded = true }),
                placeholder = { Text("Selecciona un país") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) }
            )
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                viewModel.countriesList.forEach { country ->
                    DropdownMenuItem(
                        text = { Text(country.name) },
                        onClick = {
                            selectedCountry = country
                            viewModel.changeCityCountry(country.countryId)
                            expanded = false
                        }
                    )
                }
            }
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
                // Validación antes de agregar la ciudad
                if (viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null) {
                    viewModel.addCity()
                    navController.navigate("home")
                    showError = false // Ocultar el mensaje de error si se agrega la ciudad
                } else {
                    showError = true // Mostrar el mensaje de error
                }
            },
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
                .height(60.dp),
            enabled = viewModel.state.cityName.isNotBlank() &&
                    viewModel.state.cityPopulation.toString().isNotBlank() &&
                    selectedCountry != null // Deshabilitar el botón si hay campos vacíos
        ) {
            Text("Agregar Ciudad")
        }
    }
}
