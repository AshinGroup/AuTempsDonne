package com.example.android_app

import android.Manifest
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.IsoDep
import android.nfc.tech.Ndef
import android.nfc.tech.NfcA
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.io.IOException

class NfcActivity : AppCompatActivity(), NfcAdapter.ReaderCallback {
    private var nfcAdapter: NfcAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nfc)

        try {
            nfcAdapter = NfcAdapter.getDefaultAdapter(this)
            if (nfcAdapter == null) {
                Toast.makeText(this, "This device does not support NFC.", Toast.LENGTH_SHORT).show()
                finish()
                return
            }

            if (!nfcAdapter!!.isEnabled) {
                var message = "Error: Activate NFC in your device settings."
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()

            }


        }catch (e: Exception){
            Log.e("ExceptionTag", e.toString(), e)
            runOnUiThread {
                var message ="Error while scanning NFC: " + e.toString()
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
            }
        }

        findViewById<ImageView>(R.id.button_back).setOnClickListener {
            finish()
        }
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableReaderMode(this, this, NfcAdapter.FLAG_READER_NFC_A, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
    }

    override fun onTagDiscovered(tag: Tag) {
        tag?.let {
            try {
                val ndef = Ndef.get(it)
                if (ndef == null) {
                    runOnUiThread {
                        var message = "The NFC token is empty."
                        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                    }
                } else {
                    var userId = "${
                        java.lang.String(
                            ndef.cachedNdefMessage?.records?.get(
                                0
                            )?.payload
                        )
                    }"
                    runOnUiThread {
                        var message = "Beneficiary ID : $userId"
                        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Log.e("TagException", e.toString(), e)
                runOnUiThread {
                    var message = "The NFC token is empty."
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}