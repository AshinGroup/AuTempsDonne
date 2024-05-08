package com.example.android_app

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView

class EventAdapter: BaseAdapter {

    var context: Context
    var levents: MutableList<Event>

    constructor(context: Context, levents: MutableList<Event>) : super() {
        this.context = context
        this.levents = levents
    }


    override fun getCount(): Int {
        return this.levents.size
    }

    override fun getItem(position: Int): Any {
        return this.levents.get(position)
    }

    override fun getItemId(position: Int): Long {
        return 0
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        var v:View

        if (convertView == null) {
            var inflater = LayoutInflater.from(this.context)
            v = inflater.inflate(R.layout.row_event, null)
        } else {
            v = convertView
        }
        var current_event = getItem(position) as Event

        var tv_event_name = v.findViewById<TextView>(R.id.tv_event_name)
        var tv_event_type = v.findViewById<TextView>(R.id.tv_event_type)
        var tv_event_datetime = v.findViewById<TextView>(R.id.tv_event_datetime)
        var tv_event_place = v.findViewById<TextView>(R.id.tv_event_place)

        tv_event_name.setText(current_event.name)
        tv_event_datetime.setText("Date : " + current_event.datetime)
        tv_event_type.setText("Type : " + current_event.type)
        tv_event_place.setText("Location : " + current_event.place)


        return v
    }
}