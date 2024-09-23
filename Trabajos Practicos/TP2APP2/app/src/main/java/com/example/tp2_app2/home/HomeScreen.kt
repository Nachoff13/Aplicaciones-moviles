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

        // Mostrar ciudades y países

        LazyColumn(modifier = Modifier.fillMaxWidth()) {
            items(state.cities) { city ->
                CityItem(
                    city = city,
                    modifier = Modifier.fillMaxWidth(),
//                    onEdit = { /* No se utiliza */ },
//                    onDelete = { /* No se utiliza */ }
                )
            }

            // También estás mostrando los países aquí
            items(state.countries) { country ->
                CountryItem(country = country, modifier = Modifier.fillMaxWidth(), onEdit = {
                    //viewModel.editCountry(country)
                }, onDelete = {
                    //viewModel.deleteCountry(country)
                })
            }
        }

    }
}
