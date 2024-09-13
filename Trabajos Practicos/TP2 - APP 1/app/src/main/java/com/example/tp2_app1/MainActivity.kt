package com.example.tp2_app1

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.tp2_app1.ui.theme.TP2APP1Theme
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ElevatedButton
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import kotlin.random.Random


class MainActivity : ComponentActivity() {

    var correctNumber: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {

        correctNumber = Random.nextInt(1, 6) // el rango es de 1 a 5 ya que la función no incluye el valor máximo

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var puntaje = remember { mutableStateOf(0) }
            var currentCorrectNumber = remember { mutableStateOf(correctNumber) }
            TP2APP1Theme {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(vertical = 16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {

                    Spacer(modifier = Modifier.size(16.dp))
                    Titulo("Puntaje Actual: ${puntaje.value}", Color.Black)
                    Spacer(modifier = Modifier.size(8.dp))

                    Subtitulo("Mejor Puntaje: 0", Color.Gray)
                    Spacer(modifier = Modifier.size(300.dp))

                    Text("Número Correcto: ${currentCorrectNumber.value}", color = Color.Red, fontSize = 24.sp)
                    Spacer(modifier = Modifier.size(16.dp))

                    ElevatedButton(onClick = {
                        currentCorrectNumber.value = Random.nextInt(1, 6)
                    }) {
                        Text("Generar Nuevo Número Correcto")
                    }
                    Spacer(modifier = Modifier.size(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)){
                        for (i in 1..5){
                            NumberButton(
                                number = i,
                                correctNumber = currentCorrectNumber.value,
                                onCorrectGuess = {
                                    //Sumo 10 puntos al puntaje y genero un nuevo número correcto
                                    puntaje.value += 10
                                    currentCorrectNumber.value = Random.nextInt(1, 6)

                                },
                                onIncorrectGuess = {
                                    //Reseteo el puntaje a 0 y genero un nuevo número correcto
                                    puntaje.value = 0
                                    currentCorrectNumber.value = Random.nextInt(1, 6)
                                }
                            )
                        }
                    }

                }
            }
        }
    }
}

@Composable
fun Titulo(text: String,color: Color, modifier: Modifier = Modifier) {
    Text(
        text = text,
        color = color,
        fontSize = 32.sp,
        fontWeight = FontWeight.Bold,
        modifier = modifier
    )
}

@Composable
fun Subtitulo(text: String,color: Color, modifier: Modifier = Modifier) {
    Text(
        text = text,
        color = color,
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        modifier = modifier
    )
}

@Composable
fun NumberButton(number: Int, correctNumber: Int, onCorrectGuess: () -> Unit, onIncorrectGuess: () -> Unit){
    ElevatedButton(onClick = {
        if (number == correctNumber) {
            onCorrectGuess()

        }else{
            onIncorrectGuess()
        }
    },
        modifier = Modifier.size(50.dp),
        colors = ButtonColors(
            contentColor = Color.Black,
            containerColor = Color(0xFF9C27B0),
            disabledContentColor = Color.Gray,
            disabledContainerColor = Color(0x669C27B0),
        ),
        elevation = ButtonDefaults.buttonElevation()
    ){
        Text(
            text = number.toString(),
            color = Color.White,
            fontSize = 24.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxSize()
        )
    }
}