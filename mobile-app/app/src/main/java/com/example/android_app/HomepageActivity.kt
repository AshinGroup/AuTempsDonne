package com.example.android_app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import androidx.appcompat.widget.Toolbar

class HomepageActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_homepage)

        val toolbar: Toolbar = findViewById(R.id.toolbar)

        setSupportActionBar(toolbar)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val inflater: MenuInflater = menuInflater
        inflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.menu_event -> {
                menuEvent()
                true
            }
            R.id.menu_profile-> {
                menuProfile()
                true
            }
            R.id.menu_logout -> {
                logOut()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun menuEvent() {
        val i = Intent(this, EventActivity::class.java)
        startActivity(i)
    }

    fun menuProfile() {
        val i = Intent(this, ProfileActivity::class.java)
        startActivity(i)
    }

    fun logOut() {
        var shp = getSharedPreferences("save", MODE_PRIVATE)
        shp.edit().clear().apply()
        finish()
    }
}