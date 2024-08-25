package moviles.utnfrlp.login

import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

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
        val submitButton = findViewById<Button>(R.id.submitButton)

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

        // Configurar el listener para el botón de enviar
        submitButton.setOnClickListener {
            collectPreferences()
        }
    }

    private fun collectPreferences() {
        val preferencesList = mutableListOf<String>()

        // Obtener las preferencias seleccionadas
        val cbProgramacion = findViewById<CheckBox>(R.id.cbProgramacion)
        val cbRedes = findViewById<CheckBox>(R.id.cbRedes)
        val cbSeguridad = findViewById<CheckBox>(R.id.cbSeguridad)
        val cbHardware = findViewById<CheckBox>(R.id.cbHardware)
        val cbOtra = findViewById<CheckBox>(R.id.cbOtra)
        val etOtherPreference = findViewById<EditText>(R.id.etOtherPreference)

        if (cbProgramacion.isChecked) {
            preferencesList.add(cbProgramacion.text.toString())
        }
        if (cbRedes.isChecked) {
            preferencesList.add(cbRedes.text.toString())
        }
        if (cbSeguridad.isChecked) {
            preferencesList.add(cbSeguridad.text.toString())
        }
        if (cbHardware.isChecked) {
            preferencesList.add(cbHardware.text.toString())
        }
        if (cbOtra.isChecked) {
            val otherPreference = etOtherPreference.text.toString().trim()
            if (otherPreference.isNotEmpty()) {
                preferencesList.add(otherPreference)
            }
        }

        // Ahora puedes usar `preferencesList` como necesites
        Toast.makeText(this, "Preferencias seleccionadas: $preferencesList", Toast.LENGTH_LONG).show()
    }
}
