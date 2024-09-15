package com.example.tp2_app2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
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

        var search by remember { mutableStateOf("") }

        Row(modifier = Modifier.padding(bottom = 8.dp)) {

            TextField(
                value = search,
                onValueChange = { search = it },
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
}

@Preview(showBackground = true)
@Composable
fun MainScreenPreview() {
    TP2APP2Theme {
        MainScreen()
    }
}
