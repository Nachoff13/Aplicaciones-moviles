package com.example.tp2_app2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
        var searchCountry by remember { mutableStateOf("") }
        var selectedCountry by remember { mutableStateOf<String?>(null) }
        var showCountryList by remember { mutableStateOf(true) }

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
        val filteredCountries = countries.filter { it.contains(searchCountry, ignoreCase = true) } // países filtrados

        SearchCityBar(
            searchCity = searchCity,
            onSearchCityChange = { searchCity = it }
        )

        CountrySearchBar(
            searchCountry = searchCountry,
            onSearchCountryChange = { newSearchCountry ->
                searchCountry = newSearchCountry
                showCountryList = true
            },
            onCountrySelected = { country ->
                selectedCountry = country
                searchCountry = country
                showCountryList = false
            },
            showCountryList = showCountryList
        )

        if (searchCountry.isNotEmpty() && showCountryList) {
            CountryList(
                countries = filteredCountries,
                onCountrySelected = { country ->
                    selectedCountry = country
                    searchCountry = country
                    showCountryList = false
                },
                selectedCountry = selectedCountry
            )
        }
        CityTableWithHorizontalScroll(cities = sampleCities)
    }
}

@Composable
fun SearchCityBar(
    searchCity: String,
    onSearchCityChange: (String) -> Unit
) {
    Row(modifier = Modifier.padding(bottom = 8.dp)) {
        TextField(
            value = searchCity,
            onValueChange = onSearchCityChange,
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
}

@Composable
fun CountrySearchBar(
    searchCountry: String,
    onSearchCountryChange: (String) -> Unit,
    onCountrySelected: (String) -> Unit,
    showCountryList: Boolean
) {
    Row(modifier = Modifier.padding(bottom = 8.dp)) {
        TextField(
            value = searchCountry,
            onValueChange = onSearchCountryChange,
            label = { Text("Buscar país") },
            modifier = Modifier
                .weight(1f)
                .padding(end = 8.dp) // Espacio entre TextField y el botón
        )

        Button(
            onClick = { /* Acción para eliminar ciudades asociadas */ },
            modifier = Modifier
                .alignByBaseline()
                .wrapContentHeight() // Permitir que el botón ajuste su altura según el contenido
        ) {
            Text(
                text = "Eliminar ciudades\nasociadas",
                style = MaterialTheme.typography.bodySmall,
                maxLines = 2
            )
        }
    }
}

@Composable
fun CountryList(
    countries: List<String>,
    onCountrySelected: (String) -> Unit,
    selectedCountry: String?
) {
    LazyColumn {
        items(countries) { country ->
            Text(
                text = country,
                modifier = Modifier
                    .padding(vertical = 8.dp)
                    .clickable {
                        onCountrySelected(country)
                    }
                    .background(
                        if (selectedCountry == country) MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                        else MaterialTheme.colorScheme.background
                    )
                    .padding(16.dp)
            )
        }
    }
}


@Composable
fun TableHeader(text: String) {
    Text(
        text = text,
        modifier = Modifier
            .padding(8.dp),
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onPrimary
    )
}

@Composable
fun CityTableRow(city: City) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .background(MaterialTheme.colorScheme.background)
    ) {
        TableCell(text = city.name)
        TableCell(text = city.country)
        TableCell(text = city.population.toString())
        TableCell(
            text = "Acciones", // Aquí puedes poner iconos o botones para acciones
            modifier = Modifier
                .clickable { /* Acción de botón */ }
        )
    }
}

@Composable
fun TableCell(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text,
        modifier = modifier
            .padding(8.dp),
        style = MaterialTheme.typography.bodyMedium
    )
}

@Composable
fun CityTableWithHorizontalScroll(
    cities: List<City>,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        // Encabezados de la tabla
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.primary)
                .padding(8.dp)
        ) {
            TableHeader(text = "Nombre")
            TableHeader(text = "País")
            TableHeader(text = "Población")
            TableHeader(text = "Acciones")
        }

        // Lista de ciudades con desplazamiento horizontal
        LazyRow(modifier = Modifier.fillMaxWidth()) {
            items(cities) { city ->
                CityTableRow(city = city)
            }
        }
    }
}

data class City(
    val name: String,
    val country: String,
    val population: Int
)
val sampleCities = listOf(
    City(name = "Buenos Aires", country = "Argentina", population = 2890151),
    City(name = "La Paz", country = "Bolivia", population = 764945),
    City(name = "Brasilia", country = "Brasil", population = 3055149),
    City(name = "Santiago", country = "Chile", population = 5060680),
    City(name = "Bogotá", country = "Colombia", population = 7743955),
    City(name = "Quito", country = "Ecuador", population = 2638616),
    City(name = "Asunción", country = "Paraguay", population = 528592),
    City(name = "Lima", country = "Perú", population = 9740910),
    City(name = "Montevideo", country = "Uruguay", population = 1310530),
    City(name = "Caracas", country = "Venezuela", population = 2851580)
)


@Preview(showBackground = true)
@Composable
fun MainScreenPreview() {
    TP2APP2Theme {
        MainScreen()
    }
}
