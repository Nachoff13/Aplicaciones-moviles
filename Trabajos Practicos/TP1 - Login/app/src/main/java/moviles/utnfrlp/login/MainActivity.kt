package moviles.utnfrlp.login

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    // Definir una etiqueta para los logs
    private val TAG = "MainActivity"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val bIniciarSesion = findViewById<Button>(R.id.bIniciarSesion)
        bIniciarSesion.setOnClickListener{
            val etUsuario = findViewById<EditText>(R.id.etUsuario).text.toString()
            val etContrasena = findViewById<EditText>(R.id.etContrasena).text.toString()
            // Agregar logs para depuración
            Log.d(TAG, "Usuario ingresado: $etUsuario")
            Log.d(TAG, "Contraseña ingresada: $etContrasena")
            if (etUsuario == "Juan Torres" && etContrasena == "1234utn"){
                Log.i(TAG, "Login correcto")
                Toast.makeText(this, "Login correcto", Toast.LENGTH_SHORT).show()
            } else {
                Log.e(TAG, "Usuario o contraseña incorrectos")
                Toast.makeText(this, "Usuario o contraseña incorrectos", Toast.LENGTH_SHORT).show()
            }
        }
    }
}