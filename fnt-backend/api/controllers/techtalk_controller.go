package controllers

import (
	"fmt"
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AllTechTalks(c *gin.Context)  {
	var techTalks []models.TechTalk
	err := db.Order("created_at desc").Find(&techTalks).Error
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, techTalks)
}

//CreateTechTalk endpoint
func CreateTechTalk(c *gin.Context) {
	var techTalk models.TechTalk
	_ = c.BindJSON(&techTalk)
	err := db.Create(&techTalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, techTalk)
}

//UpdateTechTalk endpoint
func UpdateTechTalk(c *gin.Context) {
	var techtalk models.TechTalk
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&techtalk).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&techtalk)
	db.Save(&techtalk)
	c.JSON(http.StatusOK, techtalk)
}

//DeleteTechTalk endpoint
func DeleteTechTalk(c *gin.Context) {
	id := c.Params.ByName("id")
	var techtalk models.TechTalk
	d := db.Where("id = ?", id).Delete(&techtalk)
	fmt.Println(d)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
