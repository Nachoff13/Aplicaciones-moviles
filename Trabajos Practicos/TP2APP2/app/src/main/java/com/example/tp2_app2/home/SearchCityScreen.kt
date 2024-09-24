package com.example.tp2_app2.home

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun SearchCityScreen(navController: NavHostController, viewModel: HomeViewModel) {
    val cityName = remember { mutableStateOf("") }
    val city = viewModel.selectedCity
    val countryName = viewModel.countryName
    val message = "Consulte la ciudad que desee"

    // Resetear el estado cuando se accede a la pantalla
    LaunchedEffect(Unit) {
        cityName.value = ""
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Consultar Ciudad", fontWeight = FontWeight.Bold, fontSize = 24.sp)

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = cityName.value,
            onValueChange = { cityName.value = it },
            placeholder = { Text(text = "Nombre de la ciudad") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                viewModel.searchCityByName(cityName.value)
            },
            modifier = Modifier.padding(vertical = 8.dp)
        ) {
            Text("Buscar Ciudad", fontSize = 20.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Mostrar la información de la ciudad si se encuentra, o el mensaje por defecto si no
        if (city != null) {
            Text("Ciudad: ${city.name}", fontSize = 18.sp)
            Text("Población: ${city.population}", fontSize = 18.sp)
            Text("País: $countryName", fontSize = 18.sp)
        } else {
            Text(message, fontSize = 18.sp)
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}
