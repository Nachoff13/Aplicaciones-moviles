package com.example.tp2_app2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.tp2_app2.ui.theme.TP2APP2Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TP2APP2Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    MainScreen(
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun MainScreen(modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(16.dp)) {
        Text(
            text = "Ciudades Capitales",
            modifier = Modifier
                .padding(bottom = 35.dp)
                .align(Alignment.CenterHorizontally)
        )

        var searchCity by remember { mutableStateOf("") }

        // Lista de países de ejemplo
        val countries = listOf(
            "Argentina",
            "Bolivia",
            "Brasil",
            "Chile",
            "Colombia",
            "Ecuador",
            "Paraguay",
            "Perú",
            "Uruguay",
            "Venezuela"
        )

        var searchCountry by remember { mutableStateOf("") }
        val filteredCountries = countries.filter { it.contains(searchCountry, ignoreCase = true) } // paises filtrados
        var selectedCountry by remember { mutableStateOf<String?>(null) } // Estado para guardar nombre de pais seleccionado
        var showCountryList by remember { mutableStateOf(true) } // Estado para controlar la visibilidad de la lista

        Row(modifier = Modifier.padding(bottom = 8.dp)) {
            TextField(
                value = searchCity,
                onValueChange = { searchCity = it },
                label = { Text("Buscar ciudad") },
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 15.dp) // Espacio entre TextField y el botón
            )

            Button(
                onClick = { /* Acción para crear una nueva ciudad */ },
                modifier = Modifier.alignByBaseline() // Alinea el botón con el TextField
            ) {
                Text("Agregar nueva")
            }
        }

        Row(modifier = Modifier.padding(bottom = 8.dp)) {
            // Barra de búsqueda de países
            TextField(
                value = searchCountry,
                onValueChange = {
                    searchCountry = it
                    showCountryList = true // Muestra la lista cuando se actualiza la búsqueda
                },
                label = { Text("Buscar país") },
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 8.dp) // Espacio entre TextField y el botón
            )
            // Botón para crear un nuevo país
            Button(
                onClick = { /* Acción para crear un nuevo país */ },
                modifier = Modifier
                    .alignByBaseline()
                    .wrapContentHeight() // Permitir que el botón ajuste su altura según el contenido

            ) { Text("Eliminar ciuades\n asociadas")}
        }

        Row (modifier = Modifier.padding(bottom = 8.dp)){
            // Mostrar lista de países filtrados
            if (searchCountry.isNotEmpty() && showCountryList) {
                LazyColumn {
                    items(filteredCountries) { country ->
                        Text(
                            text = country,
                            modifier = Modifier
                                .padding(vertical = 8.dp)
                                .clickable {
                                    selectedCountry = country
                                    searchCountry =
                                        country // Rellena el campo de búsqueda con el país seleccionado
                                    showCountryList =
                                        false // Oculta la lista después de seleccionar un país
                                }
                                .background(
                                    if (selectedCountry == country) MaterialTheme.colorScheme.primary.copy(
                                        alpha = 0.2f
                                    ) else MaterialTheme.colorScheme.background
                                )
                                .padding(16.dp)
                        )
                    }
                }
            }
        }

    }
}

@Preview(showBackground = true)
@Composable
fun MainScreenPreview() {
    TP2APP2Theme {
        MainScreen()
    }
}
