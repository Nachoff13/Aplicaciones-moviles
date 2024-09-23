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
fun DeleteCitiesByCountryScreen(navController: NavHostController, viewModel: HomeViewModel) {
    val countryId = remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp), // Agregar padding
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally // Centrar horizontalmente
    ) {
        Text("Borrar Ciudades por País", fontWeight = FontWeight.Bold, fontSize = 24.sp) // Aumentar tamaño de fuente

        Spacer(modifier = Modifier.height(16.dp)) // Espaciador entre el título y el TextField

        TextField(
            value = countryId.value.toString(),
            onValueChange = { countryId.value = it.toIntOrNull() ?: 0 },
            placeholder = { Text(text = "ID del país") },
            modifier = Modifier.fillMaxWidth() // Hacer que el TextField llene el ancho
        )

        Spacer(modifier = Modifier.height(16.dp)) // Espaciador entre el TextField y el botón

        Button(
            onClick = {
                viewModel.deleteCitiesByCountry(countryId.value)
                navController.navigate("home") // Regresar a la pantalla principal
            },
            modifier = Modifier.padding(vertical = 8.dp) // Padding vertical en el botón
        ) {
            Text("Borrar Ciudades", fontSize = 20.sp) // Aumentar tamaño de fuente del botón
        }
    }
}
