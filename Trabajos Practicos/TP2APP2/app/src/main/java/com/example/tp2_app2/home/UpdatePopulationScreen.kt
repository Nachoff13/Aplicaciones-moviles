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
fun UpdatePopulationScreen(navController: NavHostController, viewModel: HomeViewModel) {
    val cityName = remember { mutableStateOf("") }
    val newPopulation = remember { mutableStateOf("") }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Modificar Población", fontWeight = FontWeight.Bold, fontSize = 24.sp)

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = cityName.value,
            onValueChange = { cityName.value = it },
            placeholder = { Text(text = "Nombre de la ciudad") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = newPopulation.value,
            onValueChange = { newPopulation.value = it },
            placeholder = { Text(text = "Nueva población") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                viewModel.updateCityPopulation(cityName.value, newPopulation.value.toIntOrNull() ?: 0)
                navController.navigate("home")
            },
            modifier = Modifier.padding(vertical = 8.dp)
        ) {
            Text("Actualizar Población", fontSize = 20.sp)
        }
    }
}
