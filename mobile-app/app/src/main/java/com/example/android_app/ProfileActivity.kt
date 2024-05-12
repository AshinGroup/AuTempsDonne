package com.example.android_app

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.AuthFailureError
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONException
import org.json.JSONObject

class ProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        val shp = getSharedPreferences("save", MODE_PRIVATE)
        val userId = shp.getString("userId", "")

        try {
            val queue = Volley.newRequestQueue(this)
            val apiRequest = object : StringRequest(
                Request.Method.GET,
                "https://au-temps-donne.fr/api/user/$userId",
                Response.Listener<String> { content ->
                    Log.d("Response", content.toString())
                    val user = JSONObject(content)

                    findViewById<TextView>(R.id.user_first_name).text = "First Name : " + user.getString("first_name")
                    findViewById<TextView>(R.id.user_last_name).text = "Last Name : " + user.getString("last_name")
                    findViewById<TextView>(R.id.user_email).text = "Email : " + user.getString("email")
                    findViewById<TextView>(R.id.user_phone).text = "Phone : " + user.getString("phone")

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
            ) {
                override fun getHeaders(): Map<String, String> {
                    val headers = HashMap<String, String>()
                    val token = shp.getString("accessToken", "")
                    headers["Authorization"] = "Bearer " + token.toString()
                    return headers
                }
            }
            queue.add(apiRequest)
        } catch (e: Exception) {
            Log.e("Error", "Error sending request: ${e.message}")

        }

        findViewById<ImageView>(R.id.button_back).setOnClickListener {
            finish()
        }
    }
}
