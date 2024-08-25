package moviles.utnfrlp.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val bRegistrarse = findViewById<Button>(R.id.bRegistrarse)
        bRegistrarse.setOnClickListener{

            val etNombre = findViewById<EditText>(R.id.etNombre).text.toString()
            val etCorreo = findViewById<EditText>(R.id.etCorreo).text.toString()
            val etContrasena = findViewById<EditText>(R.id.etContraseña).text.toString()
            val etRepetirContrasena = findViewById<EditText>(R.id.etRepetirContraseña).text.toString()

            var valid = true

            if (etNombre.isEmpty()) {
                Toast.makeText(this, "Debe ingresar un Nombre", Toast.LENGTH_SHORT).show()
                valid = false
            }

            if (etCorreo.isEmpty()) {
                Toast.makeText(this, "Debe ingresar un correo", Toast.LENGTH_SHORT).show()
                valid = false
            }

            if (etContrasena.length < 6) {
                Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show()
                valid = false
            }

            if (etContrasena != etRepetirContrasena) {
                Toast.makeText(this, "Las contraseñas no coinciden", Toast.LENGTH_SHORT).show()
                valid = false
            }

            if (valid) {
                Toast.makeText(this, "Registro exitoso", Toast.LENGTH_SHORT).show()

                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
            }

        }
    }


}