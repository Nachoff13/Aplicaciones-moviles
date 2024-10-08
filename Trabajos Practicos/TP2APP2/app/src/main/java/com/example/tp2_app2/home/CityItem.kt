package com.example.tp2_app2.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier


@Composable
fun CityItem(
    city: City,
    countries: List<Country>,
    modifier: Modifier = Modifier
) {
    // Buscar el país correspondiente
    val countryName = countries.find { it.countryId == city.countryId }?.name ?: "País desconocido"

    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = "Ciudad: ${city.name}, Población: ${city.population}, País: $countryName")
    }
}


