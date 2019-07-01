package main

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var techTalk []models.TechTalk

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	// Setup route group for the router
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.GET("/alltechtalks", AllTechTalks)
	router.POST("/techtalk", CreateTechTalk)
	router.PUT("/techtalk/{id}", UpdateTechTalk)
	router.DELETE("/techtalk", DeleteTechTalk)
	router.GET("/techtalk/{id}", FindTechTalk)
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
	dao.InsertOneValue(techTalk)
	c.JSON(http.StatusOK, techTalk)
}

//UpdateTechTalk endpoint
func UpdateTechTalk(c *gin.Context) {
	techtalkID := c.Param("id")
	var techtalk models.TechTalk
	dao.UpdateTechTalk(techtalk, techtalkID)
}

//FindTechTalk endpoint
func FindTechTalk(c *gin.Context) {
	c.String(http.StatusOK, "not implemented yet !")
}

//DeleteTechTalk endpoint
func DeleteTechTalk(c *gin.Context) {
	c.String(http.StatusOK, "not implemented yet !")
}
