package controllers

import (
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AllRequestedTalks(c *gin.Context)  {
	var requestedTalks []models.RequestedTalk
	err := db.Order("created_at desc").Find(&requestedTalks).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, requestedTalks)
}

//CreateRequestedTalk endpoint
func CreateRequestedTalk(c *gin.Context) {
	var requestedTalk models.RequestedTalk
	_ = c.BindJSON(&requestedTalk)
	err := db.Create(&requestedTalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, requestedTalk)
}

//UpdateRequestedTalk endpoint
func UpdateRequestedTalk(c *gin.Context) {
	var requestedTalk models.RequestedTalk
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&requestedTalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&requestedTalk)
	db.Save(&requestedTalk)
	c.JSON(http.StatusOK, requestedTalk)
}

//DeleteRequestedTalk endpoint
func DeleteRequestedTalk(c *gin.Context) {
	id := c.Params.ByName("id")
	var requestedTalk models.RequestedTalk
	db.Where("id = ?", id).Delete(&requestedTalk)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
