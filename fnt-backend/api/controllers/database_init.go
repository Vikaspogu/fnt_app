package controllers

import (
	"fmt"
	"fnt-backend/api/models"
	"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/sqlite"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"log"
	"os"
)

var (
	db *gorm.DB
	err error
)

func init()  {
	err = godotenv.Load()
	if err != nil {
		log.Fatalf("Error getting env, not comming through %v", err)
	}

	username := os.Getenv("db_user")
	password := os.Getenv("db_pass")
	dbName := os.Getenv("db_name")
	dbHost := os.Getenv("db_host")
	dbUri := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=require password=%s",
		dbHost, username, dbName, password)

	fmt.Println(dbUri)
	db, err = gorm.Open("postgres", dbUri)
	//db, err = gorm.Open("sqlite3","./gorm.db")
	if err != nil {
		fmt.Println("Cannot connect to postgres database")
		log.Fatal("This is the error:", err)
	}
	fmt.Println("We are connected to the postgres database")
	db.Debug().AutoMigrate(&models.TechTalk{}, &models.SocialEvent{}, models.RequestedSocial{}, models.RequestedTalk{}, models.ReportedIssue{})
}
