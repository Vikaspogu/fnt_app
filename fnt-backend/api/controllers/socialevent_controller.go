package controllers

import (
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

//AllSocialEvents endpoint
func AllSocialEvents(c *gin.Context) {
	var socialEvent []models.SocialEvent
	err := db.Find(&socialEvent).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, socialEvent)
}

//CreateSocialEvent endpoint
func CreateSocialEvent(c *gin.Context) {
	var socialEvent models.SocialEvent
	_ = c.BindJSON(&socialEvent)
	err := db.Create(&socialEvent).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, socialEvent)
}

//UpdateSocialEvent endpoint
func UpdateSocialEvent(c *gin.Context) {
	var socialEvent models.SocialEvent
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&socialEvent).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&socialEvent)
	db.Save(&socialEvent)
	c.JSON(http.StatusOK, socialEvent)
}

//DeleteSocialEvent endpoint
func DeleteSocialEvent(c *gin.Context) {
	id := c.Params.ByName("id")
	var socialEvent models.SocialEvent
	db.Where("id = ?", id).Delete(&socialEvent)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
