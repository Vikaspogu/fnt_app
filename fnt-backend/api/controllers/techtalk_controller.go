package controllers

import (
	"fmt"
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	//_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/joho/godotenv"
	"log"
	"net/http"
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

func AllTechTalks(c *gin.Context)  {
	var techTalks []models.TechTalk
	err := db.Find(&techTalks).Error
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, techTalks)
}

//CreateTechTalk endpoint
func CreateTechTalk(c *gin.Context) {
	var techTalk models.TechTalk
	_ = c.BindJSON(&techTalk)
	err := db.Create(&techTalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, techTalk)
}

//UpdateTechTalk endpoint
func UpdateTechTalk(c *gin.Context) {
	var techtalk models.TechTalk
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&techtalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&techtalk)
	db.Save(&techtalk)
	c.JSON(http.StatusOK, techtalk)
}

//DeleteTechTalk endpoint
func DeleteTechTalk(c *gin.Context) {
	id := c.Params.ByName("id")
	var techtalk models.TechTalk
	d := db.Where("id = ?", id).Delete(&techtalk)
	fmt.Println(d)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
