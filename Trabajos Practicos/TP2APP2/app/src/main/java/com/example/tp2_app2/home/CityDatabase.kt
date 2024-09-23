package com.example.tp2_app2.home

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [City::class, Country::class], version = 1)
abstract class CityDatabase : RoomDatabase() {
    abstract fun cityDao(): CityDao
    abstract fun countryDao(): CountryDao
}