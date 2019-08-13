package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go_backend/dao"
	"go_backend/models"
	"net/http"
	"time"
)

//AllReportedIssue endpoint
func AllReportedIssue(c *gin.Context) {
	payload := dao.GetAllReportedIssue()
	c.JSON(http.StatusOK, payload)
}

//CreateReportedIssue endpoint
func CreateReportedIssue(c *gin.Context) {
	var reportedIssue models.ReportedIssue
	reportedIssue.ID = primitive.NewObjectID()
	reportedIssue.CreatedAt = time.Now()
	err := c.BindJSON(&reportedIssue)
	if err != nil {
		fmt.Println(err)
		return
	}
	dao.InsertReportedIssue(reportedIssue)
	c.JSON(http.StatusOK, reportedIssue)
}

//UpdateReportedIssue endpoint
func UpdateReportedIssue(c *gin.Context) {
	var issue models.ReportedIssue
	err := c.BindJSON(&issue)
	if err != nil {
		fmt.Println(err)
		return
	}
	dao.UpdateReportedIssue(issue)
}

//UpdateFixedIssue endpoint
func UpdateFixedIssue(c *gin.Context) {
	var issue models.ReportedIssue
	err := c.BindJSON(&issue)
	if err != nil {
		fmt.Println(err)
		return
	}
	dao.FixedReportedIssue(issue)
}

//DeleteReportedIssue endpoint
func DeleteReportedIssue(c *gin.Context) {
	reportedIssueID := c.Param("id")
	dao.DeleteReportedIssue(reportedIssueID)
	c.String(http.StatusOK, "Delete Successful")
}
