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
	//Tech events endpoints
	router.GET("/alltechtalks", handlers.AllTechTalks)
	router.POST("/techtalk", handlers.CreateTechTalk)
	router.POST("/updatetechtalk", handlers.UpdateTechTalk)
	router.DELETE("/techtalk/:id", handlers.DeleteTechTalk)

	//Social event endpoints
	router.GET("/allsocialevents", handlers.AllSocialEvents)
	router.POST("/socialevent", handlers.CreateSocialEvent)
	router.POST("/updatesocialevent", handlers.UpdateSocialEvent)
	router.DELETE("/socialevent/:id", handlers.DeleteSocialEvent)

	//request social event endpoints
	router.GET("/allrequestedsocial", handlers.AllRequestedSocial)
	router.POST("/requestedsocial", handlers.CreateRequestedSocial)
	router.POST("/updaterequestedsocial", handlers.UpdateRequestedSocial)
	router.PUT("/promotesocialrequest", handlers.PromoteSocialRequest)
	router.DELETE("/requestedsocial/:id", handlers.DeleteRequestedSocial)
	router.POST("/votesocial", handlers.UpdateSocialVotes)

	//request tech talk endpoints
	router.GET("/allrequestedtalk", handlers.AllRequestedTalk)
	router.POST("/requestedtalk", handlers.CreateRequestedTalk)
	router.POST("/updaterequestedtalk", handlers.UpdateRequestedTalk)
	router.DELETE("/requestedtalk/:id", handlers.DeleteRequestedTalk)
	router.PUT("/promoterequesttalk", handlers.PromoteRequestedTalk)
	// Start and run the server
	router.Run(":8080")
}
