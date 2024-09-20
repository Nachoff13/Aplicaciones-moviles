package com.example.tp2_app2.home

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface CityDao {
    //aca van las querys a la DB

    @Insert(onConflict = OnConflictStrategy.REPLACE) //con esto realizamos el create y update en conjunto, si el archivo tiene la misma PK q otro, lo reemplaza
    suspend fun insertCity(city: City)

    @Query ("SELECT * FROM city") //es el read y si o si hay que escribir codigo SQL
    suspend fun getAllCity(): Flow<List<City>>

    @Delete
    suspend fun deleteCity(city: City)
}