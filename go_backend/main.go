package main

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	router.Use(cors.Default())
	// Setup route group for the router
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	//Tech events endpoints
	router.GET("/alltechtalks", AllTechTalks)
	router.POST("/techtalk", CreateTechTalk)
	router.PUT("/techtalk/:id", UpdateTechTalk)
	router.DELETE("/techtalk/:id", DeleteTechTalk)
	//Social event endpoints
	router.GET("/allsocialevents", AllSocialEvents)
	router.POST("/socialevent", CreateSocialEvent)
	router.PUT("/socialevent/:id", UpdateSocialEvent)
	router.DELETE("/socialevent/:id", DeleteSocialEvent)
	// Start and run the server
	router.Run(":8080")
}

//AllTechTalks endpoint
func AllTechTalks(c *gin.Context) {
	payload := dao.GetAlltechtalk()
	c.JSON(http.StatusOK, payload)
}

//CreateTechTalk endpoint
func CreateTechTalk(c *gin.Context) {
	var techTalk models.TechTalk
	techTalk.ID = primitive.NewObjectID()
	techTalk.CreatedAt = time.Now()
	c.BindJSON(&techTalk)
	dao.InsertOneTalk(techTalk)
	c.JSON(http.StatusOK, techTalk)
}

//UpdateTechTalk endpoint
func UpdateTechTalk(c *gin.Context) {
	var techtalk models.TechTalk
	techtalkID := c.Param("id")
	c.BindJSON(&techtalk)
	dao.UpdateTechTalk(techtalk, techtalkID)
}

//DeleteTechTalk endpoint
func DeleteTechTalk(c *gin.Context) {
	techtalkID := c.Param("id")
	dao.DeleteTechTalk(techtalkID)
	c.String(http.StatusOK, "Delete Successful")
}

//AllSocialEvents endpoint
func AllSocialEvents(c *gin.Context) {
	payload := dao.GetAllSocialEvents()
	c.JSON(http.StatusOK, payload)
}

//CreateSocialEvent endpoint
func CreateSocialEvent(c *gin.Context) {
	var socialEvent models.SocialEvent
	socialEvent.ID = primitive.NewObjectID()
	socialEvent.CreatedAt = time.Now()
	c.BindJSON(&socialEvent)
	dao.InsertOneSocialEvent(socialEvent)
	c.JSON(http.StatusOK, socialEvent)
}

//UpdateSocialEvent endpoint
func UpdateSocialEvent(c *gin.Context) {
	var socialEvent models.SocialEvent
	socialEventID := c.Param("id")
	c.BindJSON(&socialEvent)
	dao.UpdateSocialEvent(socialEvent, socialEventID)
}

//DeleteSocialEvent endpoint
func DeleteSocialEvent(c *gin.Context) {
	socialEventID := c.Param("id")
	dao.DeleteSocialEvent(socialEventID)
	c.String(http.StatusOK, "Delete Successful")
}
