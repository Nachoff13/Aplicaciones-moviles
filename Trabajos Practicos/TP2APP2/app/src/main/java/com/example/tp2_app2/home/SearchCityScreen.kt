package com.example.tp2_app2.home

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun SearchCityScreen(navController: NavHostController, viewModel: HomeViewModel) {
    val cityName = remember { mutableStateOf("") }
    val city = remember { mutableStateOf<City?>(null) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp), // Agregar padding
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally // Centrar horizontalmente
    ) {
        Text("Consultar Ciudad", fontWeight = FontWeight.Bold, fontSize = 24.sp) // Aumentar tamaño de fuente

        Spacer(modifier = Modifier.height(16.dp)) // Espaciador entre el título y el TextField

        TextField(
            value = cityName.value,
            onValueChange = { cityName.value = it },
            placeholder = { Text(text = "Nombre de la ciudad") },
            modifier = Modifier.fillMaxWidth() // Hacer que el TextField llene el ancho
        )

        Spacer(modifier = Modifier.height(16.dp)) // Espaciador entre el TextField y el botón

        Button(
            onClick = {
                viewModel.searchCityByName(cityName.value)
            },
            modifier = Modifier.padding(vertical = 8.dp) // Padding vertical en el botón
        ) {
            Text("Buscar Ciudad", fontSize = 20.sp) // Aumentar tamaño de fuente del botón
        }

        Spacer(modifier = Modifier.height(16.dp)) // Espaciador entre el botón y el resultado

        city.value?.let {
            Text("Ciudad: ${it.name}, Población: ${it.population}", fontSize = 18.sp) // Aumentar tamaño de fuente del resultado
        } ?: Text("Ciudad no encontrada.", fontSize = 18.sp) // Aumentar tamaño de fuente del mensaje
    }
}
