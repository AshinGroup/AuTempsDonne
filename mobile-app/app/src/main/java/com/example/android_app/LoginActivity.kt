package com.example.android_app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONException
import org.json.JSONObject


class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        var button_confirm = findViewById<Button>(R.id.button_confirm)

        button_confirm.setOnClickListener {
            var queue = Volley.newRequestQueue(this)
            var jsonBody = JSONObject()
            jsonBody.put("email", findViewById<EditText>(R.id.email).text.toString())
            jsonBody.put("password", findViewById<EditText>(R.id.password).text.toString())

            var jsonObjectRequest = JsonObjectRequest(Request.Method.POST,
                "http://10.0.2.2:5000/api/login",
                jsonBody,
                Response.Listener<JSONObject>() { content ->
                    var role_id = content.getInt("role_id")
                    if (role_id != 2){
                        var message = "The user is not a volunteer."
                        Toast.makeText(applicationContext, message, Toast.LENGTH_LONG).show()
                    } else {
                        var shp = getSharedPreferences("save", MODE_PRIVATE)
                        shp.edit().putString("accessToken", content.getString("access_token")).apply()
                        shp.edit().putString("refreshToken", content.getString("refresh_token")).apply()
                        shp.edit().putString("userId", content.getInt("user_id").toString()).apply()
                        findViewById<EditText>(R.id.email).setText("")
                        findViewById<EditText>(R.id.password).setText("")
                        val i = Intent(this, HomepageActivity::class.java)
                        startActivity(i)

                    }

                },
                Response.ErrorListener { error ->
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
            queue.add(jsonObjectRequest)
        }
    }
}