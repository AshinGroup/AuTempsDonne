package com.example.android_app

class Event {
    var id = 0
    var name = ""
    var description = ""
    var datetime = ""
    var capacity = 0
    var group = 0
    var place = ""
    var type = ""

    constructor(
        id: Int,
        name: String,
        description: String,
        datetime: String,
        capacity: Int,
        group: Int,
        place: String,
        type: String
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.datetime = datetime
        this.capacity = capacity
        this.group = group
        this.place = place
        this.type = type
    }
}