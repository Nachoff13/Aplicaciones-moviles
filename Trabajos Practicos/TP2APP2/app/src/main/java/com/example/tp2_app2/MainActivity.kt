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
import com.example.tp2_app2.home.HomeScreen
import com.example.tp2_app2.home.HomeViewModel
import com.example.tp2_app2.home.CityDatabase
import com.example.tp2_app2.ui.theme.TP2APP2Theme



class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TP2APP2Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                    ){
                    val database = Room.databaseBuilder(this, CityDatabase::class.java, "city_db").build()
                    val dao = database.dao
                    val viewModel by viewModels<HomeViewModel>(factoryProducer = {
                        object : ViewModelProvider.Factory {
                            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                return HomeViewModel(dao) as T
                            }
                        }
                    })
                    HomeScreen(viewModel)
                }
            }
        }
    }
}

