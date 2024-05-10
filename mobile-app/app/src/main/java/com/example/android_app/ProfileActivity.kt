package com.example.android_app

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONException
import org.json.JSONObject

class ProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        var shp = getSharedPreferences("save", MODE_PRIVATE)
        // var accessToken = shp.getString("accessToken", "")
        var userId = shp.getString("userId", "")

        try {
            var queue = Volley.newRequestQueue(this)
            var apiRequest = StringRequest(
                Request.Method.GET,
                "https://au-temps-donne.fr/api/user/" + userId,
                Response.Listener<String> { content ->
                    Log.d("Response", content.toString())
                    var user = JSONObject(content)

                    findViewById<TextView>(R.id.user_first_name).setText("First Name : " + user.getString("first_name"))
                    findViewById<TextView>(R.id.user_last_name).setText("Last Name : " + user.getString("last_name"))
                    findViewById<TextView>(R.id.user_email).setText("Email : " + user.getString("email"))
                    findViewById<TextView>(R.id.user_phone).setText("Phone : " + user.getString("phone"))

                },
                Response.ErrorListener { error ->
                    Log.d("Error", error.toString())
                    if (error.networkResponse != null && error.networkResponse.data != null) {
                        try {
                            val errorJsonString = String(error.networkResponse.data)
                            val errorJsonObject = JSONObject(errorJsonString)
                            val errorMessage = errorJsonObject.getString("message")
                            Toast.makeText(applicationContext, errorMessage, Toast.LENGTH_LONG).show()

                            // Display the error message to the user or handle it as needed.
                        } catch (e: JSONException) {
                            Log.e("Error", "Error parsing JSON error response: ${e.message}")
                        }
                    } else {
                        Log.e("Error", "Network error occurred.")
                    }
                }
            )
            queue.add(apiRequest)
        } catch (e: Exception) {
            Log.e("Error", "Error sending request: ${e.message}")

        }

        findViewById<ImageView>(R.id.button_back).setOnClickListener {
            finish()
        }
    }
}