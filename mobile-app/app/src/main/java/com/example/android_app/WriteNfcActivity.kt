package com.example.android_app

import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.Toast

class WriteNfcActivity : AppCompatActivity(), NfcAdapter.ReaderCallback {
    private var nfcAdapter: NfcAdapter? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_write_nfc)
        try {
            nfcAdapter = NfcAdapter.getDefaultAdapter(this)
            if (nfcAdapter == null) {
                Toast.makeText(this, "This device does not support NFC.", Toast.LENGTH_SHORT)
                    .show()
                finish()
                return
            }

            if (!nfcAdapter!!.isEnabled) {
                var message = "Error: Activate NFC in your device settings."
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()

            }


        } catch (e: Exception) {
            Log.e("TagException", e.toString(), e)
            runOnUiThread {
                var message = "Error while scanning NFC : " + e.toString()
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

    override fun onTagDiscovered(tag: Tag?) {
        try {

            val beneficiaryId = 5
            val userId = NdefRecord.createMime(
                "application/android-app",
                beneficiaryId.toString().toByteArray(Charsets.UTF_8)
            )
            val message =
                NdefMessage(arrayOf(userId))

            tag?.let {
                val ndef = Ndef.get(tag)
                if (ndef != null) {
                    ndef.connect()
                    ndef.writeNdefMessage(message) // Écriture du message NDEF sur le tag NFC
                    ndef.close()
                    runOnUiThread {
                        var message = "NFC écrit avec succès !"
                        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()

                    }

                } else {
                    runOnUiThread {
                        var message =
                            "Erreur: La puce NFC n'est pas compatible avec l'écriture de données."
                        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        } catch (e: Exception) {
            runOnUiThread {
                var message = e.toString()
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
            }
            Log.e("ErrorWrite", e.toString())
        }
    }
}
