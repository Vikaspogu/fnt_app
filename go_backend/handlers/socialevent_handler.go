package handlers

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	c.BindJSON(&socialEvent)
	dao.UpdateSocialEvent(socialEvent)
}

//DeleteSocialEvent endpoint
func DeleteSocialEvent(c *gin.Context) {
	socialEventID := c.Param("id")
	dao.DeleteSocialEvent(socialEventID)
	c.String(http.StatusOK, "Delete Successful")
}

//UpdateImageSocial endpoint
func UpdateImageSocial(c *gin.Context) {
	var socialEvent models.SocialEvent
	c.BindJSON(&socialEvent)
	dao.UpdateImageSocial(socialEvent)
}
