package com.example.tp2_app2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.tp2_app2.ui.theme.TP2APP2Theme

class AddCityActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TP2APP2Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AddCityScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun AddCityScreen(modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(16.dp)) {
        Text(
            text = "Agregar Ciudad",
            modifier = Modifier
                .padding(bottom = 35.dp)
                .align(Alignment.CenterHorizontally)
        )

        TextField(
            value = "",
            onValueChange = {},
            label = { Text("Nombre") },
            modifier = Modifier.padding(bottom = 16.dp)
        )

        TextField(
            value = "",
            onValueChange = {},
            label = { Text("Pais") },
            modifier = Modifier.padding(bottom = 16.dp)
        )

        TextField(
            value = "",
            onValueChange = {},
            label = { Text("Población") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number) // Configura el teclado para aceptar solo números
        )

    }
}

@Preview(showBackground = true)
@Composable
fun AddCityScreenPreview() {
    TP2APP2Theme {
        AddCityScreen()
    }
}