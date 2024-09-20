package com.example.tp2_app2

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ForeignKey

@Entity
data class City (
    @PrimaryKey(autoGenerate = true)
    val cityId: String,
    val name: String,
    val population: Int,
    val countryId: Int
)
