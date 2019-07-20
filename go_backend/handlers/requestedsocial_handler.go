package handlers

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	requestedSocial.Votes = []string{}
	c.BindJSON(&requestedSocial)
	dao.InsertRequestedSocial(requestedSocial)
	c.JSON(http.StatusOK, requestedSocial)
}

//UpdateSocialVotes endpoint
func UpdateSocialVotes(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	c.BindJSON(&requestedSocial)
	dao.UpdateSocialVotes(requestedSocial)
}

//UpdateRequestedSocial endpoint
func UpdateRequestedSocial(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	c.BindJSON(&requestedSocial)
	dao.UpdateRequestedSocial(requestedSocial)
}

//PromoteSocialRequest endpoint
func PromoteSocialRequest(c *gin.Context) {
	var requestedSocial models.RequestedSocial
	c.BindJSON(&requestedSocial)
	dao.PromoteSocialRequest(requestedSocial)
}

//DeleteRequestedSocial endpoint
func DeleteRequestedSocial(c *gin.Context) {
	requestedSocialID := c.Param("id")
	dao.DeleteRequestedSocial(requestedSocialID)
	c.String(http.StatusOK, "Delete Successful")
}
