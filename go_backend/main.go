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
	//request social event endpoints
	router.GET("/allrequestedsocial", AllRequestedSocial)
	router.POST("/requestedsocial", CreateRequestedSocial)
	router.PUT("/requestedsocial/:id", UpdateRequestedSocial)
	router.DELETE("/requestedsocial/:id", DeleteRequestedSocial)
	//request tech talk endpoints
	router.GET("/allrequestedtalk", AllRequestedTalk)
	router.POST("/requestedtalk", CreateRequestedTalk)
	router.PUT("/requestedtalk/:id", UpdateRequestedTalk)
	router.DELETE("/requestedtalk/:id", DeleteRequestedTalk)
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

//AllRequestedSocial endpoint
func AllRequestedSocial(c *gin.Context) {
	payload := dao.GetAllRequestedSocial()
	c.JSON(http.StatusOK, payload)
}

//CreateRequestedSocial endpoint
func CreateRequestedSocial(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	requestedSocial.ID = primitive.NewObjectID()
	requestedSocial.CreatedAt = time.Now()
	c.BindJSON(&requestedSocial)
	dao.InsertRequestedSocial(requestedSocial)
	c.JSON(http.StatusOK, requestedSocial)
}

//UpdateRequestedSocial endpoint
func UpdateRequestedSocial(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	requestedSocialID := c.Param("id")
	c.BindJSON(&requestedSocial)
	dao.UpdateRequestedSocial(requestedSocial, requestedSocialID)
}

//DeleteRequestedSocial endpoint
func DeleteRequestedSocial(c *gin.Context) {
	requestedSocialID := c.Param("id")
	dao.DeleteRequestedSocial(requestedSocialID)
	c.String(http.StatusOK, "Delete Successful")
}

//AllRequestedTalk endpoint
func AllRequestedTalk(c *gin.Context) {
	payload := dao.GetAllRequestedTalks()
	c.JSON(http.StatusOK, payload)
}

//CreateRequestedTalk endpoint
func CreateRequestedTalk(c *gin.Context) {
	var requestedTech models.RequestedTalk
	requestedTech.ID = primitive.NewObjectID()
	requestedTech.CreatedAt = time.Now()
	c.BindJSON(&requestedTech)
	dao.InsertRequestedTalk(requestedTech)
	c.JSON(http.StatusOK, requestedTech)
}

//UpdateRequestedTalk endpoint
func UpdateRequestedTalk(c *gin.Context) {
	var requestedTech models.RequestedTalk
	requestedTechID := c.Param("id")
	c.BindJSON(&requestedTech)
	dao.UpdateRequestedTalk(requestedTech, requestedTechID)
}

//DeleteRequestedTalk endpoint
func DeleteRequestedTalk(c *gin.Context) {
	requestedTechID := c.Param("id")
	dao.DeleteRequestedTalk(requestedTechID)
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
