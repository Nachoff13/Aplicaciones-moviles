package com.example.tp2_app2.home

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class City (
    @PrimaryKey(autoGenerate = true)
    val cityId: Int,
    val name: String,
    val population: Int,
    val countryId: Int
)
