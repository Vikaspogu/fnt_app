package main

import (
	"go_backend/handlers"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	router.Use(cors.Default())
	// Setup route group for the router
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	//Tech events CRUD endpoints
	router.GET("/alltechtalks", handlers.AllTechTalks)
	router.POST("/techtalk", handlers.CreateTechTalk)
	router.POST("/updatetechtalk", handlers.UpdateTechTalk)
	router.DELETE("/techtalk/:id", handlers.DeleteTechTalk)

	//Social event CRUD endpoints
	router.GET("/allsocialevents", handlers.AllSocialEvents)
	router.POST("/socialevent", handlers.CreateSocialEvent)
	router.POST("/updatesocialevent", handlers.UpdateSocialEvent)
	router.DELETE("/socialevent/:id", handlers.DeleteSocialEvent)

	//request social event CRUD endpoints
	router.GET("/allrequestedsocial", handlers.AllRequestedSocial)
	router.POST("/requestedsocial", handlers.CreateRequestedSocial)
	router.POST("/updaterequestedsocial", handlers.UpdateRequestedSocial)
	router.DELETE("/requestedsocial/:id", handlers.DeleteRequestedSocial)

	//request tech talk CRUD endpoints
	router.GET("/allrequestedtalk", handlers.AllRequestedTalk)
	router.POST("/requestedtalk", handlers.CreateRequestedTalk)
	router.POST("/updaterequestedtalk", handlers.UpdateRequestedTalk)
	router.DELETE("/requestedtalk/:id", handlers.DeleteRequestedTalk)

	//update Scrape Image
	router.PUT("/updatetechimg", handlers.UpdateImageTechTalk)
	router.PUT("/updatesocialimg", handlers.UpdateImageSocial)
	router.PUT("/updatereqsocialimg", handlers.UpdateImageReqSocial)
	router.PUT("/updatereqtalkimg", handlers.UpdateImageReqTalk)

	//promote events to Upcoming schedule
	router.PUT("/promotesocialrequest", handlers.PromoteSocialRequest)
	router.PUT("/promoterequesttalk", handlers.PromoteRequestedTalk)

	//vote for the events
	router.POST("/votesocial", handlers.UpdateSocialVotes)

	// Start and run the server
	router.Run(":8080")
}
