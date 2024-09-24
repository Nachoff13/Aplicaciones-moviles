package com.example.tp2_app2.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.style.TextAlign
import androidx.navigation.NavHostController

@Composable
fun HomeScreen(
    navController: NavHostController,
    viewModel: HomeViewModel
) {
    val state = viewModel.state

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(text = "Mis Ciudades", fontSize = 30.sp, fontWeight = FontWeight.SemiBold)

        // Navegación a las diferentes funcionalidades
        Button(onClick = { navController.navigate("add_city") }) {
            Text("Cargar Ciudad")
        }
        Button(onClick = { navController.navigate("search_city") }) {
            Text("Consultar Ciudad")
        }
        Button(onClick = { navController.navigate("delete_city") }) {
            Text("Borrar Ciudad")
        }
        Button(onClick = { navController.navigate("delete_cities_by_country") }) {
            Text("Borrar Ciudades por País")
        }
        Button(onClick = { navController.navigate("update_population") }) {
            Text("Modificar Población")
        }

        Spacer(modifier = Modifier.height(16.dp))


        LazyColumn(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
            item {

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Black)
                        .padding(vertical = 8.dp, horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "Ciudad", fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Left, color = Color.White)
                    Text(text = "Población", fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Center, color = Color.White)
                    Text(text = "País", fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Right, color = Color.White)
                }

                HorizontalDivider(thickness = 1.dp, color = Color.Black)
            }


            items(state.cities) { city ->
                val country = viewModel.countriesList.find { it.countryId == city.countryId }
                CityRow(city = city, countryName = country?.name ?: "Desconocido")
                HorizontalDivider(thickness = 1.dp, color = Color.Black)
            }
        }
    }
}

@Composable
fun CityRow(city: City, countryName: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.LightGray)
            .padding(vertical = 8.dp, horizontal = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = city.name, fontSize = 16.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Left)
        Text(text = city.population.toString(), fontSize = 16.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
        Text(text = countryName, fontSize = 16.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Right)
    }
}


