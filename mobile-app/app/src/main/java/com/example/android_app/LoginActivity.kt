package com.example.android_app

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.Toast

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        var button_confirm = findViewById<Button>(R.id.button_confirm)

        button_confirm.setOnClickListener {
            Toast.makeText(applicationContext, "Hello ESGI", Toast.LENGTH_SHORT).show()
        }
    }
}