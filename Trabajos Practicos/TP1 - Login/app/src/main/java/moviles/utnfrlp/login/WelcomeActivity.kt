package moviles.utnfrlp.login

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import android.widget.CheckBox
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        // Obtener el nombre del usuario pasado desde MainActivity
        val username = intent.getStringExtra("USERNAME")
        val welcomeMessage = findViewById<TextView>(R.id.tvWelcome)
        welcomeMessage.text = "Bienvenido a la aplicación $username"

        // Referencias a los elementos de la interfaz
        val platformRadioGroup = findViewById<RadioGroup>(R.id.rgPlataforma)
        val platformImageView = findViewById<ImageView>(R.id.ivPlatformLogo)
        val cbOtra = findViewById<CheckBox>(R.id.cbOtra)
        val etOtherPreference = findViewById<EditText>(R.id.etOtherPreference)

        // Configurar el listener para el RadioGroup
        platformRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.rbAndroid -> {
                    platformImageView.setImageResource(R.drawable.logo_android)
                }
                R.id.rbIOS -> {
                    platformImageView.setImageResource(R.drawable.logo_ios)
                }
            }
        }

        // Configurar el listener para el CheckBox "Otra"
        cbOtra.setOnCheckedChangeListener { _, isChecked ->
            etOtherPreference.visibility = if (isChecked) View.VISIBLE else View.GONE
        }
    }
}
