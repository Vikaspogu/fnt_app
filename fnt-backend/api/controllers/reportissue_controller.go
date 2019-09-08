package controllers

import (
	"fnt-backend/api/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AllReportedIssue(c *gin.Context)  {
	var reportedIssue []models.ReportedIssue
	err := db.Order("created_at desc").Find(&reportedIssue).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, reportedIssue)
}

//CreateReportedIssue endpoint
func CreateReportedIssue(c *gin.Context) {
	var reportedIssue models.ReportedIssue
	_ = c.BindJSON(&reportedIssue)
	err := db.Create(&reportedIssue).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, reportedIssue)
}

//UpdateReportedIssue endpoint
func UpdateReportedIssue(c *gin.Context) {
	var reportedIssue models.ReportedIssue
	id := c.Params.ByName("id")
	err := db.Where("id = ?", id).First(&reportedIssue).Error
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_ = c.BindJSON(&reportedIssue)
	db.Save(&reportedIssue)
	c.JSON(http.StatusOK, reportedIssue)
}

//DeleteReportedIssue endpoint
func DeleteReportedIssue(c *gin.Context) {
	id := c.Params.ByName("id")
	var reportedIssue models.ReportedIssue
	db.Where("id = ?", id).Delete(&reportedIssue)
	c.JSON(http.StatusOK, gin.H{"id #" + id: "deleted"})
}
