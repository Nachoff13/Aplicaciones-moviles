package moviles.utnfrlp.login

import android.os.Bundle
import android.widget.CheckBox
import android.widget.EditText
import android.widget.ImageView
import android.widget.RadioGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class WelcomeActivity : AppCompatActivity() {

    private lateinit var welcomeMessage: TextView
    private lateinit var platformLogo: ImageView
    private lateinit var rgPlatform: RadioGroup
    private lateinit var cbOther: CheckBox
    private lateinit var etOtherPreference: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)

        welcomeMessage = findViewById(R.id.tvWelcomeMessage)
        platformLogo = findViewById(R.id.imgPlatformLogo)
        rgPlatform = findViewById(R.id.rgPlatform)
        cbOther = findViewById(R.id.cbOther)
        etOtherPreference = findViewById(R.id.etOtherPreference)

        // Obtén el nombre del usuario desde el intent y muestra el mensaje de bienvenida
        val username = intent.getStringExtra("username") ?: "Usuario"
        welcomeMessage.text = "Bienvenido a la aplicación $username"

        // Listener para mostrar el logo de la plataforma seleccionada
        rgPlatform.setOnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.rbAndroid -> platformLogo.setImageResource(R.drawable.android_logo)
                R.id.rbIOS -> platformLogo.setImageResource(R.drawable.ios_logo)
            }
        }

        // Listener para mostrar el campo de texto "Otra" si se selecciona la opción "Otra"
        cbOther.setOnCheckedChangeListener { buttonView, isChecked ->
            etOtherPreference.visibility = if (isChecked) View.VISIBLE else View.GONE
        }
    }
}
