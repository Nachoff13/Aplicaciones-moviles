package com.example.tp2_app2

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class City (
    @PrimaryKey(autoGenerate = true)
    val id: String,
    val name: String,

)
