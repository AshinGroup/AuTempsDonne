package com.example.android_app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONException
import org.json.JSONObject

class EventDetailsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_event_details)

        var shp = getSharedPreferences("save", MODE_PRIVATE)
        // var accessToken = shp.getString("accessToken", "")
        var eventId = intent.getStringExtra("eventId")
        Log.d("eventID", eventId.toString())

        try {
            var queue = Volley.newRequestQueue(this)
            var apiRequest = StringRequest(
                Request.Method.GET,
                "http://10.0.2.2:5000/api/event/" + eventId,
                Response.Listener<String> { content ->
                    Log.d("Response", content.toString())
                    var event = JSONObject(content)

                    var objGroup: String
                    when(event.getInt("group")) {
                        1 -> objGroup = "Activity"
                        2 -> objGroup = "Course"
                        3 -> objGroup = "Service"
                        else -> {
                            objGroup = "Not defined"
                        }
                    }
                    findViewById<TextView>(R.id.event_name).setText(event.getString("name"))
                    findViewById<TextView>(R.id.event_description).setText("Description : " + event.getString("description"))
                    findViewById<TextView>(R.id.event_datetime).setText("Date : " + event.getString("datetime"))
                    findViewById<TextView>(R.id.event_capacity).setText("Capacity : " + event.getInt("capacity").toString())
                    findViewById<TextView>(R.id.event_group).setText(objGroup)
                    findViewById<TextView>(R.id.event_place).setText("Location : " + event.getString("place"))
                    findViewById<TextView>(R.id.event_type).setText("Type : " + event.getJSONObject("type").getString("name"))

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

        findViewById<Button>(R.id.button_nfc).setOnClickListener {
            val i = Intent(this, NfcActivity::class.java)
            i.putExtra("eventId", eventId.toString())
            startActivity(i)
        }

        findViewById<ImageView>(R.id.button_back).setOnClickListener {
            finish()
        }
    }


}