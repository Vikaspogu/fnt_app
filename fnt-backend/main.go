package main

import (
	"fnt-backend/api/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func main()  {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders:     []string{"Origin", "content-type", "accept", "authorization", "Platform"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"ping": "pong",
		})
	})

	//Tech events CRUD endpoints
	r.GET("/alltechtalks",  controllers.AllTechTalks)
	r.POST("/techtalk",  controllers.CreateTechTalk)
	r.PUT("/updatetechtalk/:id",  controllers.UpdateTechTalk)
	r.DELETE("/techtalk/:id",  controllers.DeleteTechTalk)

	//Social event CRUD endpoints
	r.GET("/allsocialevents",  controllers.AllSocialEvents)
	r.POST("/socialevent",  controllers.CreateSocialEvent)
	r.PUT("/updatesocialevent/:id",  controllers.UpdateSocialEvent)
	r.DELETE("/socialevent/:id",  controllers.DeleteSocialEvent)

	//request social event CRUD endpoints
	r.GET("/allrequestedsocial",  controllers.AllRequestedSocials)
	r.POST("/requestedsocial",  controllers.CreateRequestedSocial)
	r.PUT("/updaterequestedsocial/:id",  controllers.UpdateRequestedSocial)
	r.DELETE("/requestedsocial/:id",  controllers.DeleteRequestedSocial)

	//request tech talk CRUD endpoints
	r.GET("/allrequestedtalk",  controllers.AllRequestedTalks)
	r.POST("/requestedtalk",  controllers.CreateRequestedTalk)
	r.PUT("/updaterequestedtalk/:id",  controllers.UpdateRequestedTalk)
	r.DELETE("/requestedtalk/:id",  controllers.DeleteRequestedTalk)

	//reported issue CRUD endpoints
	r.GET("/allreportedissues",  controllers.AllReportedIssue)
	r.POST("/reportedissue",  controllers.CreateReportedIssue)
	r.PUT("/updatereportedissue/:id",  controllers.UpdateReportedIssue)
	r.DELETE("/reportedissue/:id",  controllers.DeleteReportedIssue)
	
	_ = r.Run()
}
