package com.example.tp2_app2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.room.Room
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.tp2_app2.home.*
import com.example.tp2_app2.ui.theme.TP2APP2Theme

class MainActivity : ComponentActivity() {
    // ViewModel creado para usar en toda la actividad
    private val viewModel by viewModels<HomeViewModel> {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                // Crear la base de datos y obtener ambos DAOs
                val database = Room.databaseBuilder(
                    applicationContext,
                    CityDatabase::class.java,
                    "city_db"
                ).build()

                val cityDao = database.cityDao()
                val countryDao = database.countryDao()

                // Retornar el ViewModel con los DAOs
                return HomeViewModel(cityDao, countryDao) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TP2APP2Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // Configurar la navegación
                    val navController = rememberNavController()
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") { HomeScreen(navController, viewModel) }
                        composable("add_city") { AddCityScreen(navController, viewModel) }
                        composable("search_city") { SearchCityScreen(navController, viewModel) }
                        composable("delete_city") { DeleteCityScreen(navController, viewModel) }
                        composable("delete_cities_by_country") { DeleteCitiesByCountryScreen(navController, viewModel) }
                        composable("update_population") { UpdatePopulationScreen(navController, viewModel) }
                    }
                }
            }
        }
    }
}
