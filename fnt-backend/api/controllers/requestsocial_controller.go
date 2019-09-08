package controllers

import (
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AllRequestedSocials(c *gin.Context)  {
	var requestedSocials []models.RequestedSocial
	err := db.Order("created_at desc").Find(&requestedSocials).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, requestedSocials)
}

//CreateRequestedSocial endpoint
func CreateRequestedSocial(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	_ = c.BindJSON(&requestedSocial)
	err := db.Create(&requestedSocial).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, requestedSocial)
}

//UpdateRequestedSocial endpoint
func UpdateRequestedSocial(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&requestedSocial).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&requestedSocial)
	db.Save(&requestedSocial)
	c.JSON(http.StatusOK, requestedSocial)
}

//DeleteRequestedSocial endpoint
func DeleteRequestedSocial(c *gin.Context) {
	id := c.Params.ByName("id")
	var requestedSocial models.RequestedSocial
	db.Where("id = ?", id).Delete(&requestedSocial)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
