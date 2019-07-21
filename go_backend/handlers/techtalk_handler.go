package handlers

import (
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	c.BindJSON(&techtalk)
	dao.UpdateTechTalk(techtalk)
}

//DeleteTechTalk endpoint
func DeleteTechTalk(c *gin.Context) {
	techtalkID := c.Param("id")
	dao.DeleteTechTalk(techtalkID)
	c.String(http.StatusOK, "Delete Successful")
}

//UpdateImageTechTalk endpoint
func UpdateImageTechTalk(c *gin.Context) {
	var techtalk models.TechTalk
	c.BindJSON(&techtalk)
	dao.UpdateImageTechTalk(techtalk)
}
