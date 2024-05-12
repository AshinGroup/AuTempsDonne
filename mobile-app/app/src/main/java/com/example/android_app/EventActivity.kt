package com.example.android_app

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.AuthFailureError
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.android_app.R
import org.json.JSONException
import org.json.JSONObject

class EventActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_event)

        val shp = getSharedPreferences("save", MODE_PRIVATE)
        val userId = shp.getString("userId", "")

        try {
            val queue = Volley.newRequestQueue(this)
            val apiRequest = object : StringRequest(
                Request.Method.GET,
                "https://au-temps-donne.fr/api/user/$userId",
                Response.Listener<String> { content ->
                    val eventList = mutableListOf<Event>()
                    val user = JSONObject(content)
                    val events = user.getJSONArray("events")
                    if (events.length() != 0) {
                        for (cpt in 0 until events.length()) {
                            var objGroup: String
                            val currentJsonObj = events.getJSONObject(cpt)
                            when (currentJsonObj.getInt("group")) {
                                1 -> objGroup = "Activity"
                                2 -> objGroup = "Course"
                                3 -> objGroup = "Service"
                                else -> {
                                    objGroup = "Not defined"
                                }
                            }

                            val e = Event(
                                currentJsonObj.getInt("id"),
                                currentJsonObj.getString("name"),
                                currentJsonObj.getString("description"),
                                currentJsonObj.getString("datetime"),
                                currentJsonObj.getInt("capacity"),
                                objGroup,
                                currentJsonObj.getString("place"),
                                currentJsonObj.getJSONObject("type").getString("name")
                            )
                            eventList.add(e)
                        }

                        val lv = findViewById<ListView>(R.id.lv_events)
                        val adap = EventAdapter(this, eventList)
                        lv.adapter = adap

                        lv.setOnItemClickListener { parent, view, position, id ->
                            val i = Intent(this, EventDetailsActivity::class.java)
                            val currentEventId = eventList[position].id
                            i.putExtra("eventId", currentEventId.toString())
                            startActivity(i)
                        }
                    } else {
                        findViewById<TextView>(R.id.event_title).setText("No Event Found")
                    }
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
