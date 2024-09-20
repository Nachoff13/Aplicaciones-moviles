package com.example.tp2_app2

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class Country (
    @PrimaryKey(autoGenerate = true)
    val countryId: String,
    val name: String,
    val population: Int,

)
