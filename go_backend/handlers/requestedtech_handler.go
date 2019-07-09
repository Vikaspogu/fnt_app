package handlers

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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