package moviles.utnfrlp.login

import android.content.Intent
import android.os.Bundle
import android.widget.CheckBox
import android.widget.EditText
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_welcome)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Obtener el nombre del usuario desde el Intent
        val username = intent.getStringExtra("USERNAME")
        val tvWelcomeMessage = findViewById<TextView>(R.id.tvWelcomeMessage)
        tvWelcomeMessage.text = "Bienvenido a la aplicación $username"

        val radioGroupPlatform = findViewById<RadioGroup>(R.id.radioGroupPlatform)
        val cbOther = findViewById<CheckBox>(R.id.cbOther)
        val etOtherPreference = findViewById<EditText>(R.id.etOtherPreference)

        cbOther.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                etOtherPreference.visibility = android.view.View.VISIBLE
            } else {
                etOtherPreference.visibility = android.view.View.GONE
            }
        }
    }
}
