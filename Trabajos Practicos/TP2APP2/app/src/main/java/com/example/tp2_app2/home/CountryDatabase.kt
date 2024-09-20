package com.example.tp2_app2.home

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [Country::class], version = 1)
abstract class CountryDatabase: RoomDatabase(){
    abstract val dao: CountryDao
}